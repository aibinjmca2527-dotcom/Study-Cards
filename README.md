# ✂️ Study-Cards (CardCut) — Double-Sided Cut-Out Exam Cards

> Turn pasted question-and-answer pairs into compact, double-sided, cut-out study cards as printable A4 PDFs with sub-millimeter duplex alignment. 100% free, client-side, zero login, zero database.

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Vitest-21_Passed-brightgreen?style=flat&logo=vitest)](https://vitest.dev/)

---

## 🌟 Key Features

- **Bulk Q&A Ingestion**: Paste dozens of questions and answers at once (supports plain blank-line separation, numbered questions `1. `, `2. `, or `Q:`/`A:` prefixes), plus an interactive list editor to add, edit, search, and delete cards.
- **Auto Short Headings**: Automatically extracts clean 1–3 word title-cased headings (`"What is Java?"` → `"Java"`, `"What are Python operators?"` → `"Python Operators"`).
- **Smart Offline Compression**: Normalizes smart quotes/dashes, strips conversational filler words and concluding `"Overall..."` summary sentences, preserving core technical definitions and keywords.
- **Balanced Front/Back Split**: Character-balanced split at natural word or sentence boundaries:
  - **Front**: Bold heading + `" - "` + first half flowing seamlessly on the same line.
  - **Back**: ONLY the continuation (no heading, no question repetition).
- **Customizable Card Text Size (Font Size)**:
  - **⚡ Micro (4.5 pt)**: Ultra-compact, smaller cards, fits 10–15 sentences easily into compact cards and packs up to 30–40 cards per A4 page.
  - **🔹 Compact (5.5 pt)**: Small text for long multi-line explanations.
  - **🔹 Standard (6.5 pt)**: Default balanced size for easy reading.
  - **🔹 Large (7.5 pt)**: Larger text for short formulas and quick definitions.
  - **Fine-tuning Slider**: Select any custom size from **4.0 pt to 8.0 pt**.
- **Duplex Accuracy (Highest Priority)**:
  - **Page Order**: Sheet 1 Front, Sheet 1 Back, Sheet 2 Front, Sheet 2 Back, and so on.
  - **Long-Edge Flip (Book style)**: `backCard.x = pageWidth - frontCard.x - frontCard.width`, `backCard.y = frontCard.y`.
  - **Short-Edge Flip (Calendar style)**: `backCard.x = frontCard.x`, `backCard.y = pageHeight - frontCard.y - frontCard.height`.
  - **180° Inverted Pre-rotation**: Pre-rotates back box coordinates and text so inverted printer drivers produce 100% aligned double-sided cards.
  - **Thin 0.1 mm Cut Borders**: Printed on both sides, matching after flipping.
  - **Safety Margins**: 1.2 mm internal card padding ensures text never bleeds outside the cut border.
- **Pure Client-Side Architecture**: PDF generation runs directly in the browser via `jspdf` (in `mm` units). No backend, no accounts, no data stored anywhere.

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install
```bash
git clone https://github.com/aibinjmca2527-dotcom/Study-Cards.git
cd Study-Cards
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Automated Unit Tests
```bash
npm test
```
Runs 21 unit tests across heading extraction, compression, typography measurement, zero-waste sizing, and duplex geometry.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🌐 How to Deploy to Vercel (Step-by-Step)

Deploying Study-Cards to [Vercel](https://vercel.com/) takes less than 2 minutes and is 100% free:

### Method 1: Deploy with GitHub (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git remote add origin https://github.com/aibinjmca2527-dotcom/Study-Cards.git
   git branch -M main
   git push -u origin main
   ```
2. **Log in to Vercel**:
   Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
3. **Import Project**:
   - Click **"Add New..."** → **"Project"**.
   - Select **`Study-Cards`** from your GitHub repositories list and click **"Import"**.
4. **Deploy**:
   - Keep the default settings (Framework: Next.js, Root Directory: `./`).
   - Click **"Deploy"**.
   - In ~45 seconds, your site will be live on a free `*.vercel.app` URL with automatic SSL!

### Method 2: Deploy with Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

---

## 🖨️ Printing & Cutting Guide

For 0.1 mm double-sided alignment:

1. **Paper Sizing / Scaling**:
   - In your computer's print dialog (Ctrl+P / Cmd+P), select **Scale: 100%** or **Actual Size**.
   - ⚠️ **Turn "Fit to page" OFF** (scaling shrinks the sheet and misaligns the front and back).
2. **Duplex Setting**:
   - Select **Flip on Long Edge** (Book style) in both CardCut and your printer driver.
3. **The 5-Second Window Light Test**:
   - Print 1 test sheet double-sided.
   - Hold the sheet up to a window or lamp: the front and back rectangular cut outlines will overlap like a single shadow!
4. **Cut**:
   - Follow the 0.1 mm hairline cut lines with scissors or a paper trimmer.

---

## 🔒 Security & Privacy

- **100% Client-Side**: No user questions, answers, or generated PDFs are sent over the network.
- **Security Headers**: Includes `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, and `Referrer-Policy: strict-origin-when-cross-origin`.
- **Zero Cookies / Zero Tracking**: No analytics, third-party cookies, or database storage.

---

## 📄 License

MIT License. Free for students, educators, and lifelong learners.
