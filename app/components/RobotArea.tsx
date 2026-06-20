"use client";

import { useState } from "react";
import RobotChatModal from "./RobotChatModal";

export default function RobotArea() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsChatOpen(true)}
        className="relative flex justify-center animate-in fade-in slide-in-from-right-8 duration-1000 delay-300 group cursor-pointer"
      >
        {/* Speech Bubble */}
        <div className="absolute -top-16 right-10 md:-top-16 md:right-16 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none transform translate-y-4 group-hover:translate-y-0">
          <div className="bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white px-6 py-4 rounded-3xl shadow-2xl shadow-indigo-500/20 border border-zinc-100 dark:border-zinc-700 font-extrabold text-xl relative">
            내가 도와줄까? 💡
            {/* Tail of the speech bubble */}
            <div className="absolute -bottom-3 right-8 w-6 h-6 bg-white dark:bg-zinc-800 border-b border-r border-zinc-100 dark:border-zinc-700 transform rotate-45"></div>
          </div>
        </div>

        {/* Robot Image Container */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-white shadow-2xl overflow-hidden border-8 border-indigo-50 dark:border-zinc-800 transition-transform duration-500 group-hover:scale-105 flex items-center justify-center">
          <img 
            src="/robot.jpg" 
            alt="AI Helper Robot" 
            className="w-full h-full object-cover mix-blend-multiply"
          />
        </div>
      </div>

      <RobotChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
}
