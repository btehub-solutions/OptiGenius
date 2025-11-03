"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type AnalysisContext = {
  url: string;
  title: string;
  metaDescription: string;
  headings: { h1: string[]; h2: string[]; h3: string[] };
  score: number;
  aiInsights?: {
    summary: string;
    suggestions: string[];
  } | null;
  geoAnalysis?: {
    aiReadinessScore: number;
    entities: string[];
    aiRankingScore: number;
    readinessFactors: string[];
  } | null;
};

type AIChatPanelProps = {
  analysisContext: AnalysisContext | null;
};

const SUGGESTED_QUESTIONS = [
  "Why is my SEO score low?",
  "Rewrite my meta description for AI ranking",
  "How can I improve my AI readiness score?",
  "What are the most important issues to fix?",
];

export default function AIChatPanel({ analysisContext }: AIChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          context: analysisContext,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        role: "assistant",
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed inset-x-4 bottom-4 z-50 flex h-[calc(100vh-2rem)] flex-col rounded-lg shadow-2xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:h-[600px] sm:w-[400px]">
          <Card className="flex h-full flex-col overflow-hidden border-2 border-purple-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                <h3 className="font-semibold">AI SEO Assistant</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 transition-colors hover:bg-white/20"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
              {messages.length === 0 ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-white p-4 shadow-sm">
                    <p className="text-sm text-gray-700">
                      👋 Hi! I'm your AI SEO assistant. I can help you understand your analysis results and provide actionable advice.
                    </p>
                  </div>
                  {analysisContext && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-600">Try asking:</p>
                      {SUGGESTED_QUESTIONS.map((question, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestedQuestion(question)}
                          className="w-full rounded-lg border border-purple-200 bg-white p-3 text-left text-sm text-gray-700 transition-all hover:border-purple-400 hover:bg-purple-50"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-4 py-2 ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                            : "bg-white text-gray-800 shadow-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                        <p
                          className={`mt-1 text-xs ${
                            msg.role === "user" ? "text-purple-100" : "text-gray-400"
                          }`}
                        >
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="rounded-lg bg-white px-4 py-2 shadow-sm">
                        <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t bg-white p-4">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a question..."
                  disabled={isLoading || !analysisContext}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 disabled:bg-gray-100"
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isLoading || !analysisContext}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {!analysisContext && (
                <p className="mt-2 text-xs text-gray-500">
                  Analyze a page first to start chatting
                </p>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
