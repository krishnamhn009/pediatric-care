import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, Loader2, Sparkles, X } from "lucide-react";
import { usePediatric } from "../context/PediatricContext";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { chatWithOpenRouter, buildParentSystemPrompt, buildClinicianSystemPrompt } from "@/lib/openRouter";

export const AIHelperBot: React.FC = () => {
  const { getPatientById, getCaseByPatientId } = usePediatric();
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeChildId = "PT-1001";
  const patient = getPatientById(activeChildId);
  const activeCase = getCaseByPatientId(activeChildId);

  const isClinician = user?.role !== "Parent";
  const assistantName = isClinician ? "AI Clinical Co-Pilot" : "PCN AI Guide";
  const welcomeMessage = isClinician
    ? `Hello Dr. ${user?.name || "Clinician"}. I'm your AI Co-Pilot. I've analyzed patient ${patient?.fullName}'s latest reports and vitals. How can I assist with your diagnosis or care plan today?`
    : `Hi there! I am the PCN AI Assistant. I can help answer questions about ${patient?.fullName}'s care plan, vitals, or reports. How can I help you today?`;

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: welcomeMessage }]);
    }
  }, [user, messages.length, welcomeMessage]);

  useEffect(() => {
    if (isOpen) {
      // Need a small timeout to let the sheet animation finish before scrolling
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const systemPrompt = isClinician
        ? buildClinicianSystemPrompt({ patient, activeCase, specialist: null, userName: user?.name })
        : buildParentSystemPrompt({ patient, activeCase, specialist: null, ageText: patient ? `${patient.ageYears} yrs ${patient.ageMonths} mo` : "" });

      const apiMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
        { role: "system", content: systemPrompt },
        ...messages.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
        { role: "user", content: userMsg },
      ];

      const reply = await chatWithOpenRouter(apiMessages);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: `⚠️ ${error.message || "Network error. Check VITE_OPENROUTER_API_KEY and try again."}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {!isOpen && (
        <Button
          size="lg"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 px-6 rounded-full shadow-[0_12px_32px_rgba(255,255,255,0.15)] flex items-center gap-3 hover:scale-105 transition-all z-50 bg-white text-black border border-white hover:bg-white/90"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="font-bold tracking-wide text-base">
            {assistantName}
          </span>
        </Button>
      )}

      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col h-full border-l border-white/10 bg-card shadow-2xl"
      >
        <SheetHeader className="p-5 border-b border-white/10 bg-white/[0.04] text-left flex flex-row items-center space-y-0 relative">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white text-black grid place-items-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <SheetTitle className="text-lg leading-tight">
                {assistantName}
              </SheetTitle>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Sparkles className="w-3 h-3" /> Powered by OpenRouter · {patient?.fullName} context injected
              </p>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-5 bg-background">
          <div className="space-y-3 pb-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-white text-black rounded-br-sm shadow-md"
                      : "bg-white/[0.06] border border-white/10 text-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/[0.06] border border-white/10 px-3 py-2 rounded-2xl rounded-bl-sm flex items-center gap-2 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Thinking with {patient?.fullName}'s data…
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 bg-card border-t border-white/10">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={
                isClinician
                  ? "Ask for differential diagnosis..."
                  : "Ask about reports..."
              }
              className="flex-1 rounded-full border-white/10 bg-white/[0.04] focus-visible:ring-white/20"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="rounded-full w-10 h-10 p-0 shrink-0 bg-white text-black hover:bg-white/90 shadow-md"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <div className="text-center mt-2">
            <span className="text-[10px] text-muted-foreground">
              Injected: {patient?.fullName} · {patient?.bloodGroup} · Stage {activeCase?.currentStage} · {activeCase?.ward} · AI via OpenRouter
            </span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
