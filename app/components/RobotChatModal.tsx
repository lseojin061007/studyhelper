"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Paperclip, Loader2 } from "lucide-react";

interface RobotChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: "robot" | "user";
  text: string;
}

export default function RobotChatModal({ isOpen, onClose }: RobotChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "robot", text: "안녕! 나는 너의 학습 헬퍼야. 어떤 과목을 준비 중인지 알려주면, 요약과 공부법을 추천해 줄게! 📝" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Form State
  const [subjectType, setSubjectType] = useState<"전공" | "교양">("전공");
  const [dDay, setDDay] = useState("");
  const [targetGrade, setTargetGrade] = useState("A+");
  const [files, setFiles] = useState<File[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dDay) return alert("시험까지 며칠 남았는지 입력해 주세요!");
    if (files.length === 0) return alert("분석할 시험 자료 파일(.txt, .pdf 등)을 첨부해 주세요!");

    const userText = `과목: ${subjectType}\n남은 기간: D-${dDay}\n목표 성적: ${targetGrade}\n\n첨부된 ${files.length}개의 자료를 분석해서 요약과 공부법을 알려줘!`;
    const newMessageId = Date.now().toString();
    
    setMessages(prev => [...prev, { id: newMessageId, sender: "user", text: userText }]);
    setIsTyping(true);

    const formData = new FormData();
    formData.append("subjectType", subjectType);
    formData.append("dDay", dDay);
    formData.append("targetGrade", targetGrade);
    files.forEach((f) => formData.append("files", f));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "API 오류 발생");
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), sender: "robot", text: data.reply }]);
      setFiles([]); // 전송 후 파일 초기화
    } catch (error: unknown) {
      console.error(error);
      const message = error instanceof Error ? error.message : "알 수 없는 오류 발생";
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: "robot", text: `미안해, 분석 중에 오류가 발생했어. (${message})` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[#b2c7d9] dark:bg-zinc-900 w-full max-w-lg rounded-3xl shadow-2xl flex flex-col h-[85vh] overflow-hidden border border-zinc-200 dark:border-zinc-800">
        {/* Header */}
        <div className="bg-white/50 dark:bg-zinc-800/50 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white shadow-sm overflow-hidden flex items-center justify-center p-1 border border-zinc-200 dark:border-zinc-700">
              <img src="/robot.jpg" alt="Robot" className="w-full h-full object-cover mix-blend-multiply" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100">StudyHelper 튜터 🤖</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">항상 대기 중</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-black/5 dark:bg-white/5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition">
            <X size={20} className="text-zinc-600 dark:text-zinc-300" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} gap-2`}>
              {msg.sender === "robot" && (
                <div className="w-8 h-8 rounded-full bg-white shrink-0 shadow-sm overflow-hidden p-0.5 border border-zinc-200 dark:border-zinc-700 mt-1">
                  <img src="/robot.jpg" alt="Robot" className="w-full h-full object-cover mix-blend-multiply" />
                </div>
              )}
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm text-[15px] leading-relaxed whitespace-pre-wrap break-words ${
                msg.sender === "user" 
                  ? "bg-[#fae100] text-black rounded-tr-sm" 
                  : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-sm"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start gap-2">
              <div className="w-8 h-8 rounded-full bg-white shrink-0 shadow-sm overflow-hidden p-0.5 border border-zinc-200 dark:border-zinc-700 mt-1">
                <img src="/robot.jpg" alt="Robot" className="w-full h-full object-cover mix-blend-multiply" />
              </div>
              <div className="bg-white dark:bg-zinc-800 text-zinc-500 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" /> 분석 중...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="bg-white dark:bg-zinc-800 p-4 border-t border-zinc-200 dark:border-zinc-700">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex gap-2 text-sm">
              <select 
                value={subjectType} 
                onChange={e => setSubjectType(e.target.value as unknown as "전공" | "교양")}
                className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-2 outline-none focus:ring-2 focus:ring-[#fae100]"
              >
                <option value="전공">전공</option>
                <option value="교양">교양</option>
              </select>
              
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-2 focus-within:ring-2 focus-within:ring-[#fae100]">
                <span className="text-zinc-500 mr-1 font-semibold">D-</span>
                <input 
                  type="number" 
                  min="0"
                  max="365"
                  value={dDay}
                  onChange={e => setDDay(e.target.value)}
                  placeholder="일"
                  className="w-12 bg-transparent outline-none text-center font-bold"
                />
              </div>

              <select 
                value={targetGrade} 
                onChange={e => setTargetGrade(e.target.value)}
                className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-2 outline-none focus:ring-2 focus:ring-[#fae100] flex-1 font-semibold"
              >
                <option value="A+">목표: A+</option>
                <option value="A0">목표: A0</option>
                <option value="B+">목표: B+</option>
                <option value="B0">목표: B0</option>
              </select>
            </div>

            <div className="flex gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 cursor-pointer transition-colors text-sm text-zinc-600 dark:text-zinc-300">
                <Paperclip size={18} />
                <span className="truncate max-w-[200px] font-medium">{files.length > 0 ? `${files.length}개의 파일 첨부됨` : "시험 자료 첨부"}</span>
                <input 
                  type="file" 
                  className="hidden" 
                  multiple
                  accept=".txt,.md,.pdf,.csv"
                  onChange={e => setFiles(Array.from(e.target.files || []))}
                />
              </label>
              
              <button 
                type="submit" 
                disabled={isTyping || files.length === 0}
                className="bg-[#fae100] hover:bg-[#e6ce00] text-black w-14 rounded-xl flex items-center justify-center disabled:opacity-50 transition-colors shadow-sm"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
