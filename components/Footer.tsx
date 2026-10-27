import React from 'react';
import Link from 'next/link';
import { Scissors, ShieldCheck, Printer, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1220] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Scissors className="w-4 h-4 -rotate-45" />
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              CardCut
              <span className="text-xs font-normal text-slate-500">v1.0</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Zero-waste, double-sided exam study card generator
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Client-Side • No Data Stored</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Printer className="w-4 h-4 text-indigo-500" />
            <span>Calibrated for A4 Duplex Printers</span>
          </div>
          <Link href="/app" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            Launch Generator
          </Link>
        </div>

        <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
          Designed for students and exam takers.
        </p>
      </div>
    </footer>
  );
}
