'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  Scissors,
  Sparkles,
  Printer,
  Layers,
  ShieldCheck,
  CheckCircle2,
  RotateCw,
  Zap,
  HelpCircle,
  ArrowRight,
  Maximize2,
  FileText,
  Sliders,
} from 'lucide-react';

export default function LandingPage() {
  const [heroFlipped, setHeroFlipped] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-indigo-500/15 via-violet-500/15 to-pink-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-6 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Zero-Waste • Duplex Accurate • 100% Free & Offline</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">
                Turn Pasted Q&A into{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent">
                  Double-Sided
                </span>{' '}
                Study Cards.
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
                CardCut automatically generates short headings, compresses filler, balances front/back text, and packs your questions into compact study cards on printable A4 sheets.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/app"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 active:scale-[0.98] transition-all text-base"
                >
                  <Scissors className="w-5 h-5 -rotate-45" />
                  <span>Start Creating Cards — Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/app?demo=true"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition-all text-base"
                >
                  <span>Try Demo Deck</span>
                </Link>
              </div>

              {/* Trust markers */}
              <div className="mt-10 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="font-bold text-lg text-slate-900 dark:text-white">0 Accounts</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Open & use instantly</div>
                </div>
                <div>
                  <div className="font-bold text-lg text-indigo-600 dark:text-indigo-400">0.1 mm</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Exact cut border precision</div>
                </div>
                <div>
                  <div className="font-bold text-lg text-emerald-600 dark:text-emerald-400">100% Private</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Runs locally in browser</div>
                </div>
              </div>
            </div>

            {/* Right Hero Interactive 3D Card Showcase */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-sm">
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-xs font-semibold text-slate-500">Interactive Card Preview</span>
                  <button
                    onClick={() => setHeroFlipped(!heroFlipped)}
                    className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Flip card</span>
                  </button>
                </div>

                <div
                  onClick={() => setHeroFlipped(!heroFlipped)}
                  className="relative h-64 w-full perspective-1000 cursor-pointer select-none group"
                >
                  <div
                    className={`w-full h-full duration-500 transform-style-preserve-3d transition-transform ${
                      heroFlipped ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* Hero Front Side */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl border-2 border-indigo-500/40 bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 dark:from-slate-900 dark:via-[#0f172a] dark:to-indigo-950/30 p-5 shadow-xl flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-indigo-100 dark:border-slate-800">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            Front Side
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 font-mono text-indigo-700 dark:text-indigo-300">
                            4.5 × 3.0 cm
                          </span>
                        </div>
                        <p className="text-sm font-sans leading-relaxed text-slate-800 dark:text-slate-200">
                          <strong className="font-extrabold text-slate-950 dark:text-white">Java</strong>
                          {' - '}
                          is a high-level, object-oriented programming language running on the JVM. It adheres to Write Once, Run Anywhere.
                        </p>
                      </div>

                      <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span>Tight 0.35mm padding</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium group-hover:underline">
                          Tap to flip ↷
                        </span>
                      </div>
                    </div>

                    {/* Hero Back Side */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl border-2 border-violet-500/40 bg-gradient-to-br from-violet-50/80 via-white to-slate-50 dark:from-slate-900 dark:via-[#0f172a] dark:to-violet-950/30 p-5 shadow-xl flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-violet-100 dark:border-slate-800">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                            Back Side (Continuation)
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/60 font-mono text-violet-700 dark:text-violet-300">
                            Font: 6.25 pt
                          </span>
                        </div>
                        <p className="text-sm font-sans leading-relaxed text-slate-800 dark:text-slate-200">
                          Supports multithreading, garbage collection, and strong typing. Bytecode is compiled just-in-time for enterprise and cloud systems.
                        </p>
                      </div>

                      <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span>Mirrored footprint</span>
                        <span className="text-violet-600 dark:text-violet-400 font-medium group-hover:underline">
                          Tap to flip ↶
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Front & back occupy the exact same physical coordinates on opposite sides of the sheet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-16 md:py-24 bg-white dark:bg-[#0c1220] border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
              Simple 3-Step Workflow
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              From study notes to pocket flashcards in seconds
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:-translate-y-1 transition-transform">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-black text-xl flex items-center justify-center mb-5">
                  1
                </div>
                <h4 className="text-xl font-bold mb-2">Paste Your Q&As</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Paste dozens of question-and-answer pairs at once. Accepts plain newlines or "Q:" and "A:" prefixes. You can also edit and add cards individually.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                Bulk paste supported →
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:-translate-y-1 transition-transform">
              <div>
                <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 font-black text-xl flex items-center justify-center mb-5">
                  2
                </div>
                <h4 className="text-xl font-bold mb-2">Inspect & Preview</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The zero-waste engine calculates 1-3 word headings, compresses filler sentences, chooses optimal font sizes (7pt down to 5pt), and packs sheets.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-violet-600 dark:text-violet-400 font-semibold">
                Live card flip & full sheet views →
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:-translate-y-1 transition-transform">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 font-black text-xl flex items-center justify-center mb-5">
                  3
                </div>
                <h4 className="text-xl font-bold mb-2">Print & Cut</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Download the generated double-sided A4 PDF. Print with two-sided duplex ON at 100% actual size, then cut along the ultra-thin 0.1mm hairlines.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                Exact duplex alignment →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
              Built for Serious Exam Preparation
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Engineered with sub-millimeter duplex accuracy
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base mb-1.5">Auto Short Headings</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Converts questions like "What are Python operators?" into punchy 1-3 word bold headings ("Python Operators").
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base mb-1.5">Smart Offline Compression</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Normalizes quotes, strips conversational filler, drops trailing summary clauses, and preserves key formulas and terms.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Printer className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base mb-1.5">Duplex Accuracy</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Back cards mirror their front footprint based on Long-edge or Short-edge flip, with optional 180° rotation for upside-down drivers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-4">
                <Maximize2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base mb-1.5">Zero-Waste Card Sizing</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Computes text layout first, choosing the largest fitting font (7pt down to 5pt) and smallest box (4-5 cm wide, up to 4 cm high).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 md:py-24 bg-white dark:bg-[#0c1220] border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
              Frequently Asked Questions
            </h2>
            <h3 className="text-3xl font-extrabold tracking-tight">
              Printing & Duplex Guidance
            </h3>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-base mb-1.5 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-500" />
                Why must I print at 100% / Actual Size with "Fit to page" OFF?
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                When "Fit to page" or "Shrink oversized pages" is turned on, the printer driver adds arbitrary margins (usually shrinking the page to 92-96%). This ruins millimeter alignment between front and back sides. Printing at 100% ensures every card footprint matches precisely.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-base mb-1.5 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-500" />
                What is the difference between Long-edge and Short-edge flip?
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Long-edge flip turns pages like a book (around the long vertical side of portrait A4). Short-edge flip turns pages like a wall calendar or steno pad (around the top edge). CardCut calculates the exact geometric reflection for whichever mode your printer uses.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-base mb-1.5 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-500" />
                How do I verify double-sided alignment?
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Print your first sheet double-sided at 100% scale (turn "Fit to page" OFF). Hold the paper up to any window or light: the front and back rectangular cut lines will overlap as a single shadow, ready for clean scissors cutting.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-base mb-1.5 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-500" />
                Are my study notes stored or uploaded to any server?
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                No. CardCut is a 100% client-side application. PDF generation and text layout run directly in your web browser using WebAssembly and JavaScript. No servers, no tracking, and no login required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 bg-gradient-to-br from-indigo-600 to-violet-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-3xl sm:text-4xl font-black mb-4">Ready to Print Your Cards?</h3>
          <p className="text-indigo-100 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Paste your question and answer pairs and download your calibrated duplex PDF in seconds.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-indigo-900 bg-white hover:bg-slate-100 shadow-xl active:scale-95 transition-all text-base"
          >
            <Scissors className="w-5 h-5 -rotate-45" />
            <span>Open CardCut App</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
