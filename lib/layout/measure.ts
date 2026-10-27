import { jsPDF } from 'jspdf';
import { CardTextLine, CardTextSegment } from './types';

// Reusable headless jsPDF instance for exact Helvetica measurement
let measureDocInstance: jsPDF | null = null;

export function getMeasureDoc(): jsPDF {
  if (!measureDocInstance) {
    measureDocInstance = new jsPDF({ unit: 'mm', format: 'a4' });
  }
  return measureDocInstance;
}

/**
 * Measures the exact width of a text string in mm using jsPDF Helvetica.
 */
export function measureTextWidthMm(
  text: string,
  fontSizePt: number,
  bold: boolean = false,
  doc?: jsPDF
): number {
  if (!text) return 0;
  const d = doc || getMeasureDoc();
  d.setFont('helvetica', bold ? 'bold' : 'normal');
  d.setFontSize(fontSizePt);
  return d.getTextWidth(text);
}

/**
 * Calculates line height in mm based on font size and tight line spacing.
 * Standard tight line height factor: ~1.15 to 1.18.
 * 1 pt = 25.4 / 72 mm ≈ 0.352778 mm.
 */
export function getLineHeightMm(fontSizePt: number): number {
  const fontHeightMm = (fontSizePt * 25.4) / 72;
  return fontHeightMm * 1.16;
}

/**
 * Breaks long words that exceed maxWidthMm by inserting hyphens.
 */
function breakLongWord(
  word: string,
  maxWidthMm: number,
  fontSizePt: number,
  bold: boolean,
  doc: jsPDF
): string[] {
  const pieces: string[] = [];
  const hyphenWidth = measureTextWidthMm('-', fontSizePt, bold, doc);
  let remaining = word;

  while (remaining.length > 0) {
    let charCount = 1;
    let lastValidCount = 1;

    while (charCount <= remaining.length) {
      const slice = remaining.slice(0, charCount);
      const isLast = charCount === remaining.length;
      const testSlice = isLast ? slice : slice + '-';
      const w = measureTextWidthMm(testSlice, fontSizePt, bold, doc);

      if (w <= maxWidthMm) {
        lastValidCount = charCount;
        charCount++;
      } else {
        break;
      }
    }

    if (lastValidCount >= remaining.length) {
      pieces.push(remaining);
      break;
    } else {
      pieces.push(remaining.slice(0, lastValidCount) + '-');
      remaining = remaining.slice(lastValidCount);
    }
  }

  return pieces;
}

export interface WrapToken {
  text: string;
  bold: boolean;
  isSpace?: boolean;
}

/**
 * Wraps tokens (words, spaces, bold headings) into lines adhering strictly to maxWidthMm.
 */
export function wrapTokensToLines(
  tokens: WrapToken[],
  maxWidthMm: number,
  fontSizePt: number,
  doc?: jsPDF
): CardTextLine[] {
  const d = doc || getMeasureDoc();
  const lines: CardTextLine[] = [];

  let currentLineSegments: CardTextSegment[] = [];
  let currentLineWidth = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!token.text) continue;

    // Handle space tokens
    if (token.isSpace) {
      // If we are at the beginning of a line, ignore leading space
      if (currentLineSegments.length === 0) {
        continue;
      }
      const spaceWidth = measureTextWidthMm(' ', fontSizePt, false, d);
      if (currentLineWidth + spaceWidth <= maxWidthMm) {
        currentLineSegments.push({ text: ' ', bold: false });
        currentLineWidth += spaceWidth;
      }
      continue;
    }

    const tokenWidth = measureTextWidthMm(token.text, fontSizePt, token.bold, d);

    // If a single word is wider than maxWidthMm, break with hyphenation
    if (tokenWidth > maxWidthMm) {
      const brokenParts = breakLongWord(token.text, maxWidthMm, fontSizePt, token.bold, d);
      for (const part of brokenParts) {
        const partWidth = measureTextWidthMm(part, fontSizePt, token.bold, d);
        if (currentLineWidth + partWidth <= maxWidthMm) {
          currentLineSegments.push({ text: part, bold: token.bold });
          currentLineWidth += partWidth;
        } else {
          if (currentLineSegments.length > 0) {
            lines.push({ segments: currentLineSegments, widthMm: currentLineWidth });
            currentLineSegments = [];
            currentLineWidth = 0;
          }
          currentLineSegments.push({ text: part, bold: token.bold });
          currentLineWidth = partWidth;
        }
      }
      continue;
    }

    // Normal token fitting
    if (currentLineWidth + tokenWidth <= maxWidthMm) {
      currentLineSegments.push({ text: token.text, bold: token.bold });
      currentLineWidth += tokenWidth;
    } else {
      // Line is full; push current line and start new one
      if (currentLineSegments.length > 0) {
        // Trim trailing space if any
        if (currentLineSegments[currentLineSegments.length - 1].text === ' ') {
          currentLineSegments.pop();
        }
        lines.push({ segments: currentLineSegments, widthMm: currentLineWidth });
        currentLineSegments = [];
        currentLineWidth = 0;
      }

      currentLineSegments.push({ text: token.text, bold: token.bold });
      currentLineWidth = tokenWidth;
    }
  }

  // Push final line if non-empty
  if (currentLineSegments.length > 0) {
    if (currentLineSegments[currentLineSegments.length - 1].text === ' ') {
      currentLineSegments.pop();
    }
    lines.push({ segments: currentLineSegments, widthMm: currentLineWidth });
  }

  return lines;
}
