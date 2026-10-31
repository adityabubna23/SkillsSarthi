use axum::extract::{Multipart, State};
use axum::Json;
use std::sync::Arc;

use crate::errors::AppError;
use crate::models::resume::ResumeAnalysis;
use crate::services::resume::{analyzer, pdf};

use super::AppState;

/// POST /api/v1/resumes/analyze
///
/// Accepts a multipart form upload with a PDF file.
/// Extracts text, sends to Gemma 4 for analysis, returns structured result.
pub async fn analyze_resume(
    State(state): State<Arc<AppState>>,
    mut multipart: Multipart,
) -> Result<Json<ResumeAnalysis>, AppError> {
    // Extract the uploaded file from multipart form
    let mut file_bytes: Option<Vec<u8>> = None;
    let mut file_name: Option<String> = None;

    while let Some(field) = multipart
        .next_field()
        .await
        .map_err(|e| AppError::Validation(format!("Invalid multipart data: {}", e)))?
    {
        let name = field.name().unwrap_or("").to_string();

        if name == "file" || name == "resume" {
            file_name = field.file_name().map(|s| s.to_string());

            file_bytes = Some(
                field
                    .bytes()
                    .await
                    .map_err(|e| AppError::Validation(format!("Failed to read file: {}", e)))?
                    .to_vec(),
            );
            break;
        }
    }

    let bytes = file_bytes.ok_or_else(|| {
        AppError::Validation(
            "No file uploaded. Send a PDF file in a 'file' or 'resume' field.".to_string(),
        )
    })?;

    // Validate file extension if provided
    if let Some(ref name) = file_name {
        if !name.to_lowercase().ends_with(".pdf") {
            return Err(AppError::Validation(
                "Only PDF files are accepted".to_string(),
            ));
        }
    }

    tracing::info!(
        file_name = file_name.as_deref().unwrap_or("unknown"),
        size_bytes = bytes.len(),
        "Processing resume upload"
    );

    // Extract text from PDF
    let resume_text = pdf::extract_text_from_pdf(&bytes)?;

    // Analyze with Gemma 4
    let analysis = analyzer::analyze_resume(&state.ai_client, &resume_text).await?;

    Ok(Json(analysis))
}
