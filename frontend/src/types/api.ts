// ─── Common ────────────────────────────────────────────────────────

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

// ─── Health ────────────────────────────────────────────────────────

export interface HealthResponse {
  status: string;
  version: string;
}

// ─── Resume ────────────────────────────────────────────────────────

export interface Education {
  institution: string;
  degree: string;
  field: string | null;
  year: string | null;
  grade: string | null;
}

export interface Experience {
  title: string;
  organization: string;
  duration: string | null;
  description: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url: string | null;
}

export interface ResumeData {
  name: string | null;
  email: string | null;
  phone: string | null;
  education: Education[];
  skills: string[];
  experience: Experience[];
  internships: Experience[];
  projects: Project[];
  certifications: string[];
  achievements: string[];
}

export interface ResumeAnalysis {
  parsed_data: ResumeData;
  summary: string;
  strengths: string[];
  missing_info: string[];
  recommendations: string[];
  unreadable_sections: string[];
}

// ─── Jobs ──────────────────────────────────────────────────────────

export interface SkillMatch {
  skill: string;
  evidence: string;
}

export interface Requirement {
  requirement: string;
  category: string;
  met: boolean;
  evidence: string | null;
}

export interface JobMatchResult {
  matching_skills: SkillMatch[];
  missing_skills: string[];
  relevant_projects: string[];
  relevant_experience: string[];
  mandatory_requirements: Requirement[];
  preferred_requirements: Requirement[];
  gaps: string[];
  suggestions: string[];
  compatibility_score: number;
  score_explanation: string;
}

export interface SkillRecommendation {
  skill_name: string;
  importance: string;
  existing_evidence: string[];
  missing_knowledge: string[];
  learning_objectives: string[];
  practice_projects: string[];
  priority: number;
}

export interface SkillGapAnalysis {
  recommendations: SkillRecommendation[];
  learning_path_summary: string;
  estimated_timeline: string;
}

// ─── Interview ─────────────────────────────────────────────────────

export interface InterviewQuestion {
  question: string;
  category: string;
  difficulty: string;
  context: string;
  suggested_answer_structure: string;
  follow_ups: string[];
}

export interface InterviewPrep {
  questions: InterviewQuestion[];
  general_tips: string[];
}

// ─── Career Chat ───────────────────────────────────────────────────

export interface ChatResponse {
  response: string;
}
