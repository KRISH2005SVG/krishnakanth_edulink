
"use client";

import * as React from "react";
import { Bot, Send, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage } from "@/ai/flows/subject-chat-flow";
import { getChatbotResponse } from "@/actions/chat";

export default function ChatbotPage() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Initial message from chatbot
    async function getInitialMessage() {
      try {
        const response = await getChatbotResponse({ history: [] });
        setMessages([{ role: "model", content: response }]);
      } catch (error) {
        console.error(error);
        setMessages([{ role: "model", content: "Sorry, I'm having trouble starting up. Please try again later." }]);
      } finally {
        setIsLoading(false);
      }
    }
    getInitialMessage();
  }, []);
  
  React.useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setIsLoading(true);

    try {
      const response = await getChatbotResponse({ history: newHistory });
      setMessages([...newHistory, { role: "model", content: response }]);
    } catch (error) {
      setMessages([
        ...newHistory,
        { role: "model", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
       <div className="mb-4">
          <h1 className="text-3xl font-bold font-headline">Tutor Chatbot</h1>
          <p className="text-muted-foreground">Your personal AI tutor, ready to help you with any subject.</p>
        </div>
      <Card className="flex flex-col flex-grow shadow-lg">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center gap-2"><Bot /> AI Tutor</CardTitle>
          <CardDescription>Ask me anything about your selected subject.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col p-0">
          <ScrollArea className="flex-grow p-6" ref={scrollAreaRef}>
            <div className="flex flex-col gap-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${
                    message.role === "user" ? "justify-end" : ""
                  }`}
                >
                  {message.role === "model" && (
                    <div className="bg-primary rounded-full p-2 text-primary-foreground">
                        <Bot className="w-6 h-6" />
                    </div>
                  )}
                  <div
                    className={`max-w-md rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                   {message.role === "user" && (
                    <div className="bg-accent rounded-full p-2 text-accent-foreground">
                        <User className="w-6 h-6" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && messages.length > 0 && (
                 <div className="flex items-start gap-3">
                     <div className="bg-primary rounded-full p-2 text-primary-foreground">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                        <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                 </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
