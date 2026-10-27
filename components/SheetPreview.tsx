'use client';

import React, { useState } from 'react';
import { SheetLayout, LayoutSettings, PositionedBox } from '@/lib/layout';
import { ZoomIn, ZoomOut, RotateCcw, Eye, Layers } from 'lucide-react';

interface SheetPreviewProps {
  sheets: SheetLayout[];
  settings: LayoutSettings;
  activeSheetIndex: number;
  onSheetChange: (index: number) => void;
}

export function SheetPreview({
  sheets,
  settings,
  activeSheetIndex,
  onSheetChange,
}: SheetPreviewProps) {
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [zoom, setZoom] = useState<number>(1);
  const [hoveredCard, setHoveredCard] = useState<PositionedBox | null>(null);

  if (!sheets || sheets.length === 0) {
    return (
      <div className="h-96 flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400">
        <Layers className="w-10 h-10 mb-2 opacity-50 text-indigo-500" />
        <p className="text-sm font-medium">No cards to display</p>
        <p className="text-xs text-slate-500 mt-1">Paste your Q&A pairs to generate the A4 sheet layout</p>
      </div>
    );
  }

  const currentSheet = sheets[activeSheetIndex] || sheets[0];
  const boxes = side === 'front' ? currentSheet.frontCards : currentSheet.backCards;

  const pw = currentSheet.pageWidth;  // 210 mm
  const ph = currentSheet.pageHeight; // 297 mm
  const margin = currentSheet.marginMm;

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shadow-sm">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        {/* Side Selector (Front vs Back) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          <button
            onClick={() => setSide('front')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              side === 'front'
                ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Front Sheet
          </button>
          <button
            onClick={() => setSide('back')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              side === 'back'
                ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Back Sheet ({settings.duplexEdge}-edge mirrored)
          </button>
        </div>

        {/* Sheet Selector & Zoom Controls */}
        <div className="flex items-center gap-2">
          {sheets.length > 1 && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500">Sheet:</span>
              <select
                value={activeSheetIndex}
                onChange={e => onSheetChange(Number(e.target.value))}
                className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
              >
                {sheets.map((s, idx) => (
                  <option key={idx} value={idx}>
                    Sheet {idx + 1} of {sheets.length}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg p-1 text-slate-600 dark:text-slate-400">
            <button
              onClick={() => setZoom(prev => Math.max(0.6, prev - 0.15))}
              className="p-1 hover:text-slate-900 dark:hover:text-white rounded"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(prev => Math.min(2.0, prev + 0.15))}
              className="p-1 hover:text-slate-900 dark:hover:text-white rounded"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1 hover:text-slate-900 dark:hover:text-white rounded"
              title="Reset zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full overflow-auto max-h-[620px] rounded-xl bg-slate-200/50 dark:bg-slate-950/60 p-4 flex justify-center items-center">
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out',
          }}
          className="shadow-2xl rounded-sm bg-white dark:bg-slate-900 overflow-hidden"
        >
          {/* A4 Sheet SVG (viewBox is 210 x 297 mm) */}
          <svg
            viewBox={`0 0 ${pw} ${ph}`}
            width={pw * 2.8}
            height={ph * 2.8}
            className="block"
          >
            {/* Sheet background */}
            <rect x="0" y="0" width={pw} height={ph} fill="#ffffff" />

            {/* Printable Margin Guidelines (dashed) */}
            <rect
              x={margin}
              y={margin}
              width={pw - 2 * margin}
              height={ph - 2 * margin}
              fill="none"
              stroke="#e2e8f0"
              strokeDasharray="2 2"
              strokeWidth="0.2"
            />

            {/* Sheet Header Label */}
            <text
              x={margin}
              y={Math.max(2.5, margin - 1.5)}
              fontSize="2.5"
              fill="#94a3b8"
              fontFamily="sans-serif"
            >
              CardCut — Sheet {currentSheet.sheetIndex} ({side.toUpperCase()}) | Duplex: {settings.duplexEdge}-edge
            </text>

            {/* Render Card Boxes */}
            {boxes.map((box, idx) => {
              const isHovered = hoveredCard?.card.cardId === box.card.cardId;
              const card = box.card;

              return (
                <g
                  key={`${box.card.cardId}-${idx}`}
                  onMouseEnter={() => setHoveredCard(box)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="cursor-pointer transition-opacity"
                >
                  {/* Card Cut Box Outline (0.1 mm hairline) */}
                  <rect
                    x={box.x}
                    y={box.y}
                    width={box.width}
                    height={box.height}
                    fill={isHovered ? (side === 'front' ? '#eff6ff' : '#faf5ff') : '#ffffff'}
                    stroke={isHovered ? (side === 'front' ? '#3b82f6' : '#8b5cf6') : '#cbd5e1'}
                    strokeWidth={isHovered ? '0.3' : '0.15'}
                  />

                  {/* Render text lines inside the card SVG preview */}
                  {side === 'front' ? (
                    // Front lines
                    card.frontLines.map((line, lineIdx) => {
                      let curX = box.x + settings.paddingMm;
                      const curY = box.y + settings.paddingMm + lineIdx * card.lineHeightMm + (card.fontSizePt * 25.4 / 72) * 0.8;

                      return (
                        <text
                          key={lineIdx}
                          x={curX}
                          y={curY}
                          fontSize={card.fontSizePt * 0.352778}
                          fontFamily="Helvetica, Arial, sans-serif"
                          fill="#0f172a"
                        >
                          {line.segments.map((seg, sIdx) => (
                            <tspan
                              key={sIdx}
                              fontWeight={seg.bold ? 'bold' : 'normal'}
                            >
                              {seg.text}
                            </tspan>
                          ))}
                        </text>
                      );
                    })
                  ) : (
                    // Back lines
                    card.backLines.map((line, lineIdx) => {
                      const curX = box.x + settings.paddingMm;
                      const curY = box.y + settings.paddingMm + lineIdx * card.lineHeightMm + (card.fontSizePt * 25.4 / 72) * 0.8;

                      return (
                        <text
                          key={lineIdx}
                          x={curX}
                          y={curY}
                          fontSize={card.fontSizePt * 0.352778}
                          fontFamily="Helvetica, Arial, sans-serif"
                          fill="#1e293b"
                          transform={
                            settings.rotateBack180
                              ? `rotate(180, ${box.x + box.width / 2}, ${box.y + box.height / 2})`
                              : undefined
                          }
                        >
                          {line.segments.map((seg, sIdx) => (
                            <tspan key={sIdx}>{seg.text}</tspan>
                          ))}
                        </text>
                      );
                    })
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Hover Info Tooltip */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        {hoveredCard ? (
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">
              {hoveredCard.card.heading}
            </span>
            <span>•</span>
            <span>
              {(hoveredCard.width / 10).toFixed(1)} × {(hoveredCard.height / 10).toFixed(1)} cm
            </span>
            <span>•</span>
            <span>Font: {hoveredCard.card.fontSizePt.toFixed(2)} pt</span>
            <span>•</span>
            <span>Fill: {hoveredCard.card.fillPercentage}%</span>
          </div>
        ) : (
          <span>Hover over any card box on the sheet to view its dimensions and typography.</span>
        )}
        <span className="text-slate-400">A4 (210 × 297 mm)</span>
      </div>
    </div>
  );
}
