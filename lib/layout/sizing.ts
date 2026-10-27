import { jsPDF } from 'jspdf';
import { CardLayout, CardTextLine, LayoutSettings, DEFAULT_LAYOUT_SETTINGS } from './types';
import { getMeasureDoc, getLineHeightMm, wrapTokensToLines, WrapToken } from './measure';
import { compressAnswer } from './compression';
import { splitAnswer } from './split';

/**
 * Builds tokens for the Front of a card:
 * Bold heading, followed by " - ", followed by words of the front half.
 */
export function buildFrontTokens(heading: string, frontText: string): WrapToken[] {
  const tokens: WrapToken[] = [];

  if (heading) {
    tokens.push({ text: heading, bold: true });
    tokens.push({ text: ' - ', bold: false });
  }

  const words = frontText.split(/\s+/).filter(Boolean);
  for (let i = 0; i < words.length; i++) {
    tokens.push({ text: words[i], bold: false });
    if (i < words.length - 1) {
      tokens.push({ text: ' ', bold: false, isSpace: true });
    }
  }

  return tokens;
}

/**
 * Builds tokens for the Back of a card:
 * ONLY the continuation (no heading, no question).
 */
export function buildBackTokens(backText: string): WrapToken[] {
  const tokens: WrapToken[] = [];
  const words = backText.split(/\s+/).filter(Boolean);

  for (let i = 0; i < words.length; i++) {
    tokens.push({ text: words[i], bold: false });
    if (i < words.length - 1) {
      tokens.push({ text: ' ', bold: false, isSpace: true });
    }
  }

  return tokens;
}

interface SizingCandidate {
  fontSizePt: number;
  widthMm: number;
  heightMm: number;
  areaMm2: number;
  frontLines: CardTextLine[];
  backLines: CardTextLine[];
  lineHeightMm: number;
  frontTextHeightMm: number;
  backTextHeightMm: number;
  fillPercentage: number;
}

/**
 * Evaluates candidate layout for a specific font size and width.
 */
function evaluateCandidate(
  frontTokens: WrapToken[],
  backTokens: WrapToken[],
  fontSizePt: number,
  widthMm: number,
  maxHeightMm: number,
  paddingMm: number,
  doc: jsPDF
): SizingCandidate | null {
  const usableWidth = widthMm - 2 * paddingMm;
  const usableHeight = maxHeightMm - 2 * paddingMm;
  const lineHeightMm = getLineHeightMm(fontSizePt);

  const frontLines = wrapTokensToLines(frontTokens, usableWidth, fontSizePt, doc);
  const backLines = wrapTokensToLines(backTokens, usableWidth, fontSizePt, doc);

  const fontHeightMm = (fontSizePt * 25.4) / 72;
  // Account for full vertical glyph span (ascender + cap height + descenders) ~1.28 * fontHeight
  const fontTotalHeightMm = fontHeightMm * 1.28;
  const frontTextHeightMm = frontLines.length > 0 ? (frontLines.length - 1) * lineHeightMm + fontTotalHeightMm : 0;
  const backTextHeightMm = backLines.length > 0 ? (backLines.length - 1) * lineHeightMm + fontTotalHeightMm : 0;

  if (frontTextHeightMm > usableHeight || backTextHeightMm > usableHeight) {
    return null;
  }

  // Zero-waste card height: smallest box hugging the taller side, plus top/bottom padding and safety margin
  const textHeight = Math.max(frontTextHeightMm, backTextHeightMm);
  // Ensure a reasonable minimum height (at least 10mm for micro text <= 4.5pt, 12mm for <= 5.5pt, 14mm otherwise)
  const minH = fontSizePt <= 4.5 ? 10 : fontSizePt <= 5.5 ? 12 : 14;
  const heightMm = Math.min(
    maxHeightMm,
    Math.max(minH, Math.ceil((textHeight + 2 * paddingMm + 0.8) * 10) / 10)
  );
  const areaMm2 = widthMm * heightMm;

  // Calculate fill percentage of usable vertical space
  const fillPercentage = Math.min(100, Math.round((textHeight / (heightMm - 2 * paddingMm)) * 100));

  return {
    fontSizePt,
    widthMm,
    heightMm,
    areaMm2,
    frontLines,
    backLines,
    lineHeightMm,
    frontTextHeightMm,
    backTextHeightMm,
    fillPercentage,
  };
}

/**
 * Computes optimal card size and typography with zero-waste principles.
 * Finds the largest font size (7.0 down to 5.0 pt, step 0.25) that fits,
 * then the smallest-area width (40 to 50 mm).
 */
export function calculateCardLayout(
  cardId: string,
  heading: string,
  originalAnswer: string,
  compressedAnswer: string,
  frontFirstHalf: string,
  backSecondHalf: string,
  settings: LayoutSettings = DEFAULT_LAYOUT_SETTINGS,
  initialWarning?: string
): CardLayout {
  const doc = getMeasureDoc();
  const {
    minFontSizePt = 4.5,
    maxFontSizePt = 6.5,
    minWidthMm = 40,
    maxWidthMm = 50,
    maxHeightMm = 40,
    paddingMm = 1.2,
  } = settings;

  // Ensure safe range
  const safeMaxPt = Math.max(minFontSizePt, maxFontSizePt);
  const safeMinPt = Math.min(minFontSizePt, maxFontSizePt);

  // Step 0.25 pt descending
  const fontSizes: number[] = [];
  for (let pt = safeMaxPt; pt >= safeMinPt - 0.001; pt -= 0.25) {
    fontSizes.push(Math.round(pt * 100) / 100);
  }

  // Candidate widths in 1 mm steps: [40, 41, ..., 50]
  const candidateWidths: number[] = [];
  for (let w = minWidthMm; w <= maxWidthMm; w += 1) {
    candidateWidths.push(w);
  }

  let curFront = frontFirstHalf;
  let curBack = backSecondHalf;
  let curWarning = initialWarning;
  let frontTokens = buildFrontTokens(heading, curFront);
  let backTokens = buildBackTokens(curBack);

  // Search largest font size that fits
  for (const fontSize of fontSizes) {
    const validCandidatesForSize: SizingCandidate[] = [];

    for (const width of candidateWidths) {
      const candidate = evaluateCandidate(
        frontTokens,
        backTokens,
        fontSize,
        width,
        maxHeightMm,
        paddingMm,
        doc
      );
      if (candidate) {
        validCandidatesForSize.push(candidate);
      }
    }

    if (validCandidatesForSize.length > 0) {
      // Pick the smallest-area width for zero waste
      validCandidatesForSize.sort((a, b) => a.areaMm2 - b.areaMm2);
      const best = validCandidatesForSize[0];

      return {
        cardId,
        heading,
        frontLines: best.frontLines,
        backLines: best.backLines,
        fontSizePt: best.fontSizePt,
        lineHeightMm: best.lineHeightMm,
        widthMm: best.widthMm,
        heightMm: best.heightMm,
        frontTextHeightMm: best.frontTextHeightMm,
        backTextHeightMm: best.backTextHeightMm,
        fillPercentage: best.fillPercentage,
        warning: curWarning,
        frontRawText: curFront,
        backRawText: curBack,
      };
    }
  }

  // If text could not fit even at minFontSize and maxWidth:
  // Perform progressive pruning so it fits within bounds, and set warning.
  // Capacity scales inversely with font size:
  let budgetChars = Math.round(520 * (5.0 / safeMinPt));
  let pruneAttempts = 0;

  while (pruneAttempts < 5) {
    pruneAttempts++;
    budgetChars -= 60;
    const pruned = compressAnswer(originalAnswer, { maxCharacters: budgetChars });
    const resplit = splitAnswer(heading, pruned.compressed);
    curFront = resplit.front;
    curBack = resplit.back;
    curWarning = pruned.warning || `Answer pruned to fit maximum card dimensions at ${safeMinPt.toFixed(1)} pt.`;
    frontTokens = buildFrontTokens(heading, curFront);
    backTokens = buildBackTokens(curBack);

    const candidate = evaluateCandidate(
      frontTokens,
      backTokens,
      safeMinPt,
      maxWidthMm,
      maxHeightMm,
      paddingMm,
      doc
    );

    if (candidate) {
      return {
        cardId,
        heading,
        frontLines: candidate.frontLines,
        backLines: candidate.backLines,
        fontSizePt: candidate.fontSizePt,
        lineHeightMm: candidate.lineHeightMm,
        widthMm: candidate.widthMm,
        heightMm: candidate.heightMm,
        frontTextHeightMm: candidate.frontTextHeightMm,
        backTextHeightMm: candidate.backTextHeightMm,
        fillPercentage: candidate.fillPercentage,
        warning: curWarning,
        frontRawText: curFront,
        backRawText: curBack,
      };
    }
  }

  // Fallback: force render at safeMinPt and maxWidthMm
  const fallbackLineHeight = getLineHeightMm(safeMinPt);
  const usableWidth = maxWidthMm - 2 * paddingMm;
  const frontLines = wrapTokensToLines(frontTokens, usableWidth, safeMinPt, doc);
  const backLines = wrapTokensToLines(backTokens, usableWidth, safeMinPt, doc);
  const textHeight = Math.max(frontLines.length * fallbackLineHeight, backLines.length * fallbackLineHeight);

  return {
    cardId,
    heading,
    frontLines,
    backLines,
    fontSizePt: safeMinPt,
    lineHeightMm: fallbackLineHeight,
    widthMm: maxWidthMm,
    heightMm: maxHeightMm,
    frontTextHeightMm: frontLines.length * fallbackLineHeight,
    backTextHeightMm: backLines.length * fallbackLineHeight,
    fillPercentage: Math.min(100, Math.round((textHeight / (maxHeightMm - 2 * paddingMm)) * 100)),
    warning: curWarning || `Text fits tightly at minimum font size (${safeMinPt.toFixed(1)} pt).`,
    frontRawText: curFront,
    backRawText: curBack,
  };
}
