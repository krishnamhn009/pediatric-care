import React, { useState, useEffect, useRef } from "react";
import { usePediatric, Specialist } from "../context/PediatricContext";
import { Send, User, Users } from "lucide-react";

interface QuickChatProps {
  patientId: string;
  currentUserId: string;
  currentUserName: string;
  currentUserRole: string;
}

export const QuickChat: React.FC<QuickChatProps> = ({ patientId, currentUserId, currentUserName, currentUserRole }) => {
  const { getChatThread, startChatThread, addChatMessage, specialists } = usePediatric();
  
  const [selectedSpecialists, setSelectedSpecialists] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const thread = getChatThread(patientId);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread?.messages]);

  const handleStartChat = () => {
    if (selectedSpecialists.length > 0) {
      startChatThread(patientId, selectedSpecialists);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    addChatMessage(patientId, {
      senderId: currentUserId,
      senderName: currentUserName,
      senderRole: currentUserRole,
      text: message.trim()
    });
    
    // Mock doctor reply if sender is parent
    if (currentUserRole === "Parent" && thread && thread.specialistIds.length > 0) {
      setTimeout(() => {
        const docId = thread.specialistIds[0];
        const doctor = specialists.find(s => s.id === docId);
        if (doctor) {
          addChatMessage(patientId, {
            senderId: doctor.id,
            senderName: doctor.name,
            senderRole: "Specialist",
            text: "Hello! I've received your message. I am reviewing the clinical details now and will provide an update shortly."
          });
        }
      }, 1500);
    }

    setMessage("");
  };

  if (!thread && currentUserRole === "Parent") {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-50 mt-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Start a Quick Group Chat</h2>
        </div>
        <p className="text-sm text-slate-600 mb-4">Select specialists to invite to the conversation.</p>
        
        <div className="space-y-2 max-h-48 overflow-y-auto mb-4 border rounded p-2">
          {specialists.map(spec => (
            <label key={spec.id} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedSpecialists.includes(spec.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedSpecialists([...selectedSpecialists, spec.id]);
                  } else {
                    setSelectedSpecialists(selectedSpecialists.filter(id => id !== spec.id));
                  }
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <img src={spec.avatar} className="w-6 h-6 rounded-full" alt="doctor avatar" />
              {spec.name} ({spec.specialty})
            </label>
          ))}
        </div>
        
        <button
          onClick={handleStartChat}
          disabled={selectedSpecialists.length === 0}
          className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50"
        >
          Start Group Chat
        </button>
      </div>
    );
  }

  if (!thread) {
    return null; // Doctors see nothing if thread not started
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-blue-50 mt-8 flex flex-col h-96">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-slate-900">Care Team Group Chat</h3>
        </div>
        <div className="text-xs text-slate-500">
          {thread.specialistIds.length} specialist(s) in chat
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
        {thread.messages.map(msg => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className="text-[10px] text-slate-400 mb-1 flex items-center gap-1">
                {msg.senderName} ({msg.senderRole})
              </div>
              <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-slate-700 rounded-bl-none'}`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        {thread.messages.length === 0 && (
          <div className="text-center text-slate-400 text-sm mt-10">
            No messages yet. Say hello!
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 flex gap-2 bg-white rounded-b-2xl">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 bg-slate-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
