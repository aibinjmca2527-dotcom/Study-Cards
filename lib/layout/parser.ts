import { RawCardInput } from './types';

/**
 * Parses pasted text into an array of RawCardInput objects.
 * Robustly supports:
 * 1. Numbered question lists (e.g. "1. What is Python?\nAnswer:\n...\n2. What are...") with or without blank lines.
 * 2. Explicit "Q:" / "Question:" and "A:" / "Answer:" markers (on same line or separate line).
 * 3. Question on first line, answer on subsequent lines, separated by blank lines.
 * 4. Multi-line answers with single-sentence lines.
 */
export function parsePastedCards(rawText: string): RawCardInput[] {
  if (!rawText || !rawText.trim()) {
    return [];
  }

  // Normalize line endings to \n
  const normalized = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalized.split('\n');

  // Check if text has numbered items or explicit Q/A markers
  const hasNumberedMarkers = lines.some(l => /^\s*\d+[\.\)]\s+\S/.test(l));
  const hasQMarkers = lines.some(l => /^\s*(?:Q\s*[:.-]|Question\s*\d*[:.-])/i.test(l));
  const hasAMarkers = lines.some(l => /^\s*(?:A\s*[:.-]|Answer\s*[:.-])/i.test(l));

  if (hasNumberedMarkers || hasQMarkers || hasAMarkers) {
    const cards: RawCardInput[] = [];
    let currentQ = '';
    let currentALines: string[] = [];
    let idCounter = 1;

    function pushCurrentCard() {
      if (currentQ.trim() || currentALines.length > 0) {
        cards.push({
          id: `card-${Date.now()}-${idCounter++}`,
          question: currentQ.trim(),
          answer: currentALines.join(' ').trim(),
        });
      }
      currentQ = '';
      currentALines = [];
    }

    let inAnswerMode = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        // Blank line inside answers can be preserved or ignored
        continue;
      }

      // Check for Question starter: "1. What is..." or "Q: What is..." or "Question 1: What is..."
      const isNumberedQ = /^\s*\d+[\.\)]\s+\S/.test(line);
      const isExplicitQ = /^\s*(?:Q\s*[:.-]|Question\s*\d*[:.-])\s*/i.test(line);

      if (isNumberedQ || isExplicitQ) {
        // Save previous card
        pushCurrentCard();
        inAnswerMode = false;

        const cleanQ = line
          .replace(/^\s*\d+[\.\)]\s*/, '')
          .replace(/^\s*(?:Q\s*[:.-]|Question\s*\d*[:.-])\s*/i, '')
          .trim();
        currentQ = cleanQ;
        continue;
      }

      // Check for Answer marker: "Answer:" or "A:" or "Answer: Python is..."
      const answerMatch = line.match(/^\s*(?:A\s*[:.-]|Answer\s*[:.-])\s*(.*)$/i);
      if (answerMatch) {
        inAnswerMode = true;
        const inlineContent = answerMatch[1].trim();
        if (inlineContent) {
          currentALines.push(inlineContent);
        }
        continue;
      }

      // If we are in answer mode, add line to answer
      if (inAnswerMode) {
        currentALines.push(line);
      } else {
        if (!currentQ) {
          currentQ = line;
        } else {
          // If current question ends with ?, this line is the beginning of the answer!
          if (/[?!]$/.test(currentQ)) {
            inAnswerMode = true;
            currentALines.push(line);
          } else {
            // Continuation of question
            currentQ += ' ' + line;
          }
        }
      }
    }

    pushCurrentCard();
    if (cards.length > 0) {
      return cards;
    }
  }

  // Fallback: standard blank-line separated blocks
  const blocks = normalized
    .split(/\n\s*\n+/)
    .map(b => b.trim())
    .filter(Boolean);

  let idCounter = 1;
  const cards: RawCardInput[] = [];

  for (const block of blocks) {
    const bLines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (bLines.length === 0) continue;

    // Check for Answer: marker inside block
    const aIdx = bLines.findIndex(l => /^(?:A\s*[:.-]|Answer\s*[:.-])/i.test(l));
    let question = '';
    let answer = '';

    if (aIdx !== -1) {
      question = bLines
        .slice(0, aIdx)
        .join(' ')
        .replace(/^\s*(?:Q\s*[:.-]|Question\s*\d*[:.-]|\d+[\.\)])\s*/i, '')
        .trim();
      const firstALine = bLines[aIdx].replace(/^(?:A\s*[:.-]|Answer\s*[:.-])\s*/i, '').trim();
      const restALines = bLines.slice(aIdx + 1);
      answer = [firstALine, ...restALines].filter(Boolean).join(' ').trim();
    } else {
      question = bLines[0]
        .replace(/^\s*(?:Q\s*[:.-]|Question\s*\d*[:.-]|\d+[\.\)])\s*/i, '')
        .trim();
      answer = bLines.slice(1).join(' ').trim();
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
