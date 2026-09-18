import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { usePediatric } from "../context/PediatricContext";

export const AIHelperBot: React.FC = () => {
  const { getPatientById, getCaseByPatientId } = usePediatric();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant", content: string }[]>([
    { role: "assistant", content: "Hi there! I am the PCN AI Assistant. I can help answer questions about Ishaan's care plan, vitals, or reports. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // We are using hardcoded patient ID as requested for the mock
  const activeChildId = "PT-1001";
  const patient = getPatientById(activeChildId);
  const activeCase = getCaseByPatientId(activeChildId);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      const systemPrompt = `You are a helpful AI medical assistant for the Pediatric Care Network Parent Portal. 
      You are speaking to the guardian of ${patient?.fullName} (Age: ${patient?.ageYears} yrs, Gender: ${patient?.gender}, Blood Group: ${patient?.bloodGroup}).
      Patient is currently in the ${activeCase?.ward} ward.
      Chief Complaint: ${activeCase?.chiefComplaint}.
      Primary Condition: ${activeCase?.primaryCondition}.
      Latest Vitals: HR ${activeCase?.vitals?.heartRate}, SpO2 ${activeCase?.vitals?.spO2}%, Temp ${activeCase?.vitals?.temperature}°C.
      Please answer the guardian's questions in a supportive, plain-language manner. Do not provide definitive medical diagnoses, but help them understand the reports, vitals, and treatment plan context. Keep answers relatively concise.`;

      const apiMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: "user", content: userMsg }
      ];

      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "google/gemini-1.5-flash", // Using a fast, low-cost model
          messages: apiMessages,
        })
      });

      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
        setMessages(prev => [...prev, { role: "assistant", content: data.choices[0].message.content }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: "I'm sorry, I'm having trouble connecting to my knowledge base right now." }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, a network error occurred." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 transition-transform hover:scale-110 z-50 cursor-pointer border-2 border-white"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-indigo-100 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <h3 className="font-bold text-sm">PCN AI Guide</h3>
                <p className="text-[10px] text-indigo-200">Analyzing clinical data...</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-indigo-200 hover:text-white transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4 max-h-96 min-h-[300px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-white border border-gray-200 text-slate-700 rounded-bl-none shadow-sm"
                  }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2 text-indigo-600">
                  <Loader2 className="w-4 h-4 animate-spin" /> <span className="text-xs">Reading reports...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about reports, vitals..."
              className="flex-1 px-4 py-2 bg-slate-100 border-transparent rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
