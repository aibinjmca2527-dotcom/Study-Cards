'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { Scissors, Sun, Moon, Sparkles, Printer, FileText } from 'lucide-react';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#090d16]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Scissors className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-600 dark:from-white dark:via-slate-200 dark:to-indigo-400 bg-clip-text text-transparent">
                CardCut
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                A4 Duplex
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">
              Zero-Waste Exam Study Cards
            </p>
          </div>
        </Link>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === '/'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              Overview
            </Link>
            <Link
              href="/app"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname === '/app'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              Generator App
            </Link>
          </nav>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          </button>

          {/* CTA Button */}
          {pathname !== '/app' && (
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm hover:shadow-indigo-500/25 transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get Started</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
