import React, { useState, useEffect, useRef } from "react";
import { usePediatric } from "../context/PediatricContext";
import { Send, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface QuickChatProps {
  patientId: string;
  currentUserId: string;
  currentUserName: string;
  currentUserRole: string;
}

export const QuickChat: React.FC<QuickChatProps> = ({
  patientId,
  currentUserId,
  currentUserName,
  currentUserRole,
}) => {
  const { getChatThread, startChatThread, addChatMessage, specialists } =
    usePediatric();

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
      text: message.trim(),
    });

    // Mock doctor reply if sender is parent
    if (
      currentUserRole === "Parent" &&
      thread &&
      thread.specialistIds.length > 0
    ) {
      setTimeout(() => {
        const docId = thread.specialistIds[0];
        const doctor = specialists.find(s => s.id === docId);
        if (doctor) {
          addChatMessage(patientId, {
            senderId: doctor.id,
            senderName: doctor.name,
            senderRole: "Specialist",
            text: "Hello! I've received your message. I am reviewing the clinical details now and will provide an update shortly.",
          });
        }
      }, 1500);
    }

    setMessage("");
  };

  if (!thread && currentUserRole === "Parent") {
    return (
      <Card className="mt-8 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Start a Quick Group Chat
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select specialists to invite to the conversation.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-48 overflow-y-auto mb-6 p-1">
            {specialists.map(spec => (
              <div key={spec.id} className="flex items-center space-x-3">
                <Checkbox
                  id={spec.id}
                  checked={selectedSpecialists.includes(spec.id)}
                  onCheckedChange={checked => {
                    if (checked)
                      setSelectedSpecialists([...selectedSpecialists, spec.id]);
                    else
                      setSelectedSpecialists(
                        selectedSpecialists.filter(id => id !== spec.id)
                      );
                  }}
                />
                <label
                  htmlFor={spec.id}
                  className="flex items-center gap-3 text-sm font-medium leading-none cursor-pointer"
                >
                  <img
                    src={spec.avatar}
                    className="w-8 h-8 rounded-full border border-muted"
                    alt="doctor avatar"
                  />
                  {spec.name}{" "}
                  <span className="text-muted-foreground font-normal">
                    ({spec.specialty})
                  </span>
                </label>
              </div>
            ))}
          </div>

          <Button
            onClick={handleStartChat}
            disabled={selectedSpecialists.length === 0}
            className="w-full"
          >
            Start Group Chat
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!thread) {
    return null; // Doctors see nothing if thread not started
  }

  return (
    <Card className="mt-8 flex flex-col h-[400px] shadow-sm">
      <CardHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="w-4 h-4 text-primary" /> Care Team Group Chat
          </CardTitle>
          <div className="text-xs text-muted-foreground font-medium">
            {thread.specialistIds.length} specialist(s) in chat
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4 overflow-y-auto bg-muted/20 space-y-4">
        {thread.messages.map(msg => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1 font-medium">
                {msg.senderName} ({msg.senderRole})
              </div>
              <div
                className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm shadow-sm ${isMe ? "bg-primary text-primary-foreground rounded-br-none" : "bg-background border text-foreground rounded-bl-none"}`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        {thread.messages.length === 0 && (
          <div className="text-center text-muted-foreground text-sm mt-10">
            No messages yet. Say hello!
          </div>
        )}
        <div ref={chatEndRef} />
      </CardContent>

      <div className="p-3 border-t bg-background rounded-b-xl">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-full bg-muted/50"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim()}
            className="rounded-full shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
};
