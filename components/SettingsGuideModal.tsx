'use client';

import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Calendar,
  HelpCircle,
  Check,
  AlertTriangle,
  ArrowRightLeft,
  ArrowUpDown,
  RotateCw,
  Sun,
  Printer,
  Maximize2,
} from 'lucide-react';

interface SettingsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsGuideModal({ isOpen, onClose }: SettingsGuideModalProps) {
  const [interactiveMode, setInteractiveMode] = useState<'long' | 'short'>('long');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shadow-sm">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Simple Printer & Settings Guide
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Understand how 2-sided printing works with simple real-life examples.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Summary Pill */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <strong className="font-bold">In a hurry? The golden 3 settings:</strong>
            <p className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-0.5">
              1. Keep <strong>Long-Edge Flip</strong> &bull; 2. Keep <strong>5 mm Margin</strong> &bull; 3. In your computer's print popup, select <strong>Scale: 100% (Actual Size)</strong>.
            </p>
          </div>
        </div>

        {/* Setting 1: Duplex Flip Edge */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                1
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Duplex Flip Edge: How do you turn the paper?
              </h4>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>"Duplex"</strong> simply means printing on both sides of one sheet. When your printer finishes page 1 and flips the paper to print page 2, <em>which direction does it turn?</em>
          </p>

          {/* Interactive Visual Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Long Edge Option */}
            <div
              onClick={() => setInteractiveMode('long')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                interactiveMode === 'long'
                  ? 'border-indigo-600 bg-white dark:bg-slate-900 shadow-md ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  Long-Edge Flip (Book style)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Default (95%)
                </span>
              </div>

              {/* Visual Book Metaphor */}
              <div className="my-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
                <div className="w-10 h-14 bg-indigo-100 dark:bg-indigo-950 border-2 border-indigo-500 rounded-sm flex items-center justify-center text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-300 shrink-0">
                  📖
                </div>
                <div>
                  <strong>Turn like a novel or notebook:</strong>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Flipping left-to-right across the tall vertical side.
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                CardCut automatically mirrors cards horizontally (Card in column 1 on front becomes column 3 on back).
              </div>
            </div>

            {/* Short Edge Option */}
            <div
              onClick={() => setInteractiveMode('short')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                interactiveMode === 'short'
                  ? 'border-indigo-600 bg-white dark:bg-slate-900 shadow-md ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-violet-500" />
                  Short-Edge Flip (Calendar style)
                </span>
                <span className="text-[10px] font-medium text-slate-400">Flip pad</span>
              </div>

              {/* Visual Calendar Metaphor */}
              <div className="my-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
                <div className="w-10 h-14 bg-violet-100 dark:bg-violet-950 border-2 border-violet-500 rounded-sm flex items-center justify-center text-[10px] font-mono font-bold text-violet-700 dark:text-violet-300 shrink-0">
                  🗓️
                </div>
                <div>
                  <strong>Turn like a wall calendar:</strong>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Flipping bottom-to-top across the narrow horizontal side.
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                CardCut automatically mirrors cards vertically (Card in top row on front becomes bottom row on back).
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 text-[11px] text-indigo-800 dark:text-indigo-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              <strong>Rule:</strong> Keep <strong>Long-Edge</strong> selected here, AND when your printer dialog opens, make sure it is also set to <em>"Flip on long edge"</em>!
            </span>
          </div>
        </div>

        {/* Setting 2: Printer Margin */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
              2
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Printer Margin: The "Rubber Roller" Safe Zone
            </h4>
          </div>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              <strong>What is this?</strong> A small white gap around the edges of the A4 page (default <strong>5 mm</strong>).
            </p>
            <p>
              <strong>Why does it exist?</strong> Physical printers have rubber rollers that grab the paper to pull it through. The printer cannot spray ink directly on its own wheels without jamming or smudging.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <strong className="text-slate-800 dark:text-slate-200">Recommended: Leave at 5 mm</strong>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                5 mm ensures all your cut lines and text are safely inside the printable area of any home, office, or print-shop printer.
              </p>
            </div>
          </div>
        </div>

        {/* Setting 3: Rotate Back Text 180° */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
              3
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <RotateCw className="w-4 h-4 text-violet-500" />
              Rotate Back Text 180°: The Upside-Down Fix
            </h4>
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-1.5">
            <p>
              <strong>What is this?</strong> Some printer drivers (especially HP or Brother auto-duplexers) rotate the back side 180° upside-down mechanically.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1 text-xs">
            <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              How do you know when to turn this ON?
            </div>
            <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-normal">
              Print page 1 & 2. Hold the paper like a book. If the question on the front is upright, but the answer on the back is <strong>upside-down</strong>, simply tick this checkbox! CardCut will flip the back text so both sides face up.
            </p>
          </div>
        </div>

        {/* Setting 4: Print at 100% / Scale Actual Size */}
        <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
              4
            </span>
            <h4 className="text-base font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              The Most Important Rule: Scale 100% / "Fit to Page" OFF
            </h4>
          </div>

          <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed">
            When you click print (Ctrl+P or Cmd+P), your browser or PDF viewer will show a print window. Look for <strong>Page Sizing & Handling</strong>:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-300">
                <Check className="w-4 h-4" />
                DO THIS:
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                Choose <strong>"Actual Size"</strong> or <strong>"Scale: 100%"</strong>.
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-900 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400">
                <X className="w-4 h-4" />
                DO NOT DO THIS:
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                Do NOT select "Fit to page" or "Shrink oversized pages" (it shrinks cards by 5% and misaligns front & back).
              </div>
            </div>
          </div>
        </div>

        {/* 5-Second Test: The Window Light Trick */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 shrink-0">
            <Sun className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-amber-900 dark:text-amber-200">
              The 5-Second "Window Light" Alignment Test
            </h5>
            <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-normal">
              After printing your first test sheet, hold the paper up against a window or bright light bulb. Look through the paper: if the rectangular cutting boxes on the front and back overlap neatly, your alignment is perfect! You can cut with complete confidence.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-500">
            Have questions? Always print 1 test sheet first!
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-sm"
          >
            Got it, close guide
          </button>
        </div>
      </div>
    </div>
  );
}
