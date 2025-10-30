"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Loader2, Sparkles, Minimize2, Maximize2 } from "lucide-react";

// Markdown renderer component
function MarkdownText({ content }: { content: string }) {
  const renderMarkdown = (text: string) => {
    // Split by code blocks first
    const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/);
    
    return parts.map((part, index) => {
      // Handle code blocks
      if (part.startsWith('```')) {
        const code = part.slice(3, -3).trim();
        return (
          <pre key={index} className="bg-black/90 text-gray-100 p-3 rounded-lg my-2 overflow-x-auto text-sm">
            <code>{code}</code>
          </pre>
        );
      }
      
      // Handle inline code
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="bg-gray-200 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono">
            {part.slice(1, -1)}
          </code>
        );
      }
      
      // Process regular text with markdown
      const processedText = part
        // Bold text
        .split(/\*\*([^*]+)\*\*/g)
        .map((segment, i) => 
          i % 2 === 1 ? <strong key={`b-${index}-${i}`}>{segment}</strong> : segment
        )
        .flatMap((segment) => {
          if (typeof segment !== 'string') return segment;
          // Italic text
          return segment.split(/\*([^*]+)\*/g).map((s, i) => 
            i % 2 === 1 ? <em key={`i-${index}-${i}`}>{s}</em> : s
          );
        });
      
      return <span key={index}>{processedText}</span>;
    });
  };
  
  // Split content by newlines and render each line
  const lines = content.split('\n');
  
  return (
    <div className="space-y-2">
      {lines.map((line, index) => {
        // Handle bullet points
        if (line.trim().startsWith('- ')) {
          return (
            <div key={index} className="flex gap-2 ml-2">
              <span className="text-gray-600 mt-1">•</span>
              <span className="flex-1">{renderMarkdown(line.slice(2))}</span>
            </div>
          );
        }
        
        // Handle numbered lists
        const numberedMatch = line.match(/^(\d+)\.\s/);
        if (numberedMatch) {
          return (
            <div key={index} className="flex gap-2 ml-2">
              <span className="text-gray-600 font-semibold">{numberedMatch[1]}.</span>
              <span className="flex-1">{renderMarkdown(line.slice(numberedMatch[0].length))}</span>
            </div>
          );
        }
        
        // Handle headers
        if (line.startsWith('### ')) {
          return <h4 key={index} className="font-semibold text-sm mt-2">{line.slice(4)}</h4>;
        }
        if (line.startsWith('## ')) {
          return <h3 key={index} className="font-semibold text-base mt-2">{line.slice(3)}</h3>;
        }
        if (line.startsWith('# ')) {
          return <h2 key={index} className="font-bold text-lg mt-2">{line.slice(2)}</h2>;
        }
        
        // Regular paragraph
        if (line.trim()) {
          return <p key={index}>{renderMarkdown(line)}</p>;
        }
        
        // Empty line
        return <div key={index} className="h-2" />;
      })}
    </div>
  );
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIChatPanelProps {
  analysisContext: {
    url: string;
    score: number;
    title: string;
    metaDescription: string;
    geoAnalysis: any;
    aiInsights: any;
    issues: string[];
    recommendations: string[];
  };
  isAuthenticated: boolean;
}

export default function AIChatPanel({ analysisContext, isAuthenticated }: AIChatPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          context: analysisContext,
          conversationHistory: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: error instanceof Error ? error.message : "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "Why is my SEO score low?",
    "Rewrite my meta description for AI ranking",
    "How can I improve my GEO score?",
    "What are the most important issues to fix?",
    "Suggest better title tags",
  ];

  if (!isAuthenticated) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>

        {isOpen && (
          <Card className="absolute bottom-0 right-0 w-80 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  AI Assistant
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-red-500/50 hover:scale-110 transition-all h-8 w-8 rounded-full"
                  title="Close chat"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-center text-gray-600">
                Sign in to chat with the AI assistant about your SEO analysis.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 animate-pulse"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <Card className={`absolute bottom-0 right-0 shadow-2xl transition-all ${
          isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
        }`}>
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI SEO Assistant
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:bg-white/30 hover:scale-110 transition-all h-8 w-8 rounded-full"
                  title={isMinimized ? "Maximize" : "Minimize"}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-red-500/50 hover:scale-110 transition-all h-8 w-8 rounded-full"
                  title="Close chat"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {!isMinimized && (
            <CardContent className="flex flex-col h-[calc(600px-80px)] p-0">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                    <h3 className="font-semibold text-gray-800 mb-2">Ask me anything!</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      I can help you understand your SEO analysis and improve your rankings.
                    </p>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase">Try asking:</p>
                      {suggestedQuestions.map((question, idx) => (
                        <button
                          key={idx}
                          onClick={() => setInputMessage(question)}
                          className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors"
                        >
                          &quot;{question}&quot;
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.role === "user"
                              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                              : "bg-gray-50 text-gray-900 border border-gray-200"
                          }`}
                        >
                          <div className="text-sm leading-relaxed">
                            {msg.role === "user" ? (
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                            ) : (
                              <MarkdownText content={msg.content} />
                            )}
                          </div>
                          <p className={`text-xs mt-2 ${
                            msg.role === "user" ? "opacity-70" : "text-gray-500"
                          }`}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-3">
                          <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about your SEO analysis..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
