"use client";

import Link from "next/link";
import { GraduationCap, HeartHandshake, Languages, MessageSquare, Sparkles, LogIn, LogOut, Library, School } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isLoading, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 group cursor-pointer transition-transform hover:scale-105">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/30">
              <GraduationCap size={24} />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              StudyHelper
            </span>
          </Link>

          {/* Navigation Links & Auth */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <Link
              href="/plan"
              className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all duration-200"
            >
              <HeartHandshake size={18} />
              <span>Plan</span>
            </Link>

            <a
              href="https://cyber.inu.ac.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all duration-200"
            >
              <Library size={18} />
              <span>LMS</span>
            </a>

            <a
              href="https://portal.inu.ac.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all duration-200"
            >
              <School size={18} />
              <span>포탈</span>
            </a>

            <a
              href="https://en.dict.naver.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all duration-200"
            >
              <Languages size={18} />
              <span>영어사전</span>
            </a>

            <a
              href="https://chatgpt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-200"
            >
              <MessageSquare size={18} />
              <span>chat gpt</span>
            </a>

            <a
              href="https://gemini.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200"
            >
              <Sparkles size={18} />
              <span>gemini</span>
            </a>

            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-2" />

            {/* Auth Section */}
            {!isLoading && (
              user ? (
                <div className="relative group">
                  <div className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-700 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                        {user.email?.charAt(0).toUpperCase() ?? "U"}
                      </div>
                    )}
                  </div>

                  {/* Popover */}
                  <div className="absolute right-0 top-full mt-1 w-48 py-2 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-100 dark:border-zinc-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {user.user_metadata?.full_name || "User"}
                      </p>
                      <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={signOut}
                      className="w-full text-left px-4 py-2 mt-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 transition-colors"
                    >
                      <LogOut size={16} />
                      로그아웃
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all duration-200"
                >
                  <LogIn size={18} />
                  <span>로그인</span>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
