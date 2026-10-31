mod config;
mod errors;
mod handlers;
mod middleware;
mod models;
mod routes;
mod services;

use std::sync::Arc;
use tracing_subscriber::EnvFilter;

use handlers::AppState;
use services::ai::client::GeminiClient;

#[tokio::main]
async fn main() {
    // Initialize structured logging
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| EnvFilter::new("info")),
        )
        .with_target(true)
        .init();

    tracing::info!("Starting SkillSathi AI backend");

    // Load and validate configuration
    let config = config::AppConfig::from_env();

    // Initialize AI client
    let ai_client = GeminiClient::new(
        config.gemini_api_key.clone(),
        config.gemini_model_id.clone(),
    );

    // Build shared application state
    let state = Arc::new(AppState { ai_client });

    let addr = format!("{}:{}", config.host, config.port);

    // Build routes with CORS and state
    let app = routes::build_routes(&config.frontend_origin, state);

    tracing::info!(address = %addr, "Server listening");

    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .expect("Failed to bind to address");

    axum::serve(listener, app)
        .await
        .expect("Server error");
}
