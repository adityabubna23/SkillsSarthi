use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::time::Duration;

use crate::errors::AppError;

/// Gemini API client for Gemma 4 inference.
#[derive(Clone)]
pub struct GeminiClient {
    http: Client,
    api_key: String,
    model_id: String,
    base_url: String,
}

// --- Request DTOs ---

#[derive(Debug, Serialize)]
pub struct GeminiRequest {
    pub contents: Vec<Content>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub generation_config: Option<GenerationConfig>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Content {
    pub role: String,
    pub parts: Vec<Part>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Part {
    pub text: String,
    /// Gemma 4 returns thought parts with `thought: true`; skip these in output.
    #[serde(default, skip_serializing)]
    pub thought: Option<bool>,
}

#[derive(Debug, Serialize)]
pub struct GenerationConfig {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub temperature: Option<f32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_output_tokens: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub top_p: Option<f32>,
}

// --- Response DTOs ---

#[derive(Debug, Deserialize)]
pub struct GeminiResponse {
    pub candidates: Option<Vec<Candidate>>,
    pub error: Option<GeminiError>,
}

#[derive(Debug, Deserialize)]
pub struct Candidate {
    pub content: Option<CandidateContent>,
}

#[derive(Debug, Deserialize)]
pub struct CandidateContent {
    pub parts: Vec<Part>,
}

#[derive(Debug, Deserialize)]
pub struct GeminiError {
    pub code: Option<i32>,
    pub message: String,
}

impl GeminiClient {
    /// Create a new Gemini client.
    pub fn new(api_key: String, model_id: String) -> Self {
        let http = Client::builder()
            .timeout(Duration::from_secs(90))
            .build()
            .expect("Failed to build HTTP client");

        Self {
            http,
            api_key,
            model_id,
            base_url: "https://generativelanguage.googleapis.com/v1beta".to_string(),
        }
    }

    /// Send a generate-content request to Gemma 4 and return the text response.
    pub async fn generate(&self, contents: Vec<Content>) -> Result<String, AppError> {
        self.generate_with_config(contents, None).await
    }

    /// Send a generate-content request with custom generation config.
    pub async fn generate_with_config(
        &self,
        contents: Vec<Content>,
        config: Option<GenerationConfig>,
    ) -> Result<String, AppError> {
        let url = format!(
            "{}/models/{}:generateContent?key={}",
            self.base_url, self.model_id, self.api_key
        );

        let request = GeminiRequest {
            contents,
            generation_config: config,
        };

        tracing::info!(model = %self.model_id, "Sending inference request to Gemini API");

        let response = self
            .http
            .post(&url)
            .json(&request)
            .send()
            .await
            .map_err(|e| {
                if e.is_timeout() {
                    AppError::AiInference("Request timed out after 90 seconds".to_string())
                } else {
                    AppError::AiInference(format!("Network error: {}", e))
                }
            })?;

        let status = response.status();

        if status == 429 {
            return Err(AppError::AiInference(
                "Rate limited by Gemini API. Please try again later.".to_string(),
            ));
        }

        let body: GeminiResponse = response.json().await.map_err(|e| {
            AppError::AiInference(format!("Failed to parse Gemini response: {}", e))
        })?;

        // Check for API-level errors
        if let Some(err) = body.error {
            return Err(AppError::AiInference(format!(
                "Gemini API error ({}): {}",
                err.code.unwrap_or(0),
                err.message
            )));
        }

        // Extract text from candidates, skipping thought parts
        let candidates = body
            .candidates
            .ok_or_else(|| AppError::AiInference("No candidates in response".to_string()))?;

        let candidate = candidates
            .first()
            .ok_or_else(|| AppError::AiInference("Empty candidates array".to_string()))?;

        let content = candidate
            .content
            .as_ref()
            .ok_or_else(|| AppError::AiInference("No content in candidate".to_string()))?;

        // Collect non-thought text parts
        let text: String = content
            .parts
            .iter()
            .filter(|p| !p.thought.unwrap_or(false))
            .map(|p| p.text.as_str())
            .collect::<Vec<_>>()
            .join("");

        if text.trim().is_empty() {
            return Err(AppError::AiInference(
                "Model returned empty response".to_string(),
            ));
        }

        tracing::info!(
            response_len = text.len(),
            "Received inference response"
        );

        Ok(text)
    }
}
