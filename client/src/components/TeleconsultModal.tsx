import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Mic, MicOff, Video, VideoOff, PhoneOff, Maximize, MessageSquare } from "lucide-react";

interface TeleconsultModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  specialistName: string;
}

export const TeleconsultModal: React.FC<TeleconsultModalProps> = ({
  isOpen,
  onClose,
  patientName,
  specialistName,
}) => {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[85vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-slate-700 animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 bg-red-500/20 text-red-500 rounded text-xs font-bold uppercase tracking-widest animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> Live
            </div>
            <h2 className="text-white font-semibold">Teleconsultation Room</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white hover:bg-slate-700 p-2 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Grid */}
        <div className="flex-1 p-4 flex flex-col md:flex-row gap-4 overflow-hidden bg-slate-950 relative">
          
          {/* Main Speaker (Specialist) */}
          <div className="flex-1 rounded-xl overflow-hidden relative bg-slate-800 border border-slate-700 group">
            <img 
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1600&auto=format&fit=crop" 
              alt="Specialist" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div className="bg-slate-900/60 backdrop-blur px-3 py-1.5 rounded-lg text-white font-medium text-sm border border-slate-700">
                {specialistName}
              </div>
            </div>
          </div>

          {/* Self View (Patient/Parent) */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-4 shrink-0">
            <div className="flex-1 rounded-xl overflow-hidden relative bg-slate-800 border border-slate-700">
               {videoOn ? (
                 <img 
                   src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=600&auto=format&fit=crop" 
                   alt="You" 
                   className="w-full h-full object-cover"
                 />
               ) : (
                 <div className="w-full h-full flex items-center justify-center bg-slate-800">
                   <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-2xl font-bold text-slate-500">
                     {patientName.substring(0, 1)}
                   </div>
                 </div>
               )}
              <div className="absolute bottom-3 left-3 bg-slate-900/60 backdrop-blur px-2 py-1 rounded-lg text-white font-medium text-xs border border-slate-700 flex items-center gap-2">
                {!micOn && <MicOff className="w-3 h-3 text-red-400" />}
                {patientName} (You)
              </div>
            </div>
            
            {/* Chat/Notes Panel Simulation */}
            <div className="flex-1 rounded-xl bg-slate-900 border border-slate-700 flex flex-col hidden md:flex">
               <div className="p-3 border-b border-slate-800 text-slate-300 font-semibold text-sm flex items-center gap-2">
                 <MessageSquare className="w-4 h-4" /> Secure Chat
               </div>
               <div className="flex-1 p-3 text-slate-500 text-xs text-center flex items-center justify-center">
                 End-to-end encrypted chat is active.
               </div>
            </div>
          </div>

        </div>

        {/* Controls Toolbar */}
        <div className="h-20 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-4 sm:gap-6 shrink-0">
          <button 
            onClick={() => setMicOn(!micOn)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              micOn ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={() => setVideoOn(!videoOn)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              videoOn ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button 
            onClick={onClose}
            className="w-16 h-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition-all"
          >
            <PhoneOff className="w-5 h-5" />
          </button>

          <div className="w-px h-8 bg-slate-700 mx-2 hidden sm:block"></div>

          <button className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center hidden sm:flex">
            <Maximize className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};
