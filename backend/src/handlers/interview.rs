use axum::extract::State;
use axum::Json;
use serde::Deserialize;
use std::sync::Arc;

use crate::errors::AppError;
use crate::models::interview::InterviewPrep;
use crate::services::ai::{parser, prompts};

use super::AppState;

/// Request body for interview generation.
#[derive(Debug, Deserialize)]
pub struct InterviewBody {
    pub resume_text: String,
    pub job_description: Option<String>,
    pub focus_area: Option<String>,
}

/// POST /api/v1/interviews/generate
pub async fn generate_interview(
    State(state): State<Arc<AppState>>,
    Json(body): Json<InterviewBody>,
) -> Result<Json<InterviewPrep>, AppError> {
    if body.resume_text.trim().is_empty() {
        return Err(AppError::Validation(
            "Resume text is required".to_string(),
        ));
    }

    tracing::info!(
        focus_area = body.focus_area.as_deref().unwrap_or("all"),
        "Generating interview questions"
    );

    let contents = prompts::build_interview_prompt(
        &body.resume_text,
        body.job_description.as_deref(),
        body.focus_area.as_deref(),
    );

    let response = state.ai_client.generate(contents).await?;
    let result: InterviewPrep = parser::parse_json(&response)?;

    Ok(Json(result))
}
