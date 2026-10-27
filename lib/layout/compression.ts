/**
 * Compression module for CardCut.
 * Rule-based, works completely offline.
 * Normalizes punctuation, removes filler phrases, removes concluding summaries,
 * and handles progressive sentence pruning with warnings if text exceeds card capacity.
 */

export interface CompressionResult {
  compressed: string;
  warning?: string;
  removedSummary?: boolean;
  truncated?: boolean;
}

const FILLER_PHRASES: RegExp[] = [
  /\b(?:basically|essentially|in\s+simple\s+terms|in\s+other\s+words|as\s+a\s+matter\s+of\s+fact|it\s+is\s+worth\s+noting\s+that|it\s+goes\s+without\s+saying\s+that|needless\s+to\s+say|as\s+you\s+know|generally\s+speaking|strictly\s+speaking|simply\s+put),\s*/gi,
  /\b(?:to\s+put\s+it\s+simply|in\s+short),\s*/gi,
];

const CONCLUDING_STARTERS: RegExp[] = [
  /^overall,?\s*/i,
  /^in\s+conclusion,?\s*/i,
  /^to\s+summarize,?\s*/i,
  /^in\s+summary,?\s*/i,
  /^all\s+in\s+all,?\s*/i,
  /^to\s+conclude,?\s*/i,
  /^ultimately,?\s*/i,
];

/**
 * Normalizes quotes, dashes, and extra whitespace.
 */
export function normalizeText(text: string): string {
  if (!text) return '';

  return text
    // Replace smart double quotes
    .replace(/[\u201C\u201D\u201E\u201F\u00AB\u00BB]/g, '"')
    // Replace smart single quotes / apostrophes
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    // Replace em dashes and en dashes with standard hyphen/dash
    .replace(/[\u2013\u2014\u2015]/g, '-')
    // Replace non-breaking spaces
    .replace(/[\u00A0\u2007\u202F]/g, ' ')
    // Normalize newlines and tabs to space
    .replace(/[\r\n\t]+/g, ' ')
    // Collapse multiple spaces
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Splits text into individual sentences accurately.
 */
export function splitSentences(text: string): string[] {
  if (!text) return [];

  // Match sentences ending with . ! ? followed by space or end of string, avoiding common abbreviations
  const rawSentences: string[] = [];
  let current = '';
  const tokens = text.split(/(\s+)/);

  for (const token of tokens) {
    current += token;
    // Check if token ends with sentence terminator (. ! ?) and is not e.g., "e.g.", "i.e.", "vs."
    const isAbbr = /\b(?:e\.g|i\.e|vs|etc|mr|ms|dr|prof)\.$/i.test(token.trim());
    const hasPunctuation = /[.!?]$/.test(token.trim());

    if (hasPunctuation && !isAbbr) {
      rawSentences.push(current.trim());
      current = '';
    }
  }

  if (current.trim().length > 0) {
    rawSentences.push(current.trim());
  }

  return rawSentences.filter(s => s.length > 0);
}

/**
 * Evaluates the informational value of a sentence to prioritize retention.
 * Higher score = more important.
 */
function scoreSentence(sentence: string, index: number, total: number): number {
  let score = 0;

  // The first sentence is almost always the core definition!
  if (index === 0) score += 100;
  // The second sentence often has key architectural / foundational facts
  if (index === 1) score += 30;

  // Penalize concluding / summary sentences
  for (const pattern of CONCLUDING_STARTERS) {
    if (pattern.test(sentence)) {
      score -= 50;
      break;
    }
  }

  // Penalize general community / maintenance sentences
  if (/\b(?:developer\s+community|maintained\s+today|learning\s+resources|widely\s+popular)\b/i.test(sentence)) {
    score -= 20;
  }

  // Penalize secondary historical notes if not definition
  if (index > 0 && /\b(?:developed\s+by|released\s+in|founded\s+in)\b/i.test(sentence)) {
    score -= 10;
  }

  // Boost technical keywords, principles, and structured lists
  if (/\b(?:supports|features|architecture|virtual\s+machine|compiler|runtime|memory|performance|security)\b/i.test(sentence)) {
    score += 15;
  }
  if (/\b(?:classes|objects|inheritance|polymorphism|encapsulation|abstraction)\b/i.test(sentence)) {
    score += 25;
  }
  if (/[A-Z]{2,}/.test(sentence)) { // Acronyms like JVM, JIT, JDBC
    score += 15;
  }

  return score;
}

/**
 * Compresses an answer rule-based and offline.
 */
export function compressAnswer(
  rawAnswer: string,
  options?: {
    maxCharacters?: number; // Approximate safety threshold if needed
  }
): CompressionResult {
  if (!rawAnswer || typeof rawAnswer !== 'string') {
    return { compressed: '' };
  }

  let text = normalizeText(rawAnswer);

  // 1. Remove filler words
  for (const regex of FILLER_PHRASES) {
    text = text.replace(regex, '');
  }

  // 2. Split into sentences
  let sentences = splitSentences(text);
  let removedSummary = false;

  // 3. Remove closing summary / overall sentence if present
  if (sentences.length > 1) {
    const lastSentence = sentences[sentences.length - 1];
    for (const pattern of CONCLUDING_STARTERS) {
      if (pattern.test(lastSentence)) {
        sentences.pop();
        removedSummary = true;
        break;
      }
    }
  }

  let compressed = sentences.join(' ').trim();
  let warning: string | undefined;

  // 4. If maxCharacters is specified and text exceeds it, prune lowest-value sentences
  const maxChars = options?.maxCharacters;
  let truncated = false;

  if (maxChars && compressed.length > maxChars && sentences.length > 1) {
    // Score sentences
    const scored = sentences.map((s, idx) => ({
      sentence: s,
      score: scoreSentence(s, idx, sentences.length),
      originalIndex: idx,
    }));

    // Keep dropping lowest scored sentences (except index 0 which is core definition)
    while (compressed.length > maxChars && scored.length > 1) {
      // Find candidate with lowest score among non-first sentences
      let lowestIdx = 1;
      let minScore = scored[1].score;
      for (let i = 2; i < scored.length; i++) {
        if (scored[i].score < minScore) {
          minScore = scored[i].score;
          lowestIdx = i;
        }
      }

      scored.splice(lowestIdx, 1);
      // Reassemble in original order
      compressed = scored
        .slice()
        .sort((a, b) => a.originalIndex - b.originalIndex)
        .map(item => item.sentence)
        .join(' ');
    }

    warning = 'Answer was compressed: low-priority sentences were removed to fit card limits.';
  }

  // 5. Hard truncation if still strictly exceeding maximum limit
  if (maxChars && compressed.length > maxChars) {
    compressed = compressed.slice(0, maxChars - 3).trim() + '...';
    truncated = true;
    warning = 'Warning: Answer truncated with "..." to stay within maximum card boundaries at 5 pt.';
  }

  return {
    compressed,
    warning,
    removedSummary,
    truncated,
  };
}
