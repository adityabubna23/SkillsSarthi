use serde::{Deserialize, Serialize};
use crate::models::resume::ResumeData;

/// Request body for interview question generation.
#[derive(Debug, Deserialize)]
pub struct InterviewRequest {
    pub resume_text: Option<String>,
    pub resume_data: Option<ResumeData>,
    pub job_description: Option<String>,
    pub focus_area: Option<String>, // "technical" | "hr" | "project" | "all"
}

/// A single interview question.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InterviewQuestion {
    pub question: String,
    pub category: String,
    pub difficulty: String,
    pub context: String,
    pub suggested_answer_structure: String,
    pub follow_ups: Vec<String>,
}

/// Full interview preparation result.
#[derive(Debug, Serialize, Deserialize)]
pub struct InterviewPrep {
    pub questions: Vec<InterviewQuestion>,
    pub general_tips: Vec<String>,
}
