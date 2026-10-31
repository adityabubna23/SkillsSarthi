use axum::extract::State;
use axum::Json;
use serde::Deserialize;
use std::sync::Arc;

use crate::errors::AppError;
use crate::models::jobs::{JobMatchResult, SkillGapAnalysis};
use crate::services::matching::job_matcher;

use super::AppState;

/// Request body for job matching.
#[derive(Debug, Deserialize)]
pub struct JobMatchBody {
    pub resume_text: String,
    pub job_description: String,
}

/// POST /api/v1/jobs/match
pub async fn match_job(
    State(state): State<Arc<AppState>>,
    Json(body): Json<JobMatchBody>,
) -> Result<Json<JobMatchResult>, AppError> {
    tracing::info!("Processing job match request");

    let result = job_matcher::match_job(
        &state.ai_client,
        &body.resume_text,
        &body.job_description,
    )
    .await?;

    Ok(Json(result))
}

/// Request body for skill gap analysis.
#[derive(Debug, Deserialize)]
pub struct SkillGapBody {
    pub resume_text: String,
    pub job_description: String,
}

/// POST /api/v1/jobs/skill-gap
pub async fn skill_gap(
    State(state): State<Arc<AppState>>,
    Json(body): Json<SkillGapBody>,
) -> Result<Json<SkillGapAnalysis>, AppError> {
    tracing::info!("Processing skill gap analysis request");

    let result = job_matcher::analyze_skill_gap(
        &state.ai_client,
        &body.resume_text,
        &body.job_description,
    )
    .await?;

    Ok(Json(result))
}
