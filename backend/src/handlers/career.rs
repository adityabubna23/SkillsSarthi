use axum::extract::State;
use axum::Json;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

use crate::errors::AppError;
use crate::services::ai::{parser, prompts};

use super::AppState;

/// Request body for career chat.
#[derive(Debug, Deserialize)]
pub struct ChatBody {
    pub message: String,
    pub context: Option<String>,
}

/// Response for career chat.
#[derive(Debug, Serialize)]
pub struct ChatResponse {
    pub response: String,
}

/// POST /api/v1/career/chat
pub async fn career_chat(
    State(state): State<Arc<AppState>>,
    Json(body): Json<ChatBody>,
) -> Result<Json<ChatResponse>, AppError> {
    if body.message.trim().is_empty() {
        return Err(AppError::Validation(
            "Message is required".to_string(),
        ));
    }

    tracing::info!("Processing career chat message");

    let context = body.context.as_deref().unwrap_or("No additional context available.");
    let contents = prompts::build_chat_prompt(context, &body.message);
    let response = state.ai_client.generate(contents).await?;

    Ok(Json(ChatResponse { response }))
}
