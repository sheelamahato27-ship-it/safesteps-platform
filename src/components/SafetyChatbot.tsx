import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Shield, AlertTriangle, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/safety-chat`;

const quickActions = [
  { icon: AlertTriangle, label: "I feel unsafe", message: "I feel unsafe right now. What should I do?" },
  { icon: Phone, label: "Emergency numbers", message: "What are the emergency helpline numbers for women's safety?" },
  { icon: MapPin, label: "Safe route tips", message: "How can I choose a safer route when traveling alone?" },
  { icon: Shield, label: "Transport safety", message: "How do I stay safe while using public transport or cabs?" },
];

export function SafetyChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const streamChat = async (userMessages: Message[]) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: userMessages }),
    });

    if (!resp.ok) {
      const error = await resp.json().catch(() => ({ error: "Connection failed" }));
      throw new Error(error.error || "Failed to connect");
    }

    if (!resp.body) throw new Error("No response body");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                return prev.map((m, i) => 
                  i === prev.length - 1 ? { ...m, content: assistantContent } : m
                );
              }
              return [...prev, { role: "assistant", content: assistantContent }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      await streamChat([...messages, userMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        { 
          role: "assistant", 
          content: "I'm sorry, I'm having trouble connecting right now. If you're in immediate danger, please call your local emergency number (911, 112, or 999)." 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (message: string) => {
    sendMessage(message);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 p-4 rounded-full",
          "bg-gradient-to-r from-glow-purple to-glow-pink",
          "shadow-[0_0_30px_rgba(168,85,247,0.5)]",
          "hover:shadow-[0_0_40px_rgba(168,85,247,0.7)]",
          "transition-all duration-300 hover:scale-110",
          isOpen && "hidden"
        )}
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)] h-[600px] max-h-[calc(100vh-100px)]",
          "bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl",
          "shadow-[0_0_50px_rgba(168,85,247,0.3)]",
          "flex flex-col overflow-hidden",
          "transition-all duration-300",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-glow-purple/20 to-glow-pink/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-glow-purple to-glow-pink rounded-full">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">SafeSteps Assistant</h3>
              <p className="text-xs text-muted-foreground">Your safety companion</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="space-y-4">
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-glow-purple/30 to-glow-pink/30 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-glow-purple" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Hi, I'm here to help</h4>
                <p className="text-sm text-muted-foreground">
                  I'm your safety assistant. Ask me anything about staying safe, emergency contacts, or safe travel.
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Quick actions</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleQuickAction(action.message)}
                      className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left group"
                    >
                      <action.icon className="w-4 h-4 text-glow-purple group-hover:text-glow-pink transition-colors" />
                      <span className="text-sm text-foreground">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3",
                    msg.role === "user"
                      ? "bg-gradient-to-r from-glow-purple to-glow-pink text-white"
                      : "bg-muted/50 text-foreground"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex justify-start">
              <div className="bg-muted/50 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-glow-purple rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-glow-purple rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-glow-purple rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-glow-purple/50 transition-all"
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-3 rounded-xl bg-gradient-to-r from-glow-purple to-glow-pink hover:opacity-90 transition-opacity"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-2">
            In an emergency, always call your local emergency number first
          </p>
        </div>
      </div>
    </>
  );
}
