import React from 'react';
import { Printer, AlertTriangle, CheckCircle2, RotateCw, Layers } from 'lucide-react';
import { DuplexEdge } from '@/lib/layout';

interface PrintInstructionsBoxProps {
  duplexEdge: DuplexEdge;
  rotateBack180: boolean;
  onOpenGuide?: () => void;
}

export function PrintInstructionsBox({
  duplexEdge,
  rotateBack180,
  onOpenGuide,
}: PrintInstructionsBoxProps) {
  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-5 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Essential Duplex Print Settings
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
                Crucial for alignment
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ensure physical cut lines on the back match the front within 0.1 mm.
            </p>
          </div>
        </div>

        {onOpenGuide && (
          <button
            onClick={onOpenGuide}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors"
          >
            <span>💡 How this works</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200">Scale: 100% / Actual Size</span>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5">
              Turn <span className="font-semibold text-rose-600 dark:text-rose-400">"Fit to page" OFF</span>. Scaling will distort the millimeter footprint.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
          <Layers className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Duplex Flip Edge: {duplexEdge === 'long' ? 'Long Edge (Book style)' : 'Short Edge (Calendar style)'}
            </span>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5">
              Your printer dialog setting must match <span className="font-semibold text-indigo-600 dark:text-indigo-400">"{duplexEdge}-edge"</span>.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-amber-500/20 text-xs text-slate-600 dark:text-slate-300">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
        <span>Always print <strong>1 trial sheet</strong> before cutting to verify your printer alignment.</span>
      </div>
    </div>
  );
}
