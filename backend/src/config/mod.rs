use std::sync::Arc;

/// Application configuration loaded from environment variables.
#[derive(Debug, Clone)]
pub struct AppConfig {
    /// Server host address
    pub host: String,
    /// Server port
    pub port: u16,
    /// Allowed frontend origin for CORS
    pub frontend_origin: String,
    /// Gemini API key for Gemma 4 inference
    pub gemini_api_key: String,
    /// Gemini model identifier
    pub gemini_model_id: String,
    /// Backboard API key for memory and RAG
    pub backboard_api_key: String,
    /// Backboard API base URL
    pub backboard_base_url: String,
}

impl AppConfig {
    /// Load configuration from environment variables.
    ///
    /// Panics with a clear message if any required variable is missing.
    pub fn from_env() -> Arc<Self> {
        dotenvy::dotenv().ok();

        let config = Self {
            host: std::env::var("HOST").unwrap_or_else(|_| "0.0.0.0".to_string()),
            port: std::env::var("PORT")
                .unwrap_or_else(|_| "8080".to_string())
                .parse::<u16>()
                .expect("PORT must be a valid u16"),
            frontend_origin: std::env::var("FRONTEND_ORIGIN")
                .unwrap_or_else(|_| "http://localhost:3000".to_string()),
            gemini_api_key: require_env("GEMINI_API_KEY"),
            gemini_model_id: std::env::var("GEMINI_MODEL_ID")
                .unwrap_or_else(|_| "gemini-3.8-flash".to_string()),
            backboard_api_key: require_env("BACKBOARD_API_KEY"),
            backboard_base_url: std::env::var("BACKBOARD_BASE_URL")
                .unwrap_or_else(|_| "https://app.backboard.io/api".to_string()),
        };

        tracing::info!(
            host = %config.host,
            port = config.port,
            model = %config.gemini_model_id,
            "Configuration loaded"
        );

        Arc::new(config)
    }
}

/// Require an environment variable, panicking with a descriptive message if absent.
fn require_env(key: &str) -> String {
    std::env::var(key).unwrap_or_else(|_| {
        panic!(
            "Required environment variable `{}` is not set. \
             See .env.example for reference.",
            key
        )
    })
}
