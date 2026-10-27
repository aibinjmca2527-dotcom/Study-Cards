import fs from 'fs';
import path from 'path';
import { createCanvas } from '@napi-rs/canvas';

async function rasterize() {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

  const pdfPath = path.resolve(process.cwd(), 'test_output', 'test_cards.pdf');
  const data = new Uint8Array(fs.readFileSync(pdfPath));

  const loadingTask = pdfjs.getDocument({
    data,
    useSystemFonts: true,
    disableFontFace: true,
  });

  const pdfDoc = await loadingTask.promise;
  console.log(`PDF loaded. Total pages: ${pdfDoc.numPages}`);

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for sharp inspection

    const canvas = createCanvas(Math.floor(viewport.width), Math.floor(viewport.height));
    const ctx = canvas.getContext('2d');

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const renderContext = {
      canvasContext: ctx as any,
      viewport,
      canvas: canvas as any,
    };

    await (page.render(renderContext as any) as any).promise;

    const outPath = path.resolve(
      process.cwd(),
      'test_output',
      `page_${pageNum}_${pageNum % 2 === 1 ? 'front' : 'back'}.png`
    );
    const pngBuffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outPath, pngBuffer);
    console.log(`Rendered page ${pageNum} to ${outPath} (${pngBuffer.length} bytes)`);
  }
}

rasterize().catch(err => {
  console.error('Error during rasterization:', err);
  process.exit(1);
});
