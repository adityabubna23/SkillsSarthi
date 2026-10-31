use crate::errors::AppError;
use crate::models::jobs::{JobMatchResult, SkillGapAnalysis};
use crate::services::ai::client::GeminiClient;
use crate::services::ai::parser;
use crate::services::ai::prompts;

/// Match a candidate's resume against a job description.
pub async fn match_job(
    client: &GeminiClient,
    resume_text: &str,
    job_description: &str,
) -> Result<JobMatchResult, AppError> {
    validate_inputs(resume_text, job_description)?;

    let contents = prompts::build_job_match_prompt(resume_text, job_description);
    let response = client.generate(contents).await?;
    let result: JobMatchResult = parser::parse_json(&response)?;

    Ok(result)
}

/// Analyze skill gaps between resume and job requirements.
pub async fn analyze_skill_gap(
    client: &GeminiClient,
    resume_text: &str,
    job_description: &str,
) -> Result<SkillGapAnalysis, AppError> {
    validate_inputs(resume_text, job_description)?;

    let contents = prompts::build_skill_gap_prompt(resume_text, job_description);
    let response = client.generate(contents).await?;
    let result: SkillGapAnalysis = parser::parse_json(&response)?;

    Ok(result)
}

fn validate_inputs(resume_text: &str, job_description: &str) -> Result<(), AppError> {
    if resume_text.trim().is_empty() {
        return Err(AppError::Validation(
            "Resume text is required".to_string(),
        ));
    }
    if job_description.trim().is_empty() {
        return Err(AppError::Validation(
            "Job description is required".to_string(),
        ));
    }
    Ok(())
}
