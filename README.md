# ✂️ CardCut — Double-Sided Cut-Out Exam Study Cards

> Turn pasted question-and-answer pairs into compact, double-sided, cut-out study cards as printable A4 PDFs with micro-accurate duplex alignment. 100% free, client-side, zero login, zero database.

![CardCut Preview](test_output/page_1_front.png)

---

## 🌟 Key Features

- **Bulk Q&A Ingestion**: Paste dozens of questions and answers at once (supports plain blank-line separation or `Q:`/`A:` prefixes), plus an interactive list editor to add, edit, search, and delete cards.
- **Auto Short Headings**: Automatically extracts clean 1–3 word title-cased headings (`"What is Java?"` → `"Java"`, `"What are Python operators?"` → `"Python Operators"`).
- **Smart Offline Compression**: Normalizes smart quotes/dashes, strips conversational filler words and concluding `"Overall..."` summary sentences, and preserves core technical definitions and keywords.
- **Balanced Front/Back Split**: Character-balanced split at natural word or sentence boundaries:
  - **Front**: Bold heading + `" - "` + first half flowing seamlessly on the same line.
  - **Back**: ONLY the continuation (no heading, no question repetition).
- **Zero-Waste Card Sizing**: Computes layout first, choosing the largest font (`7 pt` down to `5 pt`, step `0.25`) that fits, then the smallest-area width (`4–5 cm` wide, up to `4 cm` high, `~0.35 mm` padding).
- **Duplex Accuracy (Highest Priority)**:
  - **Page Order**: Sheet 1 Front, Sheet 1 Back, Sheet 2 Front, Sheet 2 Back, and so on.
  - **Long-Edge Flip (Book style)**: `backCard.x = pageWidth - frontCard.x - frontCard.width`, `backCard.y = frontCard.y`.
  - **Short-Edge Flip (Calendar style)**: `backCard.x = frontCard.x`, `backCard.y = pageHeight - frontCard.y - frontCard.height`.
  - **Thin 0.1 mm Cut Borders**: Printed on both sides, matching after flipping.
  - **Back Text Rotation 180°**: Optional toggle for printer drivers where short-edge backs print inverted.
  - **Printable Calibration Sheet**: 2-page alignment test PDF with corner and center crosshairs to verify physical duplex alignment before printing large decks.
- **Pure Client-Side Architecture**: PDF generation runs directly in the browser via `jspdf` (in `mm` units). No backend, no accounts, no data stored anywhere.

---

## 📂 Project Structure

```
├── app/
│   ├── layout.tsx         # Next.js Root Layout with fonts, SEO & ThemeProvider
│   ├── globals.css        # Tailwind CSS v4 styling & 3D perspective utilities
│   ├── page.tsx           # Modern Landing Page (Hero, 3D flip teaser, Features, FAQ)
│   └── app/
│       └── page.tsx       # Core Generator Application (/app)
├── components/
│   ├── Navbar.tsx         # Responsive navigation header with light/dark toggle
│   ├── Footer.tsx         # Minimal footer with privacy badges
│   ├── ThemeProvider.tsx  # Persistent light/dark mode context
│   ├── CardPreview.tsx    # Interactive 3D flip card inspector with cm & font metrics
│   ├── SheetPreview.tsx   # Interactive A4 SVG preview showing real sheet placement
│   └── PrintInstructionsBox.tsx # High-visibility duplex printing guidelines
├── lib/layout/            # Pure, framework-independent TypeScript layout engine
│   ├── types.ts           # Interfaces & default settings
│   ├── heading.ts         # 1-3 word heading extraction
│   ├── compression.ts     # Offline rule-based text compression & sentence pruning
│   ├── split.ts           # Balanced word-boundary front/back divider
│   ├── measure.ts         # jsPDF Helvetica typography measuring & hyphenation
│   ├── sizing.ts          # Zero-waste box sizing & font selection
│   ├── packing.ts         # Shelf packing on A4 & duplex mirrored coordinate reflection
│   ├── pdf.ts             # Client-side double-sided A4 PDF generator
│   ├── calibration.ts     # 2-page crosshair calibration test PDF generator
│   ├── parser.ts          # Pasted text parser and serializer
│   └── pipeline.ts        # End-to-end pipeline orchestrator & preloaded decks
├── scripts/
│   ├── generate_test_pdf.ts # Generates test PDF files to test_output/
│   └── rasterize_pdf.ts   # Rasterizes PDF pages into PNGs for visual inspection
├── tests/
│   └── layout.test.ts     # 16 Vitest unit tests covering math, packing & duplex geometry
└── test_output/           # Generated PDF and PNG inspection artifacts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `20+` or `24+`
- npm `9+`

### Installation

```bash
git clone <repository-url>
cd Exam_helper
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Validation

### Run Unit Tests (Vitest)

The test suite validates:
1. 1–3 word heading generation from varied question patterns.
2. Smart offline compression, quote normalization, and closing summary removal.
3. Character-balanced answer splitting.
4. Zero-waste card dimensions (4–5 cm width, ≤ 4 cm height, 5–7 pt font).
5. Duplex accuracy (Long-edge and Short-edge geometric reflections).
6. Non-overlapping shelf packing and strict margin containment.
7. Multi-sheet PDF generation (requiring ≥ 3 sheets / 6 pages).
8. Calibration sheet generation.

```bash
npm run test
```

### Visual PDF Inspection & Rasterization

To generate a sample test PDF and rasterize pages into high-resolution PNGs:

```bash
# 1. Generate test PDFs in test_output/
npx tsx scripts/generate_test_pdf.ts

# 2. Rasterize pages into PNGs for visual proofing
npx tsx scripts/rasterize_pdf.ts
```

Output files will appear in `test_output/`:
- `test_cards.pdf`
- `test_calibration.pdf`
- `page_1_front.png`
- `page_2_back.png`

---

## 🖨️ Printing Instructions (Crucial for Duplex Accuracy)

When printing your generated double-sided cards:

1. **Scale**: Set to **`100%`** or **`Actual size`**.
   - ⚠️ Ensure **"Fit to page"** or **"Shrink oversized pages"** is **TURNED OFF**. Scaling the page will shift the mirrored footprints.
2. **Duplex Mode**: Turn **`2-Sided Printing ON`**.
   - Select the matching flip direction:
     - **Flip on Long Edge** (if you selected Long-edge in CardCut settings).
     - **Flip on Short Edge** (if you selected Short-edge in CardCut settings).
3. **Trial Sheet**: Click **"Calibration Sheet"** in CardCut to print a 2-page test with corner crosshairs. Hold it up to a light source:
   - If the front and back borders match, your printer duplex is calibrated!
   - If the back comes out upside-down, toggle **"Rotate back text 180°"** in settings.

---

## ☁️ Deployment to Vercel

CardCut is built with the Next.js App Router and has **no backend, no database, and no server environment variables required**.

1. Push your repository to **GitHub**.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Select Framework Preset: **Next.js**.
5. Click **Deploy**.

Your app is now live with instant zero-config client-side rendering!

---

## 📄 License

MIT License. Open source and free for students and educators worldwide.
