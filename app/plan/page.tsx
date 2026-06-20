"use client";

import { useState, useEffect } from "react";
import { Plus, Filter, ClipboardList, BookOpen, Calendar as CalendarIcon, X } from "lucide-react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import MemoItem, { Memo, Category, Color } from "../components/MemoItem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CATEGORIES: Category[] = ["과제", "자습", "개인일정"];
const COLORS: Color[] = ["yellow", "pink", "green", "blue"];

export default function PlanPage() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [newMemo, setNewMemo] = useState("");
  const [newCategory, setNewCategory] = useState<Category>("과제");
  const [filterCategory, setFilterCategory] = useState<Category | "전체">("전체");
  const [isLoaded, setIsLoaded] = useState(false);

  // 현재 시간 기준으로 가장 최근 오전 5시를 계산
  const calculateMostRecent5AM = () => {
    const now = new Date();
    const recent5AM = new Date(now);
    recent5AM.setHours(5, 0, 0, 0);
    if (now.getTime() < recent5AM.getTime()) {
      recent5AM.setDate(recent5AM.getDate() - 1);
    }
    return recent5AM.getTime();
  };

  useEffect(() => {
    const recent5AM = calculateMostRecent5AM();
    const saved = localStorage.getItem("studyplanner-memos");
    if (saved) {
      try {
        const parsedMemos: Memo[] = JSON.parse(saved);
        // Load 시점에 오전 5시 이전 메모는 전부 버림(영구 삭제)
        const activeMemos = parsedMemos.filter(m => m.createdAt >= recent5AM);
        setMemos(activeMemos);
      } catch (e) {}
    }
    
    setIsLoaded(true);

    // 자정이 아니라 오전 5시 정각에 화면을 자동으로 리프레시하기 위한 타이머
    const now = new Date();
    const next5AM = new Date(now);
    next5AM.setHours(5, 0, 0, 0);
    if (now.getTime() >= next5AM.getTime()) {
      next5AM.setDate(next5AM.getDate() + 1);
    }
    
    const timeUntil5AM = next5AM.getTime() - now.getTime();
    const timeoutId = setTimeout(() => {
      // 5시 정각이 되면 모든 메모를 빈 배열로 덮어쓰기 (자동 삭제)
      setMemos([]);
    }, timeUntil5AM);

    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("studyplanner-memos", JSON.stringify(memos));
    }
  }, [memos, isLoaded]);

  if (!isLoaded) return null;

  const handleAddMemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemo.trim()) return;

    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

    const memo: Memo = {
      id: Date.now().toString(),
      content: newMemo.trim(),
      category: newCategory,
      color: randomColor,
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

    draggedMemo.category = destCategory;

    const destMemos = newMemos.filter(m => m.category === destCategory);
    
    const itemAfter = destMemos[destination.index];
    
    if (itemAfter) {
      const insertIndex = newMemos.findIndex(m => m.id === itemAfter.id);
      newMemos.splice(insertIndex, 0, draggedMemo);
    } else {
      newMemos.push(draggedMemo);
    }

    setMemos(newMemos);
  };

  const renderColumn = (category: Category, title: string, icon: React.ReactNode) => {
    const columnMemos = memos.filter(m => m.category === category);
    
    if (filterCategory !== "전체" && filterCategory !== category) return null;

    return (
      <div key={category} className="flex-1 flex flex-col bg-zinc-100/50 dark:bg-zinc-800/20 rounded-2xl p-4 overflow-hidden border border-zinc-200/50 dark:border-zinc-700/50 shadow-inner">
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
              {columnMemos.map((memo, index) => (
                <MemoItem
                  key={memo.id}
                  memo={memo}
                  index={index}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <div className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-[2rem] shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex-1 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50">
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 pl-2">학습 메모 보드</h2>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full font-medium border border-zinc-200 dark:border-zinc-700 px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm">
              <Filter size={16} />
              {filterCategory}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl">
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
        <div className="flex-1 overflow-hidden bg-zinc-50 dark:bg-zinc-950 p-6">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 h-full w-full mx-auto">
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
