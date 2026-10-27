import { jsPDF } from 'jspdf';
import { SheetLayout, LayoutSettings, DEFAULT_LAYOUT_SETTINGS, PositionedBox } from './types';
import { PAGE_A4_WIDTH_MM, PAGE_A4_HEIGHT_MM } from './packing';

/**
 * Draws a single front card box and its text lines.
 */
function drawFrontCard(
  doc: jsPDF,
  box: PositionedBox,
  paddingMm: number
) {
  // Thin 0.1 mm cut border
  doc.setLineWidth(0.1);
  doc.setDrawColor(180, 180, 180);
  doc.rect(box.x, box.y, box.width, box.height);

  const card = box.card;
  doc.setTextColor(20, 20, 20);

  let currentY = box.y + paddingMm;

  for (const line of card.frontLines) {
    let currentX = box.x + paddingMm;

    for (const segment of line.segments) {
      doc.setFont('helvetica', segment.bold ? 'bold' : 'normal');
      doc.setFontSize(card.fontSizePt);
      doc.text(segment.text, currentX, currentY, { baseline: 'top' });
      currentX += doc.getTextWidth(segment.text);
    }

    currentY += card.lineHeightMm;
  }
}

/**
 * Draws a single back card box and its text lines (with optional 180° rotation).
 */
function drawBackCard(
  doc: jsPDF,
  box: PositionedBox,
  paddingMm: number,
  rotateBack180: boolean
) {
  // Thin 0.1 mm cut border matching front card
  doc.setLineWidth(0.1);
  doc.setDrawColor(180, 180, 180);
  doc.rect(box.x, box.y, box.width, box.height);

  const card = box.card;
  doc.setTextColor(20, 20, 20);

  if (!rotateBack180) {
    // Standard back orientation
    let currentY = box.y + paddingMm;

    for (const line of card.backLines) {
      let currentX = box.x + paddingMm;

      for (const segment of line.segments) {
        doc.setFont('helvetica', segment.bold ? 'bold' : 'normal');
        doc.setFontSize(card.fontSizePt);
        doc.text(segment.text, currentX, currentY, { baseline: 'top' });
        currentX += doc.getTextWidth(segment.text);
      }

      currentY += card.lineHeightMm;
    }
  } else {
    // 180° rotation around back card center (cx, cy)
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;

    for (let lineIndex = 0; lineIndex < card.backLines.length; lineIndex++) {
      const line = card.backLines[lineIndex];
      const normY = box.y + paddingMm + lineIndex * card.lineHeightMm;
      const lineText = line.segments.map(s => s.text).join('');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(card.fontSizePt);

      // In 180° rotation around (cx, cy):
      // The start anchor is at (2 * cx - (box.x + paddingMm), 2 * cy - normY)
      const rotX = 2 * cx - (box.x + paddingMm);
      const rotY = 2 * cy - normY;

      doc.text(lineText, rotX, rotY, { angle: 180, baseline: 'top' });
    }
  }
}

/**
 * Generates the complete double-sided A4 PDF from packed sheets.
 * Page sequence: Sheet 1 Front, Sheet 1 Back, Sheet 2 Front, Sheet 2 Back...
 */
export function generateCardsPdf(
  sheets: SheetLayout[],
  settings: LayoutSettings = DEFAULT_LAYOUT_SETTINGS
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const {
    paddingMm = 0.35,
    rotateBack180 = false,
  } = settings;

  sheets.forEach((sheet, sheetIdx) => {
    // --- Front Page ---
    if (sheetIdx > 0) {
      doc.addPage('a4', 'portrait');
    }

    // Draw sheet title indicator outside printable cards (subtle 5pt header)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `CardCut - Sheet ${sheet.sheetIndex} (FRONT) | Margin: ${sheet.marginMm}mm | Duplex: ${settings.duplexEdge}-edge`,
      sheet.marginMm,
      Math.max(2.5, sheet.marginMm - 1.5)
    );

    // Draw all front cards on this sheet
    for (const box of sheet.frontCards) {
      drawFrontCard(doc, box, paddingMm);
    }

    // --- Back Page (Mirrored) ---
    doc.addPage('a4', 'portrait');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `CardCut - Sheet ${sheet.sheetIndex} (BACK) | Duplex: ${settings.duplexEdge}-edge${rotateBack180 ? ' | 180° rotated' : ''}`,
      sheet.marginMm,
      Math.max(2.5, sheet.marginMm - 1.5)
    );

    // Draw all back cards on this sheet
    for (const box of sheet.backCards) {
      drawBackCard(doc, box, paddingMm, rotateBack180);
    }
  });

  return doc;
}
