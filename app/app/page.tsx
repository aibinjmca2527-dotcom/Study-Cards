'use client';

import React, { useState, useEffect, useMemo, useTransition, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CardPreview } from '@/components/CardPreview';
import { SheetPreview } from '@/components/SheetPreview';
import { PrintInstructionsBox } from '@/components/PrintInstructionsBox';
import {
  RawCardInput,
  LayoutSettings,
  DEFAULT_LAYOUT_SETTINGS,
  DEFAULT_SAMPLE_TEXT,
  PRELOADED_TEST_CARDS,
  parsePastedCards,
  formatCardsToText,
  runLayoutPipeline,
  generateCardsPdf,
  generateCalibrationPdf,
  DuplexEdge,
} from '@/lib/layout';
import {
  Scissors,
  Download,
  RotateCw,
  Sliders,
  Layers,
  FileText,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  AlertTriangle,
  Info,
  Sparkles,
  RefreshCw,
  Search,
} from 'lucide-react';

function AppContent() {
  const searchParams = useSearchParams();
  const isDemo = searchParams.get('demo') === 'true';

  // --- State ---
  const [inputText, setInputText] = useState<string>(DEFAULT_SAMPLE_TEXT);
  const [cards, setCards] = useState<RawCardInput[]>(PRELOADED_TEST_CARDS);
  const [activeTab, setActiveTab] = useState<'paste' | 'list'>('paste');
  const [previewTab, setPreviewTab] = useState<'cards' | 'sheet'>('cards');
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);
  const [activeSheetIndex, setActiveSheetIndex] = useState<number>(0);
  const [isPending, startTransition] = useTransition();
  const [searchFilter, setSearchFilter] = useState('');

  // Settings
  const [settings, setSettings] = useState<LayoutSettings>(DEFAULT_LAYOUT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Card edit modal / inline state
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  // Status messages
  const [downloading, setDownloading] = useState(false);

  // Sync cards when input text changes in 'paste' tab
  const handleTextChange = (text: string) => {
    setInputText(text);
    startTransition(() => {
      const parsed = parsePastedCards(text);
      setCards(parsed);
      setSelectedCardIndex(0);
      setActiveSheetIndex(0);
    });
  };

  // Sync text when cards change in 'list' tab
  const updateCardsAndText = (newCards: RawCardInput[]) => {
    setCards(newCards);
    setInputText(formatCardsToText(newCards));
    if (selectedCardIndex >= newCards.length) {
      setSelectedCardIndex(Math.max(0, newCards.length - 1));
    }
  };

  // Run pipeline reactively
  const pipelineResult = useMemo(() => {
    return runLayoutPipeline(cards, settings);
  }, [cards, settings]);

  const { cardLayouts, sheets, processedCards } = pipelineResult;

  // Filtered cards for list view
  const filteredCards = useMemo(() => {
    if (!searchFilter.trim()) return cards;
    const q = searchFilter.toLowerCase();
    return cards.filter(
      c => c.question.toLowerCase().includes(q) || c.answer.toLowerCase().includes(q)
    );
  }, [cards, searchFilter]);

  // Handlers for Add / Edit / Delete
  const handleAddNewCard = () => {
    if (!newQuestion.trim() && !newAnswer.trim()) return;
    const newCard: RawCardInput = {
      id: `card-${Date.now()}`,
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
    };
    const updated = [...cards, newCard];
    updateCardsAndText(updated);
    setNewQuestion('');
    setNewAnswer('');
    setIsAddingNew(false);
    setSelectedCardIndex(updated.length - 1);
  };

  const handleStartEdit = (card: RawCardInput) => {
    setEditingCardId(card.id);
    setEditQuestion(card.question);
    setEditAnswer(card.answer);
  };

  const handleSaveEdit = (id: string) => {
    const updated = cards.map(c =>
      c.id === id ? { ...c, question: editQuestion.trim(), answer: editAnswer.trim() } : c
    );
    updateCardsAndText(updated);
    setEditingCardId(null);
  };

  const handleDeleteCard = (id: string) => {
    const updated = cards.filter(c => c.id !== id);
    updateCardsAndText(updated);
  };

  // Download Cards PDF
  const handleDownloadPdf = () => {
    if (sheets.length === 0) return;
    setDownloading(true);
    try {
      const doc = generateCardsPdf(sheets, settings);
      doc.save('CardCut-Study-Cards.pdf');
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setDownloading(false);
    }
  };

  // Download Calibration PDF
  const handleDownloadCalibration = () => {
    try {
      const doc = generateCalibrationPdf(settings);
      doc.save(`CardCut-Calibration-${settings.duplexEdge}-edge.pdf`);
    } catch (err) {
      console.error('Calibration PDF generation error:', err);
    }
  };

  // Load sample deck
  const handleLoadSample = () => {
    setInputText(DEFAULT_SAMPLE_TEXT);
    setCards(PRELOADED_TEST_CARDS);
    setSelectedCardIndex(0);
    setActiveSheetIndex(0);
  };

  // Clear all
  const handleClear = () => {
    setInputText('');
    setCards([]);
    setSelectedCardIndex(0);
    setActiveSheetIndex(0);
  };

  const currentLayout = cardLayouts[selectedCardIndex] || cardLayouts[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Top Control Bar: Title & Primary Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <span>CardCut Generator</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                {cards.length} {cards.length === 1 ? 'card' : 'cards'} • {sheets.length} {sheets.length === 1 ? 'sheet' : 'sheets'} ({sheets.length * 2} pages)
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Zero-waste layout with exact duplex alignment on standard A4 paper.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {/* Calibration Sheet Button */}
            <button
              onClick={handleDownloadCalibration}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 transition-colors shadow-sm"
              title="Print a 2-page test sheet with alignment crosshairs to verify your printer duplex"
            >
              <RotateCw className="w-3.5 h-3.5 text-indigo-500" />
              <span>Calibration Sheet</span>
            </button>

            {/* Primary Download PDF Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={cards.length === 0 || downloading}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-white shadow-md transition-all active:scale-[0.98] ${
                cards.length === 0
                  ? 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed text-slate-500'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>

        {/* Two-Column App Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT COLUMN: INPUT & SETTINGS ================= */}
          <div className="lg:col-span-6 space-y-6">
            {/* Input Card Container */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-sm">
              {/* Header with Mode Tabs */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
                  <button
                    onClick={() => setActiveTab('paste')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                      activeTab === 'paste'
                        ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Paste Bulk Q&A</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('list')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                      activeTab === 'list'
                        ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Card List Editor ({cards.length})</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLoadSample}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                    title="Load preloaded sample questions (Java, Python, Byte)"
                  >
                    Sample Deck
                  </button>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <button
                    onClick={handleClear}
                    className="text-xs font-medium text-slate-500 hover:text-rose-500"
                    title="Clear all cards"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* TAB 1: BULK TEXTAREA */}
              {activeTab === 'paste' ? (
                <div>
                  <label htmlFor="qa-input" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                    Paste pairs below (Question on first line, answer below, separated by blank lines):
                  </label>
                  <textarea
                    id="qa-input"
                    value={inputText}
                    onChange={e => handleTextChange(e.target.value)}
                    placeholder={`What is Java?\nJava is a high-level, object-oriented programming language...\n\nWhat is Python?\nPython is a versatile programming language...`}
                    rows={13}
                    className="w-full font-mono text-xs leading-relaxed p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-950/60 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                  />
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                    <span>Accepts standard format and "Q:" / "A:" prefixes</span>
                    <span>{cards.length} cards detected</span>
                  </div>
                </div>
              ) : (
                /* TAB 2: EDITABLE CARD LIST */
                <div className="space-y-3">
                  {/* Search and Add controls */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search cards..."
                        value={searchFilter}
                        onChange={e => setSearchFilter(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <button
                      onClick={() => setIsAddingNew(true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Card</span>
                    </button>
                  </div>

                  {/* Add New Card Inline Form */}
                  {isAddingNew && (
                    <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-300">
                        <span>New Study Card</span>
                        <button onClick={() => setIsAddingNew(false)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Question (e.g. What is Polymorphism?)"
                        value={newQuestion}
                        onChange={e => setNewQuestion(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none"
                      />
                      <textarea
                        placeholder="Answer definition or explanation..."
                        value={newAnswer}
                        onChange={e => setNewAnswer(e.target.value)}
                        rows={3}
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setIsAddingNew(false)}
                          className="px-3 py-1 text-xs rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAddNewCard}
                          className="px-3 py-1 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500"
                        >
                          Save Card
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Card Items List */}
                  <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                    {filteredCards.length === 0 ? (
                      <p className="text-xs text-center py-6 text-slate-400">No matching cards found.</p>
                    ) : (
                      filteredCards.map((card, idx) => {
                        const isEditing = editingCardId === card.id;

                        if (isEditing) {
                          return (
                            <div key={card.id} className="p-3 rounded-xl border border-indigo-500 bg-white dark:bg-slate-900 space-y-2">
                              <input
                                type="text"
                                value={editQuestion}
                                onChange={e => setEditQuestion(e.target.value)}
                                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none"
                              />
                              <textarea
                                value={editAnswer}
                                onChange={e => setEditAnswer(e.target.value)}
                                rows={3}
                                className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none resize-none"
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setEditingCardId(null)}
                                  className="px-2.5 py-1 text-xs rounded-lg text-slate-500 hover:bg-slate-100"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveEdit(card.id)}
                                  className="px-3 py-1 text-xs font-bold rounded-lg bg-indigo-600 text-white"
                                >
                                  Done
                                </button>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={card.id}
                            className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700 flex items-start justify-between gap-3 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                  #{idx + 1}
                                </span>
                                <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                  {card.question}
                                </h5>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                                {card.answer}
                              </p>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleStartEdit(card)}
                                className="p-1 rounded text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                                title="Edit question and answer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCard(card.id)}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                                title="Delete card"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* SETTINGS PANEL */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <Sliders className="w-4 h-4 text-indigo-500" />
                  <span>Printer & Layout Settings</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                  A4: 210 × 297 mm
                </span>
              </div>

              {/* Duplex Flip Edge Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Duplex Flip Edge:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSettings(s => ({ ...s, duplexEdge: 'long' }))}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border flex flex-col items-center gap-0.5 transition-all ${
                      settings.duplexEdge === 'long'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-600'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>Long-Edge Flip</span>
                    <span className="text-[10px] font-normal opacity-70">Book / Tablet style</span>
                  </button>

                  <button
                    onClick={() => setSettings(s => ({ ...s, duplexEdge: 'short' }))}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border flex flex-col items-center gap-0.5 transition-all ${
                      settings.duplexEdge === 'short'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-600'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span>Short-Edge Flip</span>
                    <span className="text-[10px] font-normal opacity-70">Calendar / Pad style</span>
                  </button>
                </div>
              </div>

              {/* Printer Margin Control */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="margin-slider" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Printer Margin:
                  </label>
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {settings.marginMm} mm
                  </span>
                </div>
                <input
                  id="margin-slider"
                  type="range"
                  min={3}
                  max={15}
                  step={0.5}
                  value={settings.marginMm}
                  onChange={e => setSettings(s => ({ ...s, marginMm: Number(e.target.value) }))}
                  className="w-full accent-indigo-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>3 mm (Narrow)</span>
                  <span>5 mm (Standard)</span>
                  <span>15 mm (Wide)</span>
                </div>
              </div>

              {/* Back Text Rotation 180° Toggle */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Rotate Back Text 180°
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Turn this ON if your printer driver inverts the back page orientation.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.rotateBack180}
                    onChange={e => setSettings(s => ({ ...s, rotateBack180: e.target.checked }))}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* PRINT INSTRUCTIONS BOX */}
            <PrintInstructionsBox
              duplexEdge={settings.duplexEdge}
              rotateBack180={settings.rotateBack180}
              onOpenCalibration={handleDownloadCalibration}
            />
          </div>

          {/* ================= RIGHT COLUMN: LIVE PREVIEW & INSPECTION ================= */}
          <div className="lg:col-span-6 space-y-6">
            {/* Preview Navigation Tabs */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
                <button
                  onClick={() => setPreviewTab('cards')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                    previewTab === 'cards'
                      ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Card Inspector</span>
                </button>

                <button
                  onClick={() => setPreviewTab('sheet')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                    previewTab === 'sheet'
                      ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Full A4 Sheets ({sheets.length})</span>
                </button>
              </div>

              {previewTab === 'cards' && cardLayouts.length > 1 && (
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    onClick={() => setSelectedCardIndex(i => Math.max(0, i - 1))}
                    disabled={selectedCardIndex === 0}
                    className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40"
                  >
                    ← Prev
                  </button>
                  <span className="font-mono text-xs">
                    {selectedCardIndex + 1} / {cardLayouts.length}
                  </span>
                  <button
                    onClick={() => setSelectedCardIndex(i => Math.min(cardLayouts.length - 1, i + 1))}
                    disabled={selectedCardIndex === cardLayouts.length - 1}
                    className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>

            {/* PREVIEW CONTENT */}
            {previewTab === 'cards' ? (
              currentLayout ? (
                <div className="space-y-4">
                  <CardPreview
                    layout={currentLayout}
                    index={selectedCardIndex}
                    total={cardLayouts.length}
                    onDelete={() => handleDeleteCard(currentLayout.cardId)}
                  />

                  {/* Quick Card Selector Carousel / Grid */}
                  {cardLayouts.length > 1 && (
                    <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                        <span>All Cards ({cardLayouts.length})</span>
                        <span className="text-[11px] font-normal">Click to inspect</span>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {cardLayouts.map((l, idx) => (
                          <button
                            key={l.cardId}
                            onClick={() => setSelectedCardIndex(idx)}
                            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                              selectedCardIndex === idx
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                            }`}
                          >
                            <span className="font-mono mr-1">#{idx + 1}</span>
                            <span>{l.heading}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-72 flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400">
                  <p className="text-sm">No cards to inspect</p>
                  <p className="text-xs text-slate-500 mt-1">Paste Q&A pairs on the left to start</p>
                </div>
              )
            ) : (
              /* A4 SHEET PREVIEW */
              <SheetPreview
                sheets={sheets}
                settings={settings}
                activeSheetIndex={activeSheetIndex}
                onSheetChange={setActiveSheetIndex}
              />
            )}

            {/* Overall Layout Statistics Box */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                  {cards.length}
                </div>
                <div className="text-[11px] text-slate-500">Total Cards</div>
              </div>

              <div>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {sheets.length * 2}
                </div>
                <div className="text-[11px] text-slate-500">PDF Pages ({sheets.length} sheets)</div>
              </div>

              <div>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                  {cardLayouts.length > 0
                    ? `${(
                        cardLayouts.reduce((acc, c) => acc + c.fontSizePt, 0) / cardLayouts.length
                      ).toFixed(1)} pt`
                    : '—'}
                </div>
                <div className="text-[11px] text-slate-500">Avg Font Size</div>
              </div>

              <div>
                <div className="text-xl font-black text-violet-600 dark:text-violet-400">
                  {cardLayouts.filter(c => c.warning).length}
                </div>
                <div className="text-[11px] text-slate-500">Trim Warnings</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AppPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#090d16] text-slate-500">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold">Loading CardCut Generator...</span>
          </div>
        </div>
      }
    >
      <AppContent />
    </Suspense>
  );
}
