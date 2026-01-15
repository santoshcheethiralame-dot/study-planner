"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

// Types
interface StudyBlock {
  id: string;
  title: string;
  subjectCode: string;
  durationMin: number;
  // Updated to match central lib/types.ts exactly
  status?: "pending" | "done" | "active";
}

// Find this interface in FocusSession.tsx and update it:
interface FocusSessionProps {
  block: {
    id: string;
    title: string;
    subjectCode: string;
    durationMin: number;
    status?: "pending" | "done" | "skipped" | "active"; // Add "skipped" here
  };
  onExit: () => void;
  onComplete: () => void;
}
// useFocusTimer Hook
function useFocusTimer(initialMinutes: number, onComplete: () => void, modalOpen: boolean) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/sounds/success.mp3");
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const startTimer = useCallback(() => {
    setIsActive(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsActive(false);
  }, []);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    if (timeLeft !== 0 || completedRef.current) return;

    completedRef.current = true;
    setIsActive(false);

    audioRef.current?.play().catch(() => {});

    if (typeof window !== "undefined" && Notification.permission === "granted") {
      new Notification("Session Complete!", {
        body: "Great job! Time for a short break.",
        icon: "/icons/logo.png",
      });
    }

    onComplete();
  }, [timeLeft, onComplete]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Do nothing if modal is open (notes modal shown)
      if (modalOpen) return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsActive((a) => !a);
      }
      if (e.code === "Escape") {
        pauseTimer();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pauseTimer, modalOpen]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = isActive
        ? `${formatTime(timeLeft)} - Focusing`
        : "Harmony Planner";
    }
  }, [timeLeft, isActive]);

  return {
    timeLeft,
    isActive,
    startTimer,
    pauseTimer,
    formatTime,
  };
}

// NotesModal Component
/**
 * HOW session notes are stored:
 * - Session notes are saved in localStorage using the key 'harmony_session_notes_v1'.
 * - It is an object mapping blockId:string to the notes string (one per block)
 * - The NotesModal manages reading and writing the value for a given blockId.
 * 
 * WHERE session notes are displayed:
 * - In this code, when the "Session Notes" footer button is pressed, the NotesModal opens
 * - If the user already has notes for that session, they are loaded from localStorage and shown in the textarea
 * - Else, the textarea is empty for user input.
 * - After saving, the latest notes persist and can be viewed again for that session via the footer button.
 */

function NotesModal({ 
  blockId, 
  subjectCode, 
  onClose 
}: { 
  blockId: string; 
  subjectCode: string; 
  onClose: () => void;
  
}) {
  // Read existing session notes for this block from localStorage (if present)
  const [notes, setNotes] = useState(() => {
    if (typeof window === "undefined") return "";
    const raw = localStorage.getItem("harmony_session_notes_v1");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed[blockId] === "string") {
          return parsed[blockId];
        }
      } catch {}
    }
    return "";
  });
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Focus the textarea on mount for better UX
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Save session notes to localStorage on close
  const handleDone = () => {
    if (typeof window !== "undefined") {
      // Store as { [blockId]: note, ... } in harmony_session_notes_v1
      const NOTES_KEY = "harmony_session_notes_v1";
      let notesData: Record<string, string> = {};
      const existing = localStorage.getItem(NOTES_KEY);
      if (existing) {
        try {
          notesData = JSON.parse(existing) || {};
        } catch {
          notesData = {};
        }
      }
      // Save or delete note (empty string deletes)
      if (notes.trim().length !== 0)
        notesData[blockId] = notes.trim();
      else
        delete notesData[blockId];
      localStorage.setItem(NOTES_KEY, JSON.stringify(notesData));
    }
    onClose();
  };

  // Prevent timer hotkeys when typing in this modal -- handled by prop drilling/logic to parent hook

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl max-w-md w-full mx-4">
        {/* Session Complete text: lighter for dark backgrounds */}
        <h3 className="text-xl font-bold mb-4 text-green-600 dark:text-green-300" style={{transition: 'color 0.3s'}}>Session Complete! 🎉</h3>
        <p className="text-slate-600 dark:text-slate-200 mb-4">
          Great work on {subjectCode}! Would you like to add any notes?
        </p>
        <textarea 
          ref={textareaRef}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg mb-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 transition-colors"
          rows={4}
          placeholder="What did you learn?"
          // Prevent timer keydown from firing while typing in textarea for *additional* safety
          onKeyDown={e => {
            // Stop propagation up to window's keydown
            e.stopPropagation();
          }}
        />
        <button
          // Save notes to localStorage when user presses Done
          onClick={handleDone}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition"
        >
          Done
        </button>
      </div>
    </div>
  );
}

// Main FocusSession Component
export function FocusSession({ block, onExit, onComplete }: FocusSessionProps) {
  const [showNotePrompt, setShowNotePrompt] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(0);
  const [showNotes, setShowNotes] = useState(false);

  // One "modalOpen" boolean for whether a notes modal is open
  const modalOpen = showNotePrompt || showNotes;

  // Use actual block duration from props
  const { timeLeft, isActive, startTimer, pauseTimer, formatTime } = useFocusTimer(
    block.durationMin,
    () => {
      // When timer completes, show note prompt
      setShowNotePrompt(true);
    },
    modalOpen // pass notes modal state to focus timer to disable hotkeys
  );

  // Calculate progress based on actual duration
  const totalSeconds = block.durationMin * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  const handleComplete = () => {
    pauseTimer();
    setShowNotePrompt(true);
  };

  const handleNoteClose = () => {
    setShowNotePrompt(false);
    setShowNotes(false);
    onComplete();
  };

  const toggleTimer = () => {
    if (isActive) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  const handleBreak = () => {
    pauseTimer();
    setIsBreak(true);
    setBreakTimeLeft(300); // 5 minutes

    // Feature #15 Tracking: Log that a break was started
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const stats = JSON.parse(localStorage.getItem("harmony_stats_v1") || '{}');
      stats.breaksTaken = (stats.breaksTaken || 0) + 1;
      localStorage.setItem("harmony_stats_v1", JSON.stringify(stats));
    }

    const breakInterval = setInterval(() => {
      setBreakTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(breakInterval);
          setIsBreak(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatBreakTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // --- HOW notes are counted for session notes "bubble" in footer (per session) ---
  // This determines the count to show in the footer "Session Notes" indicator
  const sessionNotesCount = (() => {
    if (typeof window === "undefined") return 0;
    try {
      const raw = localStorage.getItem("harmony_session_notes_v1");
      if (!raw) return 0;
      const notesObj = JSON.parse(raw);
      return (notesObj && notesObj[block.id] && notesObj[block.id].trim().length > 0) ? 1 : 0;
    } catch { return 0; }
  })();

  return (
    <>
      <div className="bg-[#F0F4F8] dark:bg-[#0A0F1C] min-h-screen text-slate-800 dark:text-slate-100 font-sans antialiased overflow-hidden relative transition-colors duration-500">
        {/* Animated background blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-[120px] animate-pulse mix-blend-multiply dark:mix-blend-screen opacity-70"></div>
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-emerald-100/40 dark:bg-emerald-900/10 rounded-full blur-[100px] animate-pulse mix-blend-multiply dark:mix-blend-screen opacity-70" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-indigo-100/40 dark:bg-indigo-900/10 rounded-full blur-[120px] animate-pulse mix-blend-multiply dark:mix-blend-screen opacity-70" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="relative z-10 h-screen flex flex-col p-6 md:p-8 lg:p-12">
          {/* Header */}
          <header className="flex justify-between items-start animate-fade-in">
            <button 
              onClick={onExit}
              className="group flex items-center gap-2 px-5 py-3 rounded-full hover:bg-white/60 dark:hover:bg-white/5 transition-all text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
              <span className="font-medium text-sm tracking-wide">End Session</span>
            </button>

            <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-white/8 rounded-2xl p-5 min-w-[280px] shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0 border border-green-100 dark:border-green-500/20">
                  <span className="text-2xl">💾</span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{block.subjectCode}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{block.durationMin} min session</p>
                </div>
              </div>
              <div className="w-full h-1.5 bg-slate-200/60 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-1000"
                  style={{width: `${progress}%`}}
                ></div>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 flex flex-col items-center justify-center -mt-10 md:-mt-16">
            <div className="flex flex-col items-center gap-5 mb-12 animate-fade-in" style={{animationDelay: '100ms'}}>
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-white/5 backdrop-blur-md shadow-sm">
                <span className="relative flex h-2 w-2">
                  {(isActive || isBreak) && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isActive ? 'bg-green-500' : isBreak ? 'bg-blue-500' : 'bg-slate-400'}`}></span>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  {isBreak ? "Break Time" : "Deep Focus"}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-medium text-slate-600 dark:text-slate-300 text-center max-w-lg leading-relaxed tracking-tight">
                {block.title}
              </h2>
            </div>

            {/* Timer Display */}
            <div className="relative group mb-16 animate-fade-in cursor-default select-none" style={{animationDelay: '200ms'}}>
              {isBreak ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="text-6xl">☕</div>
                  <div className="text-[12vh] md:text-[16vh] leading-none font-bold tracking-tighter tabular-nums font-mono drop-shadow-sm text-blue-500">
                    {formatBreakTime(breakTimeLeft)}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-lg">Take a moment to relax</p>
                </div>
              ) : (
                <div className={`text-[16vh] md:text-[22vh] leading-none font-bold tracking-tighter tabular-nums font-mono drop-shadow-sm transition-all duration-300 ${
                  isActive ? 'text-slate-900 dark:text-white group-hover:scale-[1.02]' : 'text-slate-400 dark:text-slate-600'
                }`}>
                  {formatTime(timeLeft)}
                </div>
              )}
            </div>

            {/* Controls */}
            {!isBreak && (
              <div className="flex items-center gap-10 md:gap-16 animate-fade-in" style={{animationDelay: '300ms'}}>
                {/* Stop Button */}
                <button 
                  onClick={handleComplete}
                  className="flex flex-col items-center gap-3 group"
                  disabled={!isActive && progress < 10}
                >
                  <div className="w-16 h-16 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-400 hover:text-red-500 hover:border-red-200 dark:hover:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md transform hover:-translate-y-1 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:transform-none">
                    <span className="text-2xl">⏹</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 duration-200">Finish</span>
                </button>

                {/* Play/Pause Button */}
                <button 
                  onClick={toggleTimer}
                  className="w-24 h-24 rounded-[2.5rem] bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center ring-4 ring-transparent hover:ring-slate-200 dark:hover:ring-slate-800"
                >
                  <span className="text-5xl ml-1">{isActive ? '⏸' : '▶️'}</span>
                </button>

                {/* Break Button */}
                <button 
                  onClick={handleBreak}
                  disabled={!isActive}
                  className="flex flex-col items-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-16 h-16 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-400 hover:text-blue-500 hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md transform hover:-translate-y-1 disabled:hover:transform-none disabled:hover:text-slate-400">
                    <span className="text-2xl">☕</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 duration-200">Break</span>
                </button>
              </div>
            )}

            {isBreak && (
              <button
                onClick={() => {
                  setIsBreak(false);
                  setBreakTimeLeft(0);
                }}
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-semibold text-lg transition-all hover:scale-105 shadow-lg"
              >
                End Break Early
              </button>
            )}
          </main>

          {/* Footer */}
          <footer className="flex justify-between items-end animate-fade-in" style={{animationDelay: '400ms'}}>
            <div className="hidden md:block"></div>
            <button
              className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700 px-6 py-4 rounded-full flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl group"
              onClick={() => setShowNotes(true)}
            >
              <span className="group-hover:rotate-12 transition-transform text-slate-500 dark:text-slate-400 text-xl">📝</span>
              <span className="font-semibold text-sm">Session Notes</span>
              {/* 
                Session notes count:  
                - Display 1 if session has notes (persisted in localStorage) for this block (id). 
                - Otherwise, show 0.
              */}
              <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-[10px] flex items-center justify-center text-slate-600 dark:text-slate-300 ml-1 group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-colors">
                {sessionNotesCount}
              </span>
            </button>
          </footer>
        </div>
      </div>

      {/* Notes Modal (for session auto-complete or footer "Session Notes") */}
      {showNotePrompt && (
        <NotesModal
          blockId={block.id}
          subjectCode={block.subjectCode}
          onClose={handleNoteClose}
        />
      )}
      {/* Show notes if footer button is pressed */}
      {showNotes && !showNotePrompt && (
        <NotesModal
          blockId={block.id}
          subjectCode={block.subjectCode}
          onClose={() => setShowNotes(false)}
        />
      )}
    </>
  );
}