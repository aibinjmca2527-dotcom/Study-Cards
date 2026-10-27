import { CardLayout, PositionedBox, SheetLayout, LayoutSettings, DEFAULT_LAYOUT_SETTINGS } from './types';

export const PAGE_A4_WIDTH_MM = 210;
export const PAGE_A4_HEIGHT_MM = 297;

/**
 * Packs cards onto A4 sheets using Shelf Packing (First Fit Decreasing Height).
 * Computes both front positions and mirrored back positions for duplex printing.
 */
export function packCardsIntoSheets(
  cards: CardLayout[],
  settings: LayoutSettings = DEFAULT_LAYOUT_SETTINGS
): SheetLayout[] {
  if (!cards || cards.length === 0) {
    return [];
  }

    const {
    marginMm = 5,
    cardGapMm = 0.6,
    duplexEdge = 'long',
    rotateBack180 = false,
  } = settings;

  const pageWidth = PAGE_A4_WIDTH_MM;
  const pageHeight = PAGE_A4_HEIGHT_MM;

  // Sort cards by height descending for optimal shelf packing; tie-break with width or cardId
  const sortedCards = [...cards].sort((a, b) => {
    if (b.heightMm !== a.heightMm) {
      return b.heightMm - a.heightMm;
    }
    if (b.widthMm !== a.widthMm) {
      return b.widthMm - a.widthMm;
    }
    return a.cardId.localeCompare(b.cardId);
  });

  const sheets: SheetLayout[] = [];

  let currentSheetIndex = 1;
  let currentSheetFrontCards: PositionedBox[] = [];

  let currentShelfY = marginMm;
  let currentShelfX = marginMm;
  let currentShelfHeight = 0;

  function finalizeSheet() {
    if (currentSheetFrontCards.length > 0) {
      // Compute mirrored back cards
      const backCards: PositionedBox[] = currentSheetFrontCards.map(f => {
        let backX: number;
        let backY: number;

        if (duplexEdge === 'long') {
          // Long-edge flip (vertical axis reflection):
          // Left becomes right: back.x = pageWidth - front.x - front.width
          // Vertical position stays identical: back.y = front.y
          backX = Math.round((pageWidth - f.x - f.width) * 1000) / 1000;
          backY = f.y;
        } else {
          // Short-edge flip (horizontal axis reflection):
          // Horizontal position stays identical: back.x = front.x
          // Top becomes bottom: back.y = pageHeight - front.y - front.height
          backX = f.x;
          backY = Math.round((pageHeight - f.y - f.height) * 1000) / 1000;
        }

        return {
          card: f.card,
          x: backX,
          y: backY,
          width: f.width,
          height: f.height,
          sheetIndex: currentSheetIndex,
        };
      });

      sheets.push({
        sheetIndex: currentSheetIndex,
        pageWidth,
        pageHeight,
        marginMm,
        frontCards: currentSheetFrontCards,
        backCards,
      });

      currentSheetFrontCards = [];
      currentSheetIndex++;
      currentShelfY = marginMm;
      currentShelfX = marginMm;
      currentShelfHeight = 0;
    }
  }

  for (const card of sortedCards) {
    const cardW = card.widthMm;
    const cardH = card.heightMm;

    // Check if card fits horizontally on current shelf
    const fitsHorizontally = currentShelfX + cardW <= pageWidth - marginMm + 0.001;

    if (fitsHorizontally) {
      // Place on current shelf
      currentSheetFrontCards.push({
        card,
        x: Math.round(currentShelfX * 1000) / 1000,
        y: Math.round(currentShelfY * 1000) / 1000,
        width: cardW,
        height: cardH,
        sheetIndex: currentSheetIndex,
      });

      currentShelfX += cardW + cardGapMm;
      currentShelfHeight = Math.max(currentShelfHeight, cardH);
    } else {
      // Need a new shelf on this sheet
      const nextShelfY = currentShelfY + currentShelfHeight + cardGapMm;
      const fitsVertically = nextShelfY + cardH <= pageHeight - marginMm + 0.001;

      if (fitsVertically) {
        // Start new shelf on same sheet
        currentShelfY = nextShelfY;
        currentShelfX = marginMm;
        currentShelfHeight = cardH;

        currentSheetFrontCards.push({
          card,
          x: Math.round(currentShelfX * 1000) / 1000,
          y: Math.round(currentShelfY * 1000) / 1000,
          width: cardW,
          height: cardH,
          sheetIndex: currentSheetIndex,
        });

        currentShelfX += cardW + cardGapMm;
      } else {
        // Current sheet is full; finalize it and start a new sheet
        finalizeSheet();

        // Place at top-left of new sheet
        currentShelfY = marginMm;
        currentShelfX = marginMm;
        currentShelfHeight = cardH;

        currentSheetFrontCards.push({
          card,
          x: Math.round(currentShelfX * 1000) / 1000,
          y: Math.round(currentShelfY * 1000) / 1000,
          width: cardW,
          height: cardH,
          sheetIndex: currentSheetIndex,
        });

        currentShelfX += cardW + cardGapMm;
      }
    }
  }

  // Finalize remaining sheet
  finalizeSheet();

  return sheets;
}
