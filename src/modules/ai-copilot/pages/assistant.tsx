import { PageHeader } from "@/components/ds/page-header";
import { AICopilotService } from "../services/ai-copilot.service";
import { AIConversation } from "../types/ai-copilot.types";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sparkles,
  Send,
  Bot,
  User,
  Search,
  Plus,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

export function AIAssistantPage() {
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    AICopilotService.getConversations().then((data) => {
      setConversations(data);
      if (data.length > 0) setActiveId(data[0].id);
    });
  }, []);

  const activeConv = conversations.find((c) => c.id === activeId);

  const handleSend = () => {
    if (!input.trim() || !activeConv) return;

    const userMsg = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input,
      timestamp: new Date().toISOString(),
    };
    const updatedConv = { ...activeConv, messages: [...activeConv.messages, userMsg] };

    setConversations((prev) => prev.map((c) => (c.id === activeId ? updatedConv : c)));
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 100);

    AICopilotService.generateMockResponse(userMsg.content).then((res) => {
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content: res,
        timestamp: new Date().toISOString(),
      };
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeId) return { ...c, messages: [...c.messages, aiMsg] };
          return c;
        }),
      );
      setIsTyping(false);
      setTimeout(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }, 100);
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] -mt-6">
      <div className="flex-none pt-6 pb-2">
        <PageHeader
          title="AI Assistant"
          description="Conversational interface for platform intelligence."
          crumbs={[
            { label: "AI & Automation" },
            { label: "Copilot", to: "/ai-copilot" },
            { label: "Assistant" },
          ]}
        />
      </div>

      <div className="flex-1 grid grid-cols-[280px_1fr] rounded-lg border border-border bg-surface overflow-hidden">
        {/* Sidebar */}
        <div className="border-r border-border flex flex-col bg-muted/10">
          <div className="p-4 border-b border-border space-y-4">
            <Button className="w-full justify-start">
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9 h-9 text-sm bg-background"
                placeholder="Search conversations..."
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors ${activeId === c.id ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50 text-muted-foreground"}`}
                >
                  <div className="truncate mb-1">{c.title}</div>
                  <div className="text-[10px] opacity-70">{c.lastUpdated}</div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col bg-background">
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            {activeConv ? (
              <div className="space-y-6 max-w-3xl mx-auto">
                {activeConv.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-4 ${msg.role === "user" ? "justify-end" : ""}`}
                  >
                    {msg.role === "assistant" && (
                      <Avatar className="w-8 h-8 bg-primary/10 text-primary mt-1">
                        <Bot className="w-4 h-4" />
                      </Avatar>
                    )}
                    <div
                      className={`group max-w-[80%] rounded-2xl p-4 text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm"}`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      {msg.role === "assistant" && (
                        <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto">
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    {msg.role === "user" && (
                      <Avatar className="w-8 h-8 bg-muted text-muted-foreground mt-1">
                        <User className="w-4 h-4" />
                      </Avatar>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-4">
                    <Avatar className="w-8 h-8 bg-primary/10 text-primary mt-1">
                      <Bot className="w-4 h-4" />
                    </Avatar>
                    <div className="bg-muted rounded-2xl rounded-tl-sm p-4 flex gap-1 items-center">
                      <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"></span>
                      <span
                        className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></span>
                      <span
                        className="w-2 h-2 rounded-full bg-primary/80 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
                <Sparkles className="w-12 h-12 text-primary/20" />
                <p>Select or start a conversation</p>
              </div>
            )}
          </ScrollArea>

          <div className="p-4 border-t border-border bg-surface">
            <div className="max-w-3xl mx-auto space-y-3">
              <div className="flex flex-wrap gap-2">
                <BadgePrompt text="Create an event description" onClick={setInput} />
                <BadgePrompt text="Generate evaluation criteria" onClick={setInput} />
                <BadgePrompt text="Create an announcement" onClick={setInput} />
              </div>
              <div className="flex items-center gap-2 relative">
                <Input
                  placeholder="Ask the Copilot anything..."
                  className="flex-1 pr-12 h-12 bg-background border-muted"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button
                  size="icon"
                  className="absolute right-1.5 h-9 w-9 rounded"
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-center text-[10px] text-muted-foreground">
                AI can make mistakes. Verify critical information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BadgePrompt({ text, onClick }: { text: string; onClick: (s: string) => void }) {
  return (
    <button
      onClick={() => onClick(text)}
      className="text-xs bg-muted/50 border border-border hover:bg-muted text-muted-foreground px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
    >
      {text}
    </button>
  );
}
