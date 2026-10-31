use serde::{Deserialize, Serialize};

/// Parsed resume data extracted from a PDF.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct ResumeData {
    pub name: Option<String>,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub education: Vec<Education>,
    pub skills: Vec<String>,
    pub experience: Vec<Experience>,
    pub internships: Vec<Experience>,
    pub projects: Vec<Project>,
    pub certifications: Vec<String>,
    pub achievements: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Education {
    pub institution: String,
    pub degree: String,
    pub field: Option<String>,
    pub year: Option<String>,
    pub grade: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Experience {
    pub title: String,
    pub organization: String,
    pub duration: Option<String>,
    pub description: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Project {
    pub name: String,
    pub description: String,
    pub technologies: Vec<String>,
    pub url: Option<String>,
}

/// Full resume analysis result.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResumeAnalysis {
    pub parsed_data: ResumeData,
    pub summary: String,
    pub strengths: Vec<String>,
    pub missing_info: Vec<String>,
    pub recommendations: Vec<String>,
    pub unreadable_sections: Vec<String>,
}
