"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Square, Plus, Minus } from "lucide-react";

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsRunning(false);
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const addMinutes = (minutes: number) => {
    setTimeLeft((prev) => Math.max(0, prev + minutes * 60));
  };

  const toggleTimer = () => {
    if (timeLeft > 0) {
      setIsRunning(!isRunning);
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) {
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl shadow-indigo-500/10 border border-zinc-100 dark:border-zinc-800 h-full w-full max-w-md mx-auto">
      <audio ref={audioRef} src="/alarm.mp3" preload="auto" />
      <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-6">
        집중 타이머
      </h2>
      
      <div className="text-6xl sm:text-7xl font-mono font-extrabold text-indigo-600 dark:text-indigo-400 mb-8 tracking-tighter">
        {formatTime(timeLeft)}
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-8 items-center">
        <button
          onClick={() => addMinutes(-30)}
          className="flex items-center gap-1 px-4 py-2 rounded-full font-medium text-sm text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          <Minus size={16} /> 30분
        </button>
        <button
          onClick={() => addMinutes(30)}
          className="flex items-center gap-1 px-4 py-2 rounded-full font-medium text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
        >
          <Plus size={16} /> 30분
        </button>
        <button
          onClick={() => addMinutes(1)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full font-medium text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors shadow-sm"
          title="테스트용 1분 추가"
        >
          <Plus size={12} /> 1분
        </button>
      </div>

      <div className="flex gap-4 w-full">
        <button
          onClick={stopTimer}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
        >
          <Square size={20} fill="currentColor" />
          Stop
        </button>
        <button
          onClick={toggleTimer}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
        >
          <Play size={20} fill={isRunning ? "none" : "currentColor"} className={isRunning ? "hidden" : "block"} />
          {isRunning ? (
            <div className="flex gap-1 items-center">
              <div className="w-1.5 h-4 bg-white rounded-sm"></div>
              <div className="w-1.5 h-4 bg-white rounded-sm"></div>
            </div>
          ) : null}
          <span className="ml-1">{isRunning ? "Pause" : "Start"}</span>
        </button>
      </div>
    </div>
  );
}
