use crate::errors::AppError;
use crate::models::resume::ResumeAnalysis;
use crate::services::ai::client::GeminiClient;
use crate::services::ai::parser;
use crate::services::ai::prompts;

/// Analyze resume text using Gemma 4 and return structured analysis.
pub async fn analyze_resume(
    client: &GeminiClient,
    resume_text: &str,
) -> Result<ResumeAnalysis, AppError> {
    if resume_text.trim().is_empty() {
        return Err(AppError::Validation(
            "Resume text is empty".to_string(),
        ));
    }

    // Truncate extremely long resumes to avoid token limits
    const MAX_CHARS: usize = 15_000;
    let text = if resume_text.len() > MAX_CHARS {
        tracing::warn!(
            original_len = resume_text.len(),
            truncated_to = MAX_CHARS,
            "Resume text truncated"
        );
        &resume_text[..MAX_CHARS]
    } else {
        resume_text
    };

    let contents = prompts::build_resume_analysis_prompt(text);
    let response = client.generate(contents).await?;
    let analysis: ResumeAnalysis = parser::parse_json(&response)?;

    Ok(analysis)
}
