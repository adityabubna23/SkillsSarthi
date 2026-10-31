"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, Send, Loader2, Sparkles, User, CheckCircle2, FileText } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader, ErrorDisplay } from "@/components/ui/shared";
import { useSession } from "@/hooks/useSession";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "What skills are most in demand for freshers in India?",
  "How can I improve my resume for a frontend developer role?",
  "What projects should I build to strengthen my portfolio?",
  "How should I prepare for a technical interview at a startup?",
  "What is the best way to transition into a tech career?",
];

export default function CareerPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { resumeText, hasResume } = useSession();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (message?: string) => {
    const text = message || input.trim();
    if (!text || loading) return;

    setInput("");
    setError(null);

    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // Pass resume text as context if available
      const result = await api.careerChat(
        text,
        hasResume ? resumeText : undefined
      );
      const assistantMessage: Message = {
        role: "assistant",
        content: result.response,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get response");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <PageHeader
        title="Career Assistant"
        description="Chat with an AI career companion for personalized guidance."
        icon={<MessageCircle size={22} className="text-white" />}
      />

      <div className="glass-card flex flex-col" style={{ height: "calc(100vh - 220px)", minHeight: "500px" }}>
        {/* Session indicator */}
        {hasResume && (
          <div className="flex items-center gap-2 text-xs text-[var(--brand-400)] px-4 py-2 border-b border-[var(--glass-border)]">
            <CheckCircle2 size={12} />
            <span>Your resume is loaded — AI will use it for personalized advice.</span>
          </div>
        )}
        {!hasResume && (
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] px-4 py-2 border-b border-[var(--glass-border)]">
            <FileText size={12} />
            <span>
              <Link href="/resume" className="text-[var(--brand-400)] hover:underline">Analyze your resume</Link> first for personalized career advice.
            </span>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center mb-6 animate-float">
                <Sparkles size={28} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                How can I help with your career?
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-md">
                Ask me about resume writing, skill development, interview preparation,
                career planning, or anything else related to your career journey.
              </p>

              {/* Suggestion Chips */}
              <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    className="btn-secondary text-xs py-2 px-3 text-left"
                    onClick={() => handleSend(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className="flex items-start gap-3 max-w-[80%]">
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles size={14} className="text-white" />
                  </div>
                )}
                <div
                  className={
                    msg.role === "user"
                      ? "chat-message-user"
                      : "chat-message-assistant"
                  }
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-[var(--surface-600)] flex items-center justify-center flex-shrink-0 mt-1">
                    <User size={14} className="text-[var(--text-secondary)]" />
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles size={14} className="text-white" />
                </div>
                <div className="chat-message-assistant">
                  <div className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-[var(--brand-400)]" />
                    <span className="text-sm text-[var(--text-muted)]">Thinking…</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="max-w-lg mx-auto">
              <ErrorDisplay message={error} onRetry={() => setError(null)} />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-[var(--glass-border)] p-4">
          <div className="flex gap-3 items-end">
            <textarea
              id="career-chat-input"
              className="textarea-field min-h-[44px] max-h-[120px] resize-none"
              rows={1}
              placeholder="Ask about your career…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              id="career-chat-send"
              className="btn-primary py-3 px-4 flex-shrink-0"
              disabled={!input.trim() || loading}
              onClick={() => handleSend()}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[0.6rem] text-[var(--text-muted)] mt-2 text-center">
            AI responses are for guidance only. Never guarantee employment or hiring outcomes.
          </p>
        </div>
      </div>
    </>
  );
}
