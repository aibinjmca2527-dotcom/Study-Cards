/**
 * Converts a question string into a concise 1-3 word heading.
 * Examples:
 * - "What is Java?" -> "Java"
 * - "What are Python operators?" -> "Python Operators"
 * - "What is a byte?" -> "Byte"
 * - "Difference between Stack and Heap?" -> "Stack vs Heap"
 */
export function generateHeading(rawQuestion: string): string {
  if (!rawQuestion || typeof rawQuestion !== 'string' || !rawQuestion.trim()) {
    return 'Card';
  }

  // 1. Strip leading question markers (e.g., "Q:", "Q.", "Question:", "1.", "1)", "#")
  let q = rawQuestion.trim();
  q = q.replace(/^(Q\s*[:.-]|Question\s*[:.-]|\d+[\.\)]|\#+)\s*/i, '').trim();

  // 2. Normalize punctuation and whitespace
  q = q.replace(/[?!:;.,]+$/, '').trim();

  // 3. Handle "difference between X and Y"
  const diffMatch = q.match(/^(?:what\s+is\s+the\s+)?difference\s+between\s+(.+?)\s+and\s+(.+)$/i);
  if (diffMatch) {
    const part1 = cleanPhrase(diffMatch[1]);
    const part2 = cleanPhrase(diffMatch[2]);
    const w1 = part1.split(/\s+/)[0] || 'Item1';
    const w2 = part2.split(/\s+/)[0] || 'Item2';
    return toTitleCase(`${w1} vs ${w2}`);
  }

  // 4. Common question starter prefixes to remove
  const starterPrefixes = [
    /^what\s+(?:is|are|was|were|does|do)\s+(?:the\s+meaning\s+of|the\s+definition\s+of|the\s+concept\s+of|the\s+role\s+of)?/i,
    /^what\s+(?:is|are|was|were|does|do)\s+(?:a|an|the)?/i,
    /^what\s+makes/i,
    /^explain\s+(?:the\s+concept\s+of|the\s+meaning\s+of|the\s+definition\s+of|how\s+to|how|why|the)?/i,
    /^define\s+(?:the\s+term|the\s+concept\s+of|the)?/i,
    /^describe\s+(?:the\s+concept\s+of|the|how)?/i,
    /^discuss\s+(?:the)?/i,
    /^how\s+(?:does|do|can|to|would|is|are)\s+(?:the)?/i,
    /^why\s+(?:is|are|does|do\s+we\s+use|do|would)\s+(?:the)?/i,
    /^give\s+(?:the\s+definition\s+of|the\s+meaning\s+of|the)?/i,
    /^state\s+(?:the)?/i,
    /^list\s+(?:the)?/i,
    /^can\s+you\s+(?:explain|describe|define)?/i,
    /^tell\s+me\s+about\s+(?:the)?/i,
    /^which\s+(?:is|are)\s+(?:the)?/i,
  ];

  for (const prefix of starterPrefixes) {
    if (prefix.test(q)) {
      q = q.replace(prefix, '').trim();
      break;
    }
  }

  // 5. Remove trailing filler phrases
  q = q.replace(/\s+(?:stand\s+for|used\s+for|work|works|operate|operates|mean|means|do|in\s+programming|in\s+simple\s+terms)$/i, '').trim();

  // 6. Clean leading/trailing articles or prepositions left over
  q = q.replace(/^(?:a|an|the|of|in|for|to)\s+/i, '').trim();

  // 7. Extract words
  const words = q.split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    // Fallback to first words of raw question
    const fallbackWords = rawQuestion.replace(/[?!:;.,]/g, '').trim().split(/\s+/).slice(0, 3);
    return fallbackWords.length > 0 ? toTitleCase(fallbackWords.join(' ')) : 'Card';
  }

  // Pick up to 3 words
  const selectedWords = words.slice(0, 3);
  const trailingPrepositions = new Set(['in', 'of', 'for', 'to', 'with', 'at', 'on', 'by', 'from', 'and', 'the', 'a', 'an']);

  while (selectedWords.length > 1 && trailingPrepositions.has(selectedWords[selectedWords.length - 1].toLowerCase())) {
    selectedWords.pop();
  }

  return toTitleCase(selectedWords.join(' '));
}

function cleanPhrase(phrase: string): string {
  return phrase.replace(/[?!:;.,]+$/, '').replace(/^(?:a|an|the)\s+/i, '').trim();
}

const COMMON_ACRONYMS = new Set([
  'JVM', 'JDK', 'JRE', 'API', 'REST', 'SQL', 'ACID', 'HTML', 'CSS', 'DOM',
  'HTTP', 'HTTPS', 'JSON', 'XML', 'CPU', 'RAM', 'SSD', 'OS', 'TCP', 'IP',
  'UDP', 'DNS', 'URL', 'URI', 'OOP', 'DRY', 'KISS', 'SOLID', 'CI', 'CD',
  'AWS', 'GCP', 'SSH', 'SSL', 'TLS', 'CLI', 'GUI', 'UI', 'UX', 'AI', 'ML'
]);

function toTitleCase(str: string): string {
  return str
    .split(/\s+/)
    .map(word => {
      // Check if word without punctuation matches known acronym
      const clean = word.replace(/[^a-zA-Z0-9]/g, '');
      const upper = clean.toUpperCase();
      if (COMMON_ACRONYMS.has(upper)) {
        return word.replace(clean, upper);
      }
      if (/^[A-Z0-9]{2,}$/.test(clean)) {
        // Already capitalized acronym
        return word;
      }
      if (word.toLowerCase() === 'vs') {
        return 'vs';
      }
      // Normal title case
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}
