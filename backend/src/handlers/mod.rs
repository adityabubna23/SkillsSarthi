use crate::services::ai::client::GeminiClient;

pub mod career;
pub mod health;
pub mod interview;
pub mod jobs;
pub mod resume;

/// Shared application state accessible to all handlers.
pub struct AppState {
    pub ai_client: GeminiClient,
}
