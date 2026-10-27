import { jsPDF } from 'jspdf';
import { LayoutSettings, DEFAULT_LAYOUT_SETTINGS, PositionedBox, CardLayout } from './types';
import { PAGE_A4_WIDTH_MM, PAGE_A4_HEIGHT_MM } from './packing';

function drawCrosshair(doc: jsPDF, cx: number, cy: number, size: number = 8) {
  doc.setLineWidth(0.15);
  doc.setDrawColor(80, 80, 80);
  // Horizontal line
  doc.line(cx - size, cy, cx + size, cy);
  // Vertical line
  doc.line(cx, cy - size, cx, cy + size);
  // Circle in center
  doc.circle(cx, cy, 2);
}

function drawCalibrationCard(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  title: string,
  subtitle: string,
  rotate180: boolean = false
) {
  doc.setLineWidth(0.1);
  doc.setDrawColor(120, 120, 120);
  doc.rect(x, y, width, height);

  // Corner guide ticks
  const tick = 2;
  doc.line(x, y + tick, x + tick, y);
  doc.line(x + width - tick, y, x + width, y + tick);
  doc.line(x, y + height - tick, x + tick, y + height);
  doc.line(x + width - tick, y + height, x + width, y + height - tick);

  if (!rotate180) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(30, 30, 30);
    doc.text(title, x + width / 2, y + 8, { align: 'center', baseline: 'middle' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(80, 80, 80);
    doc.text(subtitle, x + width / 2, y + 16, { align: 'center', baseline: 'middle' });
    doc.text(`Size: ${width}x${height}mm`, x + width / 2, y + 23, { align: 'center', baseline: 'middle' });
  } else {
    const cx = x + width / 2;
    const cy = y + height / 2;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(30, 30, 30);
    doc.text(title, 2 * cx - (x + width / 2), 2 * cy - (y + 8), {
      align: 'center',
      baseline: 'middle',
      angle: 180,
    });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(80, 80, 80);
    doc.text(subtitle, 2 * cx - (x + width / 2), 2 * cy - (y + 16), {
      align: 'center',
      baseline: 'middle',
      angle: 180,
    });
    doc.text(`Size: ${width}x${height}mm`, 2 * cx - (x + width / 2), 2 * cy - (y + 23), {
      align: 'center',
      baseline: 'middle',
      angle: 180,
    });
  }
}

/**
 * Generates a 2-page calibration PDF (Front & Back) with alignment crosshairs and sample boxes.
 */
export function generateCalibrationPdf(
  settings: LayoutSettings = DEFAULT_LAYOUT_SETTINGS
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const {
    marginMm = 5,
    duplexEdge = 'long',
    rotateBack180 = false,
  } = settings;

  const pw = PAGE_A4_WIDTH_MM;
  const ph = PAGE_A4_HEIGHT_MM;

  // Calibration cards dimensions
  const cardW = 45;
  const cardH = 30;

  // Front card positions (4 test cards spaced across the sheet)
  const frontCoords = [
    { id: '1', x: marginMm + 10, y: marginMm + 35 },
    { id: '2', x: pw - marginMm - cardW - 10, y: marginMm + 35 },
    { id: '3', x: marginMm + 10, y: ph - marginMm - cardH - 35 },
    { id: '4', x: pw - marginMm - cardW - 10, y: ph - marginMm - cardH - 35 },
  ];

  // --- PAGE 1: FRONT ---
  // Page Title & Instructions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(20, 20, 20);
  doc.text('CardCut Duplex Calibration Sheet (FRONT)', pw / 2, marginMm + 10, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 70);
  doc.text(`Target duplex setting: Flip on ${duplexEdge.toUpperCase()} edge | Margin: ${marginMm} mm`, pw / 2, marginMm + 16, { align: 'center' });
  doc.text('Print Settings: Scale 100% (Actual size) | Fit to page: OFF | Duplex: ON', pw / 2, marginMm + 21, { align: 'center' });

  // Crosshairs at 4 corners
  drawCrosshair(doc, marginMm, marginMm, 7);
  drawCrosshair(doc, pw - marginMm, marginMm, 7);
  drawCrosshair(doc, marginMm, ph - marginMm, 7);
  drawCrosshair(doc, pw - marginMm, ph - marginMm, 7);
  // Center crosshair
  drawCrosshair(doc, pw / 2, ph / 2, 10);

  // Draw 4 test cards on front
  frontCoords.forEach(pos => {
    drawCalibrationCard(
      doc,
      pos.x,
      pos.y,
      cardW,
      cardH,
      `TEST CARD ${pos.id} (FRONT)`,
      'Front Alignment Target',
      false
    );
  });

  // Footer instructions on front
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text(
    'Hold printed page to light source: Crosshairs & card cut borders must overlap exactly with the back.',
    pw / 2,
    ph - marginMm - 10,
    { align: 'center' }
  );

  // --- PAGE 2: BACK (Mirrored) ---
  doc.addPage('a4', 'portrait');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(20, 20, 20);
  doc.text('CardCut Duplex Calibration Sheet (BACK)', pw / 2, marginMm + 10, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 70);
  doc.text(`Duplex: ${duplexEdge.toUpperCase()}-edge | Back text rotation: ${rotateBack180 ? '180° ON' : 'OFF'}`, pw / 2, marginMm + 16, { align: 'center' });
  doc.text('Verification: Align this back side with the front side against a light.', pw / 2, marginMm + 21, { align: 'center' });

  // Crosshairs mirrored
  // When flipping long edge (vertical): Left (marginMm) becomes Right (pw - marginMm)
  // Crosshairs are symmetric on 4 corners and center!
  drawCrosshair(doc, marginMm, marginMm, 7);
  drawCrosshair(doc, pw - marginMm, marginMm, 7);
  drawCrosshair(doc, marginMm, ph - marginMm, 7);
  drawCrosshair(doc, pw - marginMm, ph - marginMm, 7);
  drawCrosshair(doc, pw / 2, ph / 2, 10);

  // Compute mirrored positions for back cards
  frontCoords.forEach(pos => {
    let backX: number;
    let backY: number;

    if (duplexEdge === 'long') {
      backX = pw - pos.x - cardW;
      backY = pos.y;
    } else {
      backX = pos.x;
      backY = ph - pos.y - cardH;
    }

    drawCalibrationCard(
      doc,
      backX,
      backY,
      cardW,
      cardH,
      `TEST CARD ${pos.id} (BACK)`,
      'Mirrored Alignment Target',
      rotateBack180
    );
  });

  // Footer instructions on back
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text(
    'If borders match: your duplex setup is calibrated! If inverted: toggle 180° back rotation.',
    pw / 2,
    ph - marginMm - 10,
    { align: 'center' }
  );

  return doc;
}
