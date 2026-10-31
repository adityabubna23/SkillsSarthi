import type {
  HealthResponse,
  ResumeAnalysis,
  JobMatchResult,
  SkillGapAnalysis,
  InterviewPrep,
  ChatResponse,
  ApiError,
} from "@/types/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options?.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      try {
        const errorBody: ApiError = await response.json();
        errorMessage = errorBody.error.message;
      } catch {
        // Use the default message
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /** GET /api/v1/health */
  async health(): Promise<HealthResponse> {
    return this.request<HealthResponse>("/health");
  }

  /** POST /api/v1/resumes/analyze — multipart file upload */
  async analyzeResume(file: File): Promise<ResumeAnalysis> {
    const formData = new FormData();
    formData.append("file", file);

    return this.request<ResumeAnalysis>("/resumes/analyze", {
      method: "POST",
      body: formData,
    });
  }

  /** POST /api/v1/jobs/match */
  async matchJob(
    resumeText: string,
    jobDescription: string
  ): Promise<JobMatchResult> {
    return this.request<JobMatchResult>("/jobs/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resume_text: resumeText,
        job_description: jobDescription,
      }),
    });
  }

  /** POST /api/v1/jobs/skill-gap */
  async analyzeSkillGap(
    resumeText: string,
    jobDescription: string
  ): Promise<SkillGapAnalysis> {
    return this.request<SkillGapAnalysis>("/jobs/skill-gap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resume_text: resumeText,
        job_description: jobDescription,
      }),
    });
  }

  /** POST /api/v1/interviews/generate */
  async generateInterview(
    resumeText: string,
    jobDescription?: string,
    focusArea?: string
  ): Promise<InterviewPrep> {
    return this.request<InterviewPrep>("/interviews/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resume_text: resumeText,
        job_description: jobDescription,
        focus_area: focusArea,
      }),
    });
  }

  /** POST /api/v1/career/chat */
  async careerChat(
    message: string,
    context?: string
  ): Promise<ChatResponse> {
    return this.request<ChatResponse>("/career/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, context }),
    });
  }
}

export const api = new ApiClient(API_BASE);
