use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use serde::Serialize;

/// Centralized application error type.
#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("Configuration error: {0}")]
    Config(String),

    #[error("Validation error: {0}")]
    Validation(String),

    #[error("PDF extraction failed: {0}")]
    PdfExtraction(String),

    #[error("AI inference error: {0}")]
    AiInference(String),

    #[error("Backboard API error: {0}")]
    Backboard(String),

    #[error("Resource not found: {0}")]
    NotFound(String),

    #[error("Internal server error")]
    Internal(String),
}

/// JSON error response body.
#[derive(Serialize)]
struct ErrorResponse {
    error: ErrorDetail,
}

#[derive(Serialize)]
struct ErrorDetail {
    code: String,
    message: String,
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, code, message) = match &self {
            AppError::Config(msg) => {
                tracing::error!(error = %msg, "Configuration error");
                (StatusCode::INTERNAL_SERVER_ERROR, "CONFIG_ERROR", msg.clone())
            }
            AppError::Validation(msg) => {
                tracing::warn!(error = %msg, "Validation error");
                (StatusCode::BAD_REQUEST, "VALIDATION_ERROR", msg.clone())
            }
            AppError::PdfExtraction(msg) => {
                tracing::warn!(error = %msg, "PDF extraction error");
                (
                    StatusCode::UNPROCESSABLE_ENTITY,
                    "PDF_EXTRACTION_ERROR",
                    msg.clone(),
                )
            }
            AppError::AiInference(msg) => {
                tracing::error!(error = %msg, "AI inference error");
                (
                    StatusCode::BAD_GATEWAY,
                    "AI_INFERENCE_ERROR",
                    "AI service is temporarily unavailable. Please try again.".to_string(),
                )
            }
            AppError::Backboard(msg) => {
                tracing::error!(error = %msg, "Backboard API error");
                (
                    StatusCode::BAD_GATEWAY,
                    "BACKBOARD_ERROR",
                    "Memory service is temporarily unavailable.".to_string(),
                )
            }
            AppError::NotFound(msg) => {
                (StatusCode::NOT_FOUND, "NOT_FOUND", msg.clone())
            }
            AppError::Internal(msg) => {
                tracing::error!(error = %msg, "Internal server error");
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "INTERNAL_ERROR",
                    "An unexpected error occurred.".to_string(),
                )
            }
        };

        let body = ErrorResponse {
            error: ErrorDetail {
                code: code.to_string(),
                message,
            },
        };

        (status, axum::Json(body)).into_response()
    }
}
