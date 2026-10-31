use axum::Router;
use axum::routing::{get, post};
use axum::middleware as axum_mw;
use std::sync::Arc;
use std::time::Duration;
use axum::http::Method;
use tower_http::cors::{Any, CorsLayer};

use crate::handlers;
use crate::handlers::AppState;
use crate::middleware;

/// Build all API routes under `/api/v1`.
pub fn build_routes(_frontend_origin: &str, state: Arc<AppState>) -> Router {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([
            Method::GET,
            Method::POST,
            Method::PUT,
            Method::DELETE,
            Method::OPTIONS,
        ])
        .allow_headers(Any)
        .expose_headers(Any)
        .max_age(Duration::from_secs(3600));

    let api_v1 = Router::new()
        .route("/health", get(handlers::health::health_check))
        .route("/resumes/analyze", post(handlers::resume::analyze_resume))
        .route("/jobs/match", post(handlers::jobs::match_job))
        .route("/jobs/skill-gap", post(handlers::jobs::skill_gap))
        .route("/interviews/generate", post(handlers::interview::generate_interview))
        .route("/career/chat", post(handlers::career::career_chat))
        .with_state(state);

    Router::new()
        .nest("/api/v1", api_v1)
        .layer(axum_mw::from_fn(middleware::request_id))
        .layer(cors)
}

