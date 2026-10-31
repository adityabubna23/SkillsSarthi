use super::client::Content;

/// Build system + user content for resume analysis.
pub fn build_resume_analysis_prompt(resume_text: &str) -> Vec<Content> {
    vec![
        Content {
            role: "user".to_string(),
            parts: vec![super::client::Part {
                text: format!(
                    r#"You are SkillSathi AI, a career analysis assistant. Analyze the following resume text and return a JSON object with this exact structure:

{{
  "parsed_data": {{
    "name": "string or null",
    "email": "string or null",
    "phone": "string or null",
    "education": [{{ "institution": "string", "degree": "string", "field": "string or null", "year": "string or null", "grade": "string or null" }}],
    "skills": ["string"],
    "experience": [{{ "title": "string", "organization": "string", "duration": "string or null", "description": ["string"] }}],
    "internships": [{{ "title": "string", "organization": "string", "duration": "string or null", "description": ["string"] }}],
    "projects": [{{ "name": "string", "description": "string", "technologies": ["string"], "url": "string or null" }}],
    "certifications": ["string"],
    "achievements": ["string"]
  }},
  "summary": "A 2-3 sentence professional summary of the candidate",
  "strengths": ["List of key strengths based on the resume"],
  "missing_info": ["List of commonly expected resume sections that are missing"],
  "recommendations": ["Actionable suggestions to improve this resume"],
  "unreadable_sections": ["Any sections that could not be clearly parsed"]
}}

CRITICAL RULES:
- ONLY extract information that is EXPLICITLY stated in the resume text
- NEVER invent, fabricate, or assume qualifications, experiences, or skills
- If information is unclear or ambiguous, note it in unreadable_sections
- Distinguish between clearly stated facts and inferred information
- Return ONLY the JSON object, no markdown fences or extra text

RESUME TEXT:
{}"#,
                    resume_text
                ),
                thought: None,
            }],
        },
    ]
}

/// Build content for job description matching.
pub fn build_job_match_prompt(resume_text: &str, job_description: &str) -> Vec<Content> {
    vec![
        Content {
            role: "user".to_string(),
            parts: vec![super::client::Part {
                text: format!(
                    r#"You are SkillSathi AI, a career matching assistant. Compare the candidate's resume against the job description and return a JSON object with this exact structure:

{{
  "matching_skills": [{{ "skill": "string", "evidence": "where this was found in the resume" }}],
  "missing_skills": ["skills required but not found in resume"],
  "relevant_projects": ["project names from resume that are relevant"],
  "relevant_experience": ["experience entries that match job requirements"],
  "mandatory_requirements": [{{ "requirement": "string", "category": "mandatory", "met": true/false, "evidence": "string or null" }}],
  "preferred_requirements": [{{ "requirement": "string", "category": "preferred", "met": true/false, "evidence": "string or null" }}],
  "gaps": ["significant gaps between candidate and job requirements"],
  "suggestions": ["actionable steps to become a stronger candidate"],
  "compatibility_score": 0-100,
  "score_explanation": "Brief explanation of how the score was determined"
}}

CRITICAL RULES:
- The compatibility_score is a heuristic estimate, NOT an ATS score or hiring prediction
- Explain WHY each requirement matches or doesn't match
- Distinguish mandatory vs preferred requirements
- NEVER use college prestige or institutional reputation as a factor
- Base scoring purely on demonstrated skills, projects, and experience
- Return ONLY the JSON object, no markdown fences or extra text

RESUME TEXT:
{}

JOB DESCRIPTION:
{}"#,
                    resume_text, job_description
                ),
                thought: None,
            }],
        },
    ]
}

/// Build content for skill gap analysis.
pub fn build_skill_gap_prompt(resume_text: &str, job_description: &str) -> Vec<Content> {
    vec![
        Content {
            role: "user".to_string(),
            parts: vec![super::client::Part {
                text: format!(
                    r#"You are SkillSathi AI, a career development advisor. Analyze the gap between the candidate's current skills and the job requirements. Return a JSON object with this exact structure:

{{
  "recommendations": [
    {{
      "skill_name": "string",
      "importance": "critical|high|medium|low",
      "existing_evidence": ["what the candidate already knows related to this"],
      "missing_knowledge": ["specific knowledge gaps"],
      "learning_objectives": ["what they need to learn"],
      "practice_projects": ["project ideas to build this skill"],
      "priority": 1-10
    }}
  ],
  "learning_path_summary": "A paragraph describing the recommended learning path",
  "estimated_timeline": "Realistic time estimate to address the top gaps"
}}

CRITICAL RULES:
- Limit to 5-7 top recommendations to avoid overwhelming beginners
- Prioritize high-impact skills that appear in multiple job requirements
- Include practical, achievable project suggestions
- Be realistic about timelines
- Return ONLY the JSON object, no markdown fences or extra text

RESUME TEXT:
{}

JOB DESCRIPTION:
{}"#,
                    resume_text, job_description
                ),
                thought: None,
            }],
        },
    ]
}

/// Build content for interview preparation.
pub fn build_interview_prompt(
    resume_text: &str,
    job_description: Option<&str>,
    focus_area: Option<&str>,
) -> Vec<Content> {
    let focus = focus_area.unwrap_or("all");
    let jd_section = job_description
        .map(|jd| format!("\nJOB DESCRIPTION:\n{}", jd))
        .unwrap_or_default();

    vec![
        Content {
            role: "user".to_string(),
            parts: vec![super::client::Part {
                text: format!(
                    r#"You are SkillSathi AI, an interview preparation coach. Generate interview questions based on the candidate's resume and context. Focus area: {focus}.

Return a JSON object with this exact structure:

{{
  "questions": [
    {{
      "question": "string",
      "category": "technical|hr|project|conceptual",
      "difficulty": "easy|medium|hard",
      "context": "why this question is relevant to the candidate",
      "suggested_answer_structure": "how to structure the answer",
      "follow_ups": ["potential follow-up questions"]
    }}
  ],
  "general_tips": ["interview preparation tips specific to this candidate"]
}}

CRITICAL RULES:
- Generate 8-12 questions across the requested categories
- Use the candidate's ACTUAL projects and experience as context
- NEVER fabricate sample experiences for the candidate
- Include follow-up questions that probe deeper understanding
- For "all" focus, include a balanced mix of categories
- Return ONLY the JSON object, no markdown fences or extra text

RESUME TEXT:
{resume_text}{jd_section}"#,
                ),
                thought: None,
            }],
        },
    ]
}

/// Build content for career chat (RAG-augmented).
pub fn build_chat_prompt(context: &str, message: &str) -> Vec<Content> {
    vec![
        Content {
            role: "user".to_string(),
            parts: vec![super::client::Part {
                text: format!(
                    r#"You are SkillSathi AI, a career companion for students and job seekers in India. You help with career guidance, resume improvement, skill development, and interview preparation.

CONTEXT (from knowledge base):
{}

USER MESSAGE:
{}

RULES:
- Be encouraging, professional, and honest
- Give actionable advice based on the context provided
- If you don't have enough information, ask clarifying questions
- Never guarantee employment, interview selection, or specific outcomes
- Focus on skills, projects, and practical knowledge over institutional prestige
- Keep responses concise and helpful"#,
                    context, message
                ),
                thought: None,
            }],
        },
    ]
}
