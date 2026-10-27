/**
 * Split module for CardCut.
 * Divides the compressed answer into two balanced halves at word boundary,
 * taking into account the heading and separator on the front so that front and back
 * text heights remain as equal as possible.
 */

export interface SplitResult {
  front: string;
  back: string;
  splitIndex: number;
}

export function splitAnswer(heading: string, answer: string): SplitResult {
  const cleanAnswer = answer.trim();

  if (!cleanAnswer) {
    return { front: '', back: '', splitIndex: 0 };
  }

  // Visual prefix length on front card is: heading + " - "
  const prefixLength = (heading ? heading.length + 3 : 0);
  const totalLength = prefixLength + cleanAnswer.length;

  // We want (prefixLength + frontLength) ≈ backLength
  // frontLength + backLength = cleanAnswer.length
  // (prefixLength + frontLength) ≈ (cleanAnswer.length - frontLength)
  // 2 * frontLength ≈ cleanAnswer.length - prefixLength
  let targetCut = Math.floor((cleanAnswer.length - prefixLength) / 2);

  // If targetCut is too small (e.g. very short answer or long heading),
  // target roughly the middle of the answer so both sides get text.
  if (targetCut < 1) {
    targetCut = Math.floor(cleanAnswer.length / 2);
  }

  // Find all whitespace indices in the answer
  const spaceIndices: number[] = [];
  for (let i = 0; i < cleanAnswer.length; i++) {
    if (/\s/.test(cleanAnswer[i])) {
      spaceIndices.push(i);
    }
  }

  if (spaceIndices.length === 0) {
    // Single word answer: if very long, cut in half with hyphen
    if (cleanAnswer.length > 12) {
      const mid = Math.floor(cleanAnswer.length / 2);
      return {
        front: cleanAnswer.slice(0, mid) + '-',
        back: cleanAnswer.slice(mid),
        splitIndex: mid,
      };
    }
    // Very short single word: front gets word, back gets dash or repeated anchor
    return {
      front: cleanAnswer,
      back: '(end)',
      splitIndex: cleanAnswer.length,
    };
  }

  // Look for sentence boundaries (. ! ?) near targetCut (within 20% range)
  let bestCut = spaceIndices[0];
  let minDistance = Number.MAX_SAFE_INTEGER;
  const sentenceWindow = Math.max(15, Math.floor(cleanAnswer.length * 0.15));

  for (const idx of spaceIndices) {
    const isSentenceEnd = idx > 0 && /[.!?]/.test(cleanAnswer[idx - 1]);
    const dist = Math.abs(idx - targetCut);

    // If it's a sentence end within window, give it a significant bonus
    const effectiveDist = isSentenceEnd && dist <= sentenceWindow ? dist * 0.5 : dist;

    if (effectiveDist < minDistance) {
      minDistance = effectiveDist;
      bestCut = idx;
    }
  }

  const front = cleanAnswer.slice(0, bestCut).trim();
  const back = cleanAnswer.slice(bestCut).trim();

  return {
    front,
    back,
    splitIndex: bestCut,
  };
}
