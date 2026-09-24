import React, { useState, useMemo } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Maximize2,
  MessageSquare,
  Users,
  ShieldCheck,
  Clock,
  BadgeCheck,
  Search,
  UserPlus,
  Pin,
  MoreVertical,
  ScreenShare,
  Hand,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { usePediatric } from "../context/PediatricContext";

interface TeleconsultModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  specialistName: string;
}

type Participant = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  micOn: boolean;
  videoOn: boolean;
  pinned?: boolean;
};

export const TeleconsultModal: React.FC<TeleconsultModalProps> = ({
  isOpen,
  onClose,
  patientName,
  specialistName,
}) => {
  const { specialists } = usePediatric();
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [showPeople, setShowPeople] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [search, setSearch] = useState("");
  const [participants, setParticipants] = useState<Participant[]>([
    { id: "spec", name: specialistName, role: "Pediatric Neurologist", avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=600&auto=format&fit=crop", micOn: true, videoOn: true, pinned: true },
    { id: "patient", name: `${patientName} (You)`, role: "Guardian", avatar: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=600&auto=format&fit=crop", micOn: true, videoOn: true },
  ]);

  const filteredSpecs = useMemo(() => {
    const q = search.toLowerCase();
    return specialists.filter(s => !participants.some(p => p.id === s.id) && (s.name.toLowerCase().includes(q) || s.specialty.toLowerCase().includes(q))).slice(0, 6);
  }, [search, specialists, participants]);

  const addDoctor = (spec: typeof specialists[0]) => {
    setParticipants(prev => [...prev, { id: spec.id, name: spec.name, role: spec.title, avatar: spec.avatar, micOn: true, videoOn: true }]);
    setShowInvite(false);
    setSearch("");
  };

  const gridCols = participants.length <= 2 ? "grid-cols-1 md:grid-cols-2" : participants.length <= 4 ? "grid-cols-2" : "grid-cols-3";

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-[1100px] w-[96vw] h-[84vh] max-h-[760px] p-0 overflow-hidden bg-[#0f0f0f] border-white/10 rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.7)] flex flex-col gap-0">
        {/* Meet Header */}
        <DialogHeader className="px-4 py-3 bg-white/[0.03] border-b border-white/10 flex flex-row items-center justify-between space-y-0 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 text-xs font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
            </span>
            <DialogTitle className="text-sm font-bold tracking-tight m-0 leading-none hidden sm:block">Meet — {patientName} consult</DialogTitle>
            <Badge variant="outline" className="hidden md:inline-flex rounded-full border-white/10 bg-white/[0.04] text-xs gap-1">
              <Clock className="w-3 h-3" /> 00:04:21
            </Badge>
            <Badge variant="outline" className="hidden lg:inline-flex rounded-full border-white/10 bg-white/[0.04] text-xs gap-1">
              <ShieldCheck className="w-3 h-3" /> E2E Encrypted
            </Badge>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5" /> {participants.length}
            </span>
            <Button size="sm" onClick={() => setShowInvite(true)} className="rounded-full bg-white text-black hover:bg-white/90 gap-1.5 h-8 text-xs">
              <UserPlus className="w-3.5 h-3.5" /> Add doctor
            </Button>
            <DialogDescription className="sr-only">Secure teleconsultation between {patientName} and {specialistName}</DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden bg-background relative">
          <div className="absolute inset-0 solaris-grid opacity-[0.08] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] pointer-events-none" aria-hidden />

          {/* Main Grid — Google Meet style */}
          <div className="flex-1 p-3 md:p-4 flex flex-col gap-3 overflow-hidden">
            <div className={`flex-1 grid ${gridCols} gap-3 auto-rows-fr overflow-hidden`}>
              {participants.map(p => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`relative rounded-2xl overflow-hidden bg-black border ${p.pinned ? "border-white/20 shadow-xl" : "border-white/10"} group min-h-[140px]`}
                >
                  {p.videoOn ? (
                    <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full grid place-items-center bg-[#0a0a0a]">
                      <div className="h-16 w-16 rounded-2xl bg-white text-black grid place-items-center text-xl font-bold">{p.name[0]}</div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur border border-white/10 text-white text-xs max-w-[70%] truncate">
                      {!p.micOn && <MicOff className="w-3 h-3 text-red-300 shrink-0" />}
                      <span className="truncate">{p.name}</span>
                    </span>
                    <span className="hidden sm:inline-flex h-6 w-6 rounded-full bg-black/40 backdrop-blur border border-white/10 grid place-items-center text-white">
                      <Pin className={`w-3 h-3 ${p.pinned ? "text-white" : "text-white/40"}`} />
                    </span>
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <Badge className={`rounded-full text-xs px-1.5 py-0.5 border ${p.micOn ? "bg-white text-black border-white" : "bg-red-500 text-white border-red-500"}`}>
                      {p.micOn ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                    </Badge>
                  </div>
                  {p.pinned && (
                    <Badge className="absolute top-2 left-2 rounded-full bg-white text-black border-white text-xs gap-1">
                      <BadgeCheck className="w-3 h-3" /> Pinned
                    </Badge>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Invite strip */}
            <div className="hidden md:flex items-center gap-2 p-2 rounded-xl bg-white/[0.04] border border-white/10">
              <span className="text-xs text-muted-foreground">Pull in doctors:</span>
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                {filteredSpecs.slice(0, 3).map(s => (
                  <button key={s.id} onClick={() => addDoctor(s)} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-black text-xs font-medium hover:bg-white/90">
                    <img src={s.avatar} alt={s.name} className="h-4 w-4 rounded-full object-cover" /> {s.name.split(" ").slice(-1)[0]}
                  </button>
                ))}
              </div>
              <Button size="sm" variant="outline" onClick={() => setShowInvite(true)} className="rounded-full h-7 border-white/10 bg-white/[0.04] text-xs gap-1">
                <Search className="w-3 h-3" /> Browse
              </Button>
            </div>
          </div>

          {/* People / Chat Side Panel — collapsible */}
          <AnimatePresence>
            {showPeople && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="w-[320px] border-l border-white/10 bg-card flex flex-col overflow-hidden hidden lg:flex"
              >
                <div className="h-12 px-3 flex items-center justify-between border-b border-white/10 shrink-0">
                  <span className="text-sm font-semibold flex items-center gap-2"><Users className="w-4 h-4" /> People · {participants.length}</span>
                  <Button variant="ghost" size="icon" onClick={() => setShowPeople(false)} className="rounded-full h-7 w-7"><Search className="w-4 h-4" /></Button>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {participants.map(p => (
                    <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/10">
                      <img src={p.avatar} alt={p.name} className="h-8 w-8 rounded-full object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{p.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{p.role}</div>
                      </div>
                      <span className={`h-6 w-6 rounded-full grid place-items-center border ${p.micOn ? "bg-white text-black border-white" : "bg-red-500/15 text-red-300 border-red-500/20"}`}>
                        {p.micOn ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-white/10">
                  <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3 text-xs text-muted-foreground">End-to-end encrypted · Solaris</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls — Meet style */}
        <div className="h-[84px] px-4 bg-white/[0.03] border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="hidden lg:inline">Meet • {patientName}</span>
            <Badge variant="outline" className="rounded-full border-white/10 bg-white/[0.04] text-xs hidden lg:inline-flex">HD</Badge>
          </div>
          <div className="flex items-center gap-2 md:gap-3 mx-auto">
            <Button variant={micOn ? "secondary" : "destructive"} size="icon" onClick={() => setMicOn(!micOn)} className={`h-12 w-12 rounded-full border ${micOn ? "bg-white text-black border-white hover:bg-white/90" : "bg-red-500 text-white border-red-500 hover:bg-red-600"}`}>
              {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>
            <Button variant={videoOn ? "secondary" : "destructive"} size="icon" onClick={() => setVideoOn(!videoOn)} className={`h-12 w-12 rounded-full border ${videoOn ? "bg-white text-black border-white hover:bg-white/90" : "bg-red-500 text-white border-red-500 hover:bg-red-600"}`}>
              {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex h-12 w-12 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/10">
              <ScreenShare className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex h-12 w-12 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/10">
              <Hand className="w-5 h-5" />
            </Button>
            <Button variant="destructive" onClick={onClose} className="h-12 px-6 rounded-full bg-red-500 hover:bg-red-600 text-white gap-2 shadow-[0_8px_24px_rgba(239,68,68,0.3)]">
              <PhoneOff className="w-5 h-5" /> Leave
            </Button>
            <div className="w-px h-8 bg-white/10 mx-1 hidden sm:block" />
            <Button variant="ghost" size="icon" onClick={() => setShowPeople(v => !v)} className={`h-12 w-12 rounded-full border ${showPeople ? "bg-white text-black border-white" : "bg-white/[0.04] border-white/10 hover:bg-white/10"}`}>
              <Users className="w-5 h-5" />
            </Button>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/10">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Invite Modal */}
        <AnimatePresence>
          {showInvite && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm grid place-items-center p-4">
              <motion.div initial={{ scale: 0.98, y: 8 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-lg rounded-2xl bg-card border border-white/10 shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10 flex items-center gap-3">
                  <span className="h-9 w-9 rounded-xl bg-white text-black grid place-items-center"><UserPlus className="w-5 h-5" /></span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold">Add doctors to call</div>
                    <div className="text-xs text-muted-foreground">Search by name or specialty — pulls into Meet grid</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setShowInvite(false)} className="rounded-full"><Search className="w-4 h-4" /></Button>
                </div>
                <div className="p-4 space-y-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search doctors — e.g., Cardiology, Neurology" className="pl-9 rounded-xl border-white/10 bg-white/[0.04]" autoFocus />
                  </div>
                  <div className="max-h-[260px] overflow-y-auto space-y-1 pr-1">
                    {filteredSpecs.length === 0 ? (
                      <div className="py-8 text-center text-sm text-muted-foreground">No more doctors to add — all invited</div>
                    ) : (
                      filteredSpecs.map(s => (
                        <div key={s.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/10">
                          <img src={s.avatar} alt={s.name} className="h-9 w-9 rounded-xl object-cover border border-white/10" />
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold truncate">{s.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{s.title} · {s.specialty}</div>
                          </div>
                          <Button size="sm" onClick={() => addDoctor(s)} className="rounded-full bg-white text-black hover:bg-white/90 h-8 gap-1">
                            <UserPlus className="w-3.5 h-3.5" /> Add
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="p-3 border-t border-white/10 flex justify-end">
                  <Button variant="outline" onClick={() => setShowInvite(false)} className="rounded-full border-white/10">Done</Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
