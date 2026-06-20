"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, Music } from "lucide-react";

export default function WhiteNoisePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      // 웹 브라우저 정책상 사용자 인터랙션 없이 자동 재생이 차단될 수 있으므로 예외 처리를 합니다.
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    }
  }, []); // Run once on mount

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* 
        루프 옵션 추가. 
        브라우저에 따라 자동 재생이 안 될 수 있어, 실패 시 사용자가 켤 수 있도록 상태 처리.
      */}
      <audio ref={audioRef} src="/white-noise.mp3" loop />
      
      {/* Volume Control Panel */}
      <div 
        className={`bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-4 transition-all duration-300 origin-bottom-right ${
          isExpanded ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-3 w-32">
          <span className="text-xs font-bold text-zinc-500">배경음악 크기</span>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={handleVolumeChange}
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-700 p-1.5">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors"
          title="음량 조절"
        >
          <Volume2 size={18} />
        </button>
        <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700"></div>
        <button
          onClick={togglePlay}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-colors ${
            isPlaying 
              ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400" 
              : "bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400"
          }`}
        >
          <Music size={16} />
          {isPlaying ? "백색소음 끄기" : "백색소음 켜기"}
        </button>
      </div>
    </div>
  );
}
