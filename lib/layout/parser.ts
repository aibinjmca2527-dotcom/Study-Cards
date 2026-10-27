import { RawCardInput } from './types';

/**
 * Parses pasted text into an array of RawCardInput objects.
 * Supports:
 * 1. Question on first line, answer on subsequent lines, separated by blank lines.
 * 2. Explicit "Q:" and "A:" prefixed blocks.
 * 3. Numbered questions (e.g. "1. Question", "2) Question").
 */
export function parsePastedCards(rawText: string): RawCardInput[] {
  if (!rawText || !rawText.trim()) {
    return [];
  }

  const cards: RawCardInput[] = [];

  // Normalize line endings to \n
  const normalized = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Split into paragraphs / blocks separated by one or more blank lines
  const blocks = normalized
    .split(/\n\s*\n+/)
    .map(b => b.trim())
    .filter(Boolean);

  let idCounter = 1;

  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    // Check if block has explicit Q: and A: prefixes
    let question = '';
    let answer = '';

    const qIndex = lines.findIndex(l => /^Q\s*[:.-]/i.test(l));
    const aIndex = lines.findIndex(l => /^A\s*[:.-]/i.test(l));

    if (qIndex !== -1 && aIndex !== -1 && aIndex > qIndex) {
      // Collect question lines
      const qLines = lines.slice(qIndex, aIndex).map((l, i) =>
        i === 0 ? l.replace(/^Q\s*[:.-]\s*/i, '') : l
      );
      question = qLines.join(' ').trim();

      // Collect answer lines
      const aLines = lines.slice(aIndex).map((l, i) =>
        i === 0 ? l.replace(/^A\s*[:.-]\s*/i, '') : l
      );
      answer = aLines.join(' ').trim();
    } else {
      // Standard format: Line 1 is Question, remaining lines are Answer
      question = lines[0].replace(/^Q\s*[:.-]\s*/i, '').trim();
      answer = lines.slice(1).map(l => l.replace(/^A\s*[:.-]\s*/i, '')).join(' ').trim();
    }

    if (question || answer) {
      cards.push({
        id: `card-${Date.now()}-${idCounter++}`,
        question,
        answer,
      });
    }
  }

  return cards;
}

/**
 * Formats an array of cards back into pasted text format.
 */
export function formatCardsToText(cards: RawCardInput[]): string {
  return cards
    .map(c => `${c.question.trim()}\n${c.answer.trim()}`)
    .join('\n\n');
}
