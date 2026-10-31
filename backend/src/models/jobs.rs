use serde::{Deserialize, Serialize};
use crate::models::resume::ResumeData;

/// Request body for job description matching.
#[derive(Debug, Deserialize)]
pub struct JobMatchRequest {
    pub resume_text: Option<String>,
    pub resume_data: Option<ResumeData>,
    pub job_description: String,
}

/// A single skill match result.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SkillMatch {
    pub skill: String,
    pub evidence: String,
}

/// A job requirement classification.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Requirement {
    pub requirement: String,
    pub category: String, // "mandatory" or "preferred"
    pub met: bool,
    pub evidence: Option<String>,
}

/// Full job matching result.
#[derive(Debug, Serialize, Deserialize)]
pub struct JobMatchResult {
    pub matching_skills: Vec<SkillMatch>,
    pub missing_skills: Vec<String>,
    pub relevant_projects: Vec<String>,
    pub relevant_experience: Vec<String>,
    pub mandatory_requirements: Vec<Requirement>,
    pub preferred_requirements: Vec<Requirement>,
    pub gaps: Vec<String>,
    pub suggestions: Vec<String>,
    pub compatibility_score: u8,
    pub score_explanation: String,
}

/// Request body for skill gap analysis.
#[derive(Debug, Deserialize)]
pub struct SkillGapRequest {
    pub resume_text: Option<String>,
    pub resume_data: Option<ResumeData>,
    pub job_description: String,
}

/// A single skill recommendation.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SkillRecommendation {
    pub skill_name: String,
    pub importance: String,
    pub existing_evidence: Vec<String>,
    pub missing_knowledge: Vec<String>,
    pub learning_objectives: Vec<String>,
    pub practice_projects: Vec<String>,
    pub priority: u8,
}

/// Full skill gap analysis result.
#[derive(Debug, Serialize, Deserialize)]
pub struct SkillGapAnalysis {
    pub recommendations: Vec<SkillRecommendation>,
    pub learning_path_summary: String,
    pub estimated_timeline: String,
}
