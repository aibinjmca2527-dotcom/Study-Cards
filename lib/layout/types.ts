export type DuplexEdge = 'long' | 'short';

export interface RawCardInput {
  id: string;
  question: string;
  answer: string;
}

export interface ProcessedCard {
  id: string;
  question: string;
  originalAnswer: string;
  heading: string;
  compressedAnswer: string;
  frontFirstHalf: string;
  backSecondHalf: string;
  warning?: string;
}

export interface CardTextSegment {
  text: string;
  bold: boolean;
}

export interface CardTextLine {
  segments: CardTextSegment[];
  widthMm: number;
}

export interface CardLayout {
  cardId: string;
  heading: string;
  frontLines: CardTextLine[];
  backLines: CardTextLine[];
  fontSizePt: number;
  lineHeightMm: number;
  widthMm: number;
  heightMm: number;
  frontTextHeightMm: number;
  backTextHeightMm: number;
  fillPercentage: number;
  warning?: string;
  frontRawText: string;
  backRawText: string;
}

export interface PositionedBox {
  card: CardLayout;
  x: number;
  y: number;
  width: number;
  height: number;
  sheetIndex: number;
}

export interface SheetLayout {
  sheetIndex: number; // 1-based index
  pageWidth: number;  // 210 mm
  pageHeight: number; // 297 mm
  marginMm: number;
  frontCards: PositionedBox[];
  backCards: PositionedBox[];
}

export type TextSizeMode = 'micro' | 'compact' | 'standard' | 'large' | 'custom';

export interface LayoutSettings {
  marginMm: number;       // default 5 mm
  duplexEdge: DuplexEdge; // 'long' | 'short'
  rotateBack180: boolean; // default false
  textSizePreset?: TextSizeMode; // 'micro' (4.5pt) | 'compact' (5.5pt) | 'standard' (6.5pt) | 'large' (7.5pt)
  minFontSizePt: number;  // default 4.5 pt
  maxFontSizePt: number;  // default 6.5 pt
  minWidthMm: number;     // default 40 mm
  maxWidthMm: number;     // default 50 mm
  maxHeightMm: number;    // default 40 mm
  paddingMm: number;      // default 0.35 mm
  cardGapMm: number;      // default 0.6 mm
}

export const DEFAULT_LAYOUT_SETTINGS: LayoutSettings = {
  marginMm: 5,
  duplexEdge: 'long',
  rotateBack180: false,
  textSizePreset: 'standard',
  minFontSizePt: 4.5,
  maxFontSizePt: 6.5,
  minWidthMm: 40,
  maxWidthMm: 50,
  maxHeightMm: 40,
  paddingMm: 0.35,
  cardGapMm: 0.6,
};
