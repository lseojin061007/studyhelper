"use client";

import { useState, useEffect } from "react";
import { X, Plus, Filter, ClipboardList, BookOpen, Calendar as CalendarIcon } from "lucide-react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { AnimatePresence } from "framer-motion";
import MemoItem, { Memo, Category, Shape, Color } from "./MemoItem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: Category[] = ["과제", "자습", "개인일정"];
const COLORS: Color[] = ["yellow", "pink", "green", "blue"];
const SHAPES: Shape[] = ["square", "heart", "star"];

export default function PlanModal({ isOpen, onClose }: PlanModalProps) {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [newMemo, setNewMemo] = useState("");
  const [newCategory, setNewCategory] = useState<Category>("과제");
  const [filterCategory, setFilterCategory] = useState<Category | "전체">("전체");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("studyplanner-memos");
    if (saved) {
      try {
        setMemos(JSON.parse(saved));
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("studyplanner-memos", JSON.stringify(memos));
    }
  }, [memos, isLoaded]);

  if (!isOpen || !isLoaded) return null;

  const handleAddMemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemo.trim()) return;

    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];

    const memo: Memo = {
      id: Date.now().toString(),
      content: newMemo.trim(),
      category: newCategory,
      color: randomColor,
      shape: randomShape,
      status: null,
      createdAt: Date.now(),
    };

    setMemos([...memos, memo]);
    setNewMemo("");
  };

  const handleDelete = (id: string) => {
    setMemos(memos.filter(m => m.id !== id));
  };

  const handleUpdate = (id: string, updates: Partial<Memo>) => {
    setMemos(memos.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const sourceCategory = source.droppableId as Category;
    const destCategory = destination.droppableId as Category;

    const sourceMemos = memos.filter(m => m.category === sourceCategory);
    const draggedMemo = sourceMemos[source.index];

    const newMemos = memos.filter(m => m.id !== draggedMemo.id);

    if (sourceCategory === destCategory) {
      const destMemos = newMemos.filter(m => m.category === destCategory);
      destMemos.splice(destination.index, 0, draggedMemo);
      
      const otherMemos = newMemos.filter(m => m.category !== destCategory);
      setMemos([...otherMemos, ...destMemos]);
    } else {
      draggedMemo.category = destCategory;
      const destMemos = newMemos.filter(m => m.category === destCategory);
      destMemos.splice(destination.index, 0, draggedMemo);
      
      const otherMemos = newMemos.filter(m => m.category !== destCategory);
      setMemos([...otherMemos, ...destMemos]);
    }
  };

  const renderColumn = (category: Category, title: string, icon: React.ReactNode) => {
    const columnMemos = memos.filter(m => m.category === category);
    
    if (filterCategory !== "전체" && filterCategory !== category) return null;

    return (
      <div key={category} className="flex-1 flex flex-col bg-zinc-100/50 dark:bg-zinc-800/20 rounded-2xl p-4 overflow-hidden">
        <div className="flex items-center gap-2 mb-4 px-2">
          <div className="p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-sm text-indigo-500">
            {icon}
          </div>
          <h3 className="font-bold text-zinc-700 dark:text-zinc-200">{title}</h3>
          <span className="ml-auto bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs px-2 py-1 rounded-full font-bold">
            {columnMemos.length}
          </span>
        </div>
        
        <Droppable droppableId={category}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4 p-2 transition-colors rounded-xl min-h-[200px] ${
                snapshot.isDraggingOver ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''
              }`}
            >
              <AnimatePresence>
                {columnMemos.map((memo, index) => (
                  <MemoItem
                    key={memo.id}
                    memo={memo}
                    index={index}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                  />
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6">
      <div className="bg-white dark:bg-zinc-950 w-full h-full max-w-7xl rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-zinc-200 dark:border-zinc-800">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">학습 메모 보드</h2>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-full font-medium border border-zinc-200 dark:border-zinc-700 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm">
                <Filter size={16} />
                {filterCategory}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40 rounded-xl">
                <DropdownMenuItem onClick={() => setFilterCategory("전체")} className="rounded-lg cursor-pointer font-medium">
                  전체보기
                </DropdownMenuItem>
                {CATEGORIES.map(cat => (
                  <DropdownMenuItem key={cat} onClick={() => setFilterCategory(cat)} className="rounded-lg cursor-pointer font-medium">
                    {cat}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <button onClick={onClose} className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
            <X size={20} className="text-zinc-600 dark:text-zinc-300" />
          </button>
        </div>

        {/* Form */}
        <div className="p-4 sm:p-6 bg-zinc-50/50 dark:bg-zinc-900/20 border-b border-zinc-100 dark:border-zinc-800">
          <form onSubmit={handleAddMemo} className="flex gap-3 items-center max-w-3xl mx-auto">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as Category)}
              className="h-10 px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <Input
              type="text"
              value={newMemo}
              onChange={(e) => setNewMemo(e.target.value)}
              placeholder="새로운 메모나 계획을 입력하세요..."
              className="flex-1 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm rounded-lg"
            />
            <Button type="submit" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 shadow-md">
              <Plus size={18} />
              메모 붙이기
            </Button>
          </form>
        </div>

        {/* Board */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-zinc-950 p-6">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 h-full w-full mx-auto max-w-6xl">
              {renderColumn("과제", "과제", <ClipboardList size={20} />)}
              {renderColumn("자습", "자습", <BookOpen size={20} />)}
              {renderColumn("개인일정", "개인일정", <CalendarIcon size={20} />)}
            </div>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}
