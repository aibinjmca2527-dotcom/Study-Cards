'use client';

import React, { useState } from 'react';
import { CardLayout } from '@/lib/layout';
import { RotateCw, AlertTriangle, CheckCircle, Maximize2, Sparkles } from 'lucide-react';

interface CardPreviewProps {
  layout: CardLayout;
  index?: number;
  total?: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function CardPreview({
  layout,
  index,
  total,
  onEdit,
  onDelete,
}: CardPreviewProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const widthCm = (layout.widthMm / 10).toFixed(1);
  const heightCm = (layout.heightMm / 10).toFixed(1);

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Top Header / Badges */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          {index !== undefined && total !== undefined && (
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              #{index + 1}
            </span>
          )}
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[150px]">
            {layout.heading || 'Card'}
          </span>
        </div>

        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 transition-colors"
          title="Click to flip between front and back"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{isFlipped ? 'View Front' : 'Flip Card'}</span>
        </button>
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="relative w-full h-56 perspective-1000 cursor-pointer select-none group"
      >
        <div
          className={`w-full h-full duration-500 transform-style-preserve-3d transition-transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT SIDE */}
          <div className="absolute inset-0 w-full h-full backface-hidden rounded-xl border border-dashed border-indigo-300 dark:border-indigo-800 bg-gradient-to-br from-indigo-50/50 to-white dark:from-slate-900 dark:to-indigo-950/20 p-4 flex flex-col justify-between shadow-inner">
            <div className="overflow-y-auto pr-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                Front Side
              </span>
              <div className="text-xs leading-relaxed text-slate-800 dark:text-slate-200 font-sans">
                {layout.frontLines.map((line, lIdx) => (
                  <div key={lIdx} className="leading-tight">
                    {line.segments.map((seg, sIdx) => (
                      <span
                        key={sIdx}
                        className={seg.bold ? 'font-bold text-slate-900 dark:text-white' : 'font-normal'}
                      >
                        {seg.text}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 mt-2">
              <span className="font-mono">Front preview</span>
              <span className="text-indigo-600 dark:text-indigo-400 group-hover:underline">Click to flip ↷</span>
            </div>
          </div>

          {/* BACK SIDE */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl border border-dashed border-violet-300 dark:border-violet-800 bg-gradient-to-br from-violet-50/50 to-white dark:from-slate-900 dark:to-violet-950/20 p-4 flex flex-col justify-between shadow-inner">
            <div className="overflow-y-auto pr-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 block mb-1">
                Back Side (Continuation Only)
              </span>
              <div className="text-xs leading-relaxed text-slate-800 dark:text-slate-200 font-sans">
                {layout.backLines.map((line, lIdx) => (
                  <div key={lIdx} className="leading-tight">
                    {line.segments.map((seg, sIdx) => (
                      <span key={sIdx} className="font-normal">
                        {seg.text}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 mt-2">
              <span className="font-mono">Back preview</span>
              <span className="text-violet-600 dark:text-violet-400 group-hover:underline">Click to flip ↶</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics & Warning Footer */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900 dark:text-slate-200">
            {widthCm} × {heightCm} cm
          </span>
          <span>•</span>
          <span>Font: <strong className="text-slate-800 dark:text-slate-300">{layout.fontSizePt.toFixed(2)} pt</strong></span>
          <span>•</span>
          <span>Fill: <strong className="text-slate-800 dark:text-slate-300">{layout.fillPercentage}%</strong></span>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="text-xs text-rose-600 hover:text-rose-500 dark:text-rose-400"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Warning banner if trimmed or tight */}
      {layout.warning && (
        <div className="mt-2.5 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 flex items-start gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
          <span>{layout.warning}</span>
        </div>
      )}
    </div>
  );
}
