"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Circle, Triangle, X, Edit2, Trash2, Check } from "lucide-react";
import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";

export type Category = "과제" | "자습" | "개인일정";
export type Status = "O" | "△" | "X" | null;
export type Color = "yellow" | "pink" | "green" | "blue";

export interface Memo {
  id: string;
  content: string;
  category: Category;
  color: Color;
  status: Status;
  createdAt: number;
}

const colorMap = {
  yellow: "bg-[#fef3c7] text-[#78350f] shadow-[#fef3c7]/50",
  pink: "bg-[#fce7f3] text-[#831843] shadow-[#fce7f3]/50",
  green: "bg-[#dcfce7] text-[#14532d] shadow-[#dcfce7]/50",
  blue: "bg-[#e0f2fe] text-[#0c4a6e] shadow-[#e0f2fe]/50",
};

interface MemoItemProps {
  memo: Memo;
  index: number;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Memo>) => void;
}

export default function MemoItem({ memo, index, onDelete, onUpdate }: MemoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(memo.content);

  const handleSave = () => {
    onUpdate(memo.id, { content: editContent });
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={memo.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="group focus:outline-none"
        >
          <motion.div
            layoutId={memo.id}
            initial={{ scale: 0.5, opacity: 0, rotate: index % 2 === 0 ? 5 : -5 }}
            animate={{ scale: 1, opacity: 1, rotate: snapshot.isDragging ? 5 : 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05, zIndex: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`
              relative flex flex-col w-56 h-56 shadow-lg rounded-sm p-4
              ${colorMap[memo.color]}
            `}
          >
            {/* 상단 핀 효과 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-3 bg-black/10 rounded-full blur-[1px]"></div>
            
            {/* 우측 상단 상태 표시 */}
            {memo.status && (
              <div className="absolute top-3 right-3 opacity-70">
                {memo.status === 'O' && <Circle size={24} strokeWidth={3} className="text-blue-600" />}
                {memo.status === '△' && <Triangle size={24} strokeWidth={3} className="text-orange-500" />}
                {memo.status === 'X' && <X size={24} strokeWidth={3} className="text-red-600" />}
              </div>
            )}
            
            <div className="flex-1 overflow-y-auto no-scrollbar flex items-center justify-center text-center mt-2 mb-8">
              {isEditing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-full bg-transparent resize-none outline-none font-medium text-sm text-center"
                  autoFocus
                  onBlur={handleSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSave();
                    }
                  }}
                />
              ) : (
                <p className="font-bold text-[15px] whitespace-pre-wrap break-words">{memo.content}</p>
              )}
            </div>

            {/* 메타 정보 & 컨트롤바 */}
            <div className="absolute left-0 right-0 bottom-2 px-3 flex flex-col items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex justify-center items-center gap-2 mb-1.5">
                <button onClick={() => onUpdate(memo.id, { status: memo.status === 'O' ? null : 'O' })} className={`p-1.5 rounded-full hover:bg-black/10 ${memo.status === 'O' ? 'bg-black/20 text-white' : ''}`}><Circle size={14} strokeWidth={3} /></button>
                <button onClick={() => onUpdate(memo.id, { status: memo.status === '△' ? null : '△' })} className={`p-1.5 rounded-full hover:bg-black/10 ${memo.status === '△' ? 'bg-black/20 text-white' : ''}`}><Triangle size={14} strokeWidth={3} /></button>
                <button onClick={() => onUpdate(memo.id, { status: memo.status === 'X' ? null : 'X' })} className={`p-1.5 rounded-full hover:bg-black/10 ${memo.status === 'X' ? 'bg-black/20 text-white' : ''}`}><X size={14} strokeWidth={3} /></button>
              </div>

              <div className="flex items-center w-full justify-between">
                <span className="text-[11px] opacity-60 font-extrabold tracking-tighter">
                  {format(new Date(memo.createdAt), "MM.dd HH:mm", { locale: ko })}
                </span>
                <div className="flex gap-1">
                  {isEditing ? (
                    <button onClick={handleSave} className="p-1 hover:bg-black/10 rounded-full"><Check size={14} strokeWidth={3} /></button>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="p-1 hover:bg-black/10 rounded-full"><Edit2 size={14} strokeWidth={3} /></button>
                  )}
                  <button onClick={() => onDelete(memo.id)} className="p-1 hover:bg-black/10 rounded-full text-red-500/80 hover:text-red-600"><Trash2 size={14} strokeWidth={3} /></button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </Draggable>
  );
}
