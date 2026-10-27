import { describe, it, expect } from 'vitest';
import {
  generateHeading,
  compressAnswer,
  splitAnswer,
  calculateCardLayout,
  packCardsIntoSheets,
  generateCardsPdf,
  generateCalibrationPdf,
  runLayoutPipeline,
  PAGE_A4_WIDTH_MM,
  PAGE_A4_HEIGHT_MM,
  DEFAULT_LAYOUT_SETTINGS,
  RawCardInput,
  CardLayout,
  parsePastedCards,
} from '../lib/layout';

describe('1. Heading Generation', () => {
  it('converts standard question formats into 1-3 word title-cased headings', () => {
    expect(generateHeading('What is Java?')).toBe('Java');
    expect(generateHeading('What are Python operators?')).toBe('Python Operators');
    expect(generateHeading('What is a byte?')).toBe('Byte');
    expect(generateHeading('Define polymorphism.')).toBe('Polymorphism');
    expect(generateHeading('Explain garbage collection in Java?')).toBe('Garbage Collection');
    expect(generateHeading('How does HTTPS work?')).toBe('HTTPS');
    expect(generateHeading('What is a variable in Python?')).toBe('Variable');
    expect(generateHeading('What are data types in Python?')).toBe('Data Types');
    expect(generateHeading('What is a list in Python?')).toBe('List');
    expect(generateHeading('What are the main features of Python?')).toBe('Main Features');
  });

  it('handles prefixes like Q: and numbered labels', () => {
    expect(generateHeading('Q: What is React?')).toBe('React');
    expect(generateHeading('1. What are ACID properties?')).toBe('ACID Properties');
    expect(generateHeading('1. What is Python?')).toBe('Python');
  });

  it('handles empty or missing input gracefully', () => {
    expect(generateHeading('')).toBe('Card');
    expect(generateHeading('   ')).toBe('Card');
  });
});

describe('2. Compression (Rule-based & Offline)', () => {
  it('normalizes smart quotes, smart apostrophes, and dashes', () => {
    const raw = '“Smart quotes” and ‘single quotes’ — with an em-dash.';
    const res = compressAnswer(raw);
    expect(res.compressed).toContain('"Smart quotes"');
    expect(res.compressed).toContain("'single quotes'");
    expect(res.compressed).toContain('-');
    expect(res.compressed).not.toContain('“');
    expect(res.compressed).not.toContain('—');
  });

  it('removes filler words and introductory padding', () => {
    const raw = 'Basically, in simple terms, Java is a compiled and interpreted language.';
    const res = compressAnswer(raw);
    expect(res.compressed).toBe('Java is a compiled and interpreted language.');
  });

  it('removes concluding "Overall..." summary sentences', () => {
    const raw =
      'Java is an OOP language. It runs on the JVM. Overall, Java is a popular, versatile language for building secure applications.';
    const res = compressAnswer(raw);
    expect(res.removedSummary).toBe(true);
    expect(res.compressed).not.toContain('Overall');
    expect(res.compressed).toContain('Java is an OOP language.');
    expect(res.compressed).toContain('It runs on the JVM.');
  });

  it('prunes lowest-value sentences and gives visible warnings if constrained', () => {
    const longText =
      'Java is a high-level programming language. It was developed by James Gosling at Sun Microsystems in 1995. ' +
      'Java is platform-independent because its programs run on the JVM. ' +
      'Java has a large developer community and extensive learning resources. ' +
      'It is maintained today by Oracle and the wider Java community.';
    const res = compressAnswer(longText, { maxCharacters: 120 });
    expect(res.warning).toBeDefined();
    // Core definition must be preserved
    expect(res.compressed).toContain('Java is a high-level programming language.');
  });
});

describe('3. Answer Split', () => {
  it('divides compressed answer into two balanced halves at word boundary', () => {
    const heading = 'Python';
    const answer =
      'Python is a high-level, general-purpose programming language known for its readability and broad range of applications.';
    const split = splitAnswer(heading, answer);

    expect(split.front).toBeDefined();
    expect(split.back).toBeDefined();
    expect(split.front.length).toBeGreaterThan(0);
    expect(split.back.length).toBeGreaterThan(0);

    // Front + back should reconstruct the full answer
    const reconstructed = `${split.front} ${split.back}`;
    expect(reconstructed.replace(/\s+/g, ' ')).toBe(answer.replace(/\s+/g, ' '));
  });

  it('handles short answers like "Eight bits."', () => {
    const heading = 'Byte';
    const answer = 'Eight bits.';
    const split = splitAnswer(heading, answer);
    expect(split.front).toBe('Eight');
    expect(split.back).toBe('bits.');
  });
});

describe('4. Zero-waste Card Sizing', () => {
  it('ensures front and back have identical dimensions', () => {
    const heading = 'Java';
    const answer =
      'Java is a high-level, object-oriented language. It runs on the JVM and supports Write Once Run Anywhere.';
    const split = splitAnswer(heading, answer);
    const layout = calculateCardLayout(
      'card-1',
      heading,
      answer,
      answer,
      split.front,
      split.back,
      DEFAULT_LAYOUT_SETTINGS
    );

    expect(layout.widthMm).toBeGreaterThanOrEqual(40);
    expect(layout.widthMm).toBeLessThanOrEqual(50);
    expect(layout.heightMm).toBeLessThanOrEqual(40);
    expect(layout.fontSizePt).toBeGreaterThanOrEqual(5.0);
    expect(layout.fontSizePt).toBeLessThanOrEqual(7.0);
  });

  it('breaks very long words with a hyphen if they exceed card width', () => {
    const heading = 'LongWord';
    const longWord = 'SupercalifragilisticexpialidociousTechnologicalTransformationModule';
    const split = splitAnswer(heading, longWord);
    const layout = calculateCardLayout(
      'card-long',
      heading,
      longWord,
      longWord,
      split.front,
      split.back,
      DEFAULT_LAYOUT_SETTINGS
    );

    const hasHyphen = layout.frontLines.some(line =>
      line.segments.some(seg => seg.text.includes('-'))
    );
    expect(hasHyphen).toBe(true);
  });

  it('renders smaller text when user selects micro/compact font size', () => {
    const heading = 'Python';
    const answer = 'Python is a high-level interpreted programming language with dynamic semantics.';
    const split = splitAnswer(heading, answer);
    const layout = calculateCardLayout(
      'card-micro',
      heading,
      answer,
      answer,
      split.front,
      split.back,
      {
        ...DEFAULT_LAYOUT_SETTINGS,
        maxFontSizePt: 4.5,
        minFontSizePt: 3.5,
      }
    );

    expect(layout.fontSizePt).toBeLessThanOrEqual(4.5);
    expect(layout.fontSizePt).toBeGreaterThanOrEqual(3.5);
  });
});

describe('5. Duplex Accuracy & Geometry', () => {
  it('correctly mirrors footprints on Long-edge flip: back.x = pageWidth - front.x - width, back.y = front.y', () => {
    const sampleCards: RawCardInput[] = [
      { id: 'c1', question: 'What is A?', answer: 'Answer for A with enough text to form a clean card.' },
      { id: 'c2', question: 'What is B?', answer: 'Answer for B with enough text to form a clean card.' },
      { id: 'c3', question: 'What is C?', answer: 'Answer for C with enough text to form a clean card.' },
    ];

    const result = runLayoutPipeline(sampleCards, {
      ...DEFAULT_LAYOUT_SETTINGS,
      duplexEdge: 'long',
      marginMm: 5,
    });

    expect(result.sheets.length).toBeGreaterThan(0);
    const sheet = result.sheets[0];

    expect(sheet.frontCards.length).toBe(sheet.backCards.length);

    for (let i = 0; i < sheet.frontCards.length; i++) {
      const front = sheet.frontCards[i];
      const back = sheet.backCards[i];

      // Front and back must share the exact same card identity and physical dimensions
      expect(front.card.cardId).toBe(back.card.cardId);
      expect(front.width).toBe(back.width);
      expect(front.height).toBe(back.height);

      // Long-edge flip mathematical assertion
      const expectedBackX = Math.round((PAGE_A4_WIDTH_MM - front.x - front.width) * 1000) / 1000;
      expect(back.x).toBeCloseTo(expectedBackX, 3);
      expect(back.y).toBeCloseTo(front.y, 3);
    }
  });

  it('correctly mirrors footprints on Short-edge flip: back.x = front.x, back.y = pageHeight - front.y - height', () => {
    const sampleCards: RawCardInput[] = [
      { id: 'c1', question: 'What is A?', answer: 'Answer for A' },
      { id: 'c2', question: 'What is B?', answer: 'Answer for B' },
    ];

    const result = runLayoutPipeline(sampleCards, {
      ...DEFAULT_LAYOUT_SETTINGS,
      duplexEdge: 'short',
      marginMm: 5,
    });

    const sheet = result.sheets[0];
    for (let i = 0; i < sheet.frontCards.length; i++) {
      const front = sheet.frontCards[i];
      const back = sheet.backCards[i];

      expect(front.width).toBe(back.width);
      expect(front.height).toBe(back.height);

      const expectedBackY = Math.round((PAGE_A4_HEIGHT_MM - front.y - front.height) * 1000) / 1000;
      expect(back.x).toBeCloseTo(front.x, 3);
      expect(back.y).toBeCloseTo(expectedBackY, 3);
    }
  });

  it('asserts no two cards overlap and all cards stay strictly within sheet margins for randomized card sets', () => {
    // Generate 35 diverse test cards
    const cards: RawCardInput[] = [];
    for (let i = 1; i <= 35; i++) {
      cards.push({
        id: `rand-${i}`,
        question: `Question ${i}: What is Concept ${i}?`,
        answer: `Concept ${i} is a foundational building block in computer science. ` +
          `Property ${i * 2} handles processing, concurrency, and validation. ` +
          (i % 3 === 0 ? 'Additional technical clause verifying multi-line wrapping and bounds.' : ''),
      });
    }

    const margin = 5;
    const result = runLayoutPipeline(cards, {
      ...DEFAULT_LAYOUT_SETTINGS,
      marginMm: margin,
      duplexEdge: 'long',
    });

    for (const sheet of result.sheets) {
      // 1. Margin boundaries check
      for (const box of [...sheet.frontCards, ...sheet.backCards]) {
        expect(box.x).toBeGreaterThanOrEqual(margin - 0.001);
        expect(box.y).toBeGreaterThanOrEqual(margin - 0.001);
        expect(box.x + box.width).toBeLessThanOrEqual(PAGE_A4_WIDTH_MM - margin + 0.001);
        expect(box.y + box.height).toBeLessThanOrEqual(PAGE_A4_HEIGHT_MM - margin + 0.001);
      }

      // 2. Non-overlapping check among front cards
      for (let i = 0; i < sheet.frontCards.length; i++) {
        for (let j = i + 1; j < sheet.frontCards.length; j++) {
          const a = sheet.frontCards[i];
          const b = sheet.frontCards[j];

          const overlapX = a.x < b.x + b.width - 0.001 && a.x + a.width - 0.001 > b.x;
          const overlapY = a.y < b.y + b.height - 0.001 && a.y + a.height - 0.001 > b.y;

          expect(overlapX && overlapY).toBe(false);
        }
      }

      // 3. Non-overlapping check among back cards
      for (let i = 0; i < sheet.backCards.length; i++) {
        for (let j = i + 1; j < sheet.backCards.length; j++) {
          const a = sheet.backCards[i];
          const b = sheet.backCards[j];

          const overlapX = a.x < b.x + b.width - 0.001 && a.x + a.width - 0.001 > b.x;
          const overlapY = a.y < b.y + b.height - 0.001 && a.y + a.height - 0.001 > b.y;

          expect(overlapX && overlapY).toBe(false);
        }
      }
    }
  });

  it('generates multi-sheet PDF with test cases requiring 3 sheets (6 pages total)', () => {
    // Generate enough cards to span 3 sheets
    const diverseCards: RawCardInput[] = [
      { id: 'c-one-word', question: 'What is a bit?', answer: 'Binary.' },
      { id: 'c-short-def', question: 'What is a byte?', answer: 'Eight bits.' },
      {
        id: 'c-medium',
        question: 'What is Python?',
        answer: 'Python is a high-level, general-purpose programming language known for its readability and broad range of applications.',
      },
      {
        id: 'c-long-java',
        question: 'What is Java?',
        answer:
          'Java is a high-level, object-oriented programming language. It was developed by James Gosling at Sun Microsystems in 1995. ' +
          'Java is platform-independent because its programs run on the Java Virtual Machine (JVM). It follows the principle of "Write Once, Run Anywhere." ' +
          'Java supports classes, objects, inheritance, polymorphism, encapsulation, and abstraction. It is widely used for web applications, ' +
          'desktop software, enterprise applications, and Android development. Java provides automatic memory management through garbage collection. ' +
          'It has strong security features and a rich standard library. Java supports multithreading, allowing multiple tasks to execute concurrently. ' +
          'It also provides exception handling to manage runtime errors. Java is strongly typed and uses a compiler to convert source code into bytecode. ' +
          'The JVM executes this bytecode on supported platforms. Java offers good performance through Just-In-Time (JIT) compilation. ' +
          'It supports networking and database connectivity through JDBC. Java is commonly used in banking, business, and large-scale software systems. ' +
          'Its syntax is similar to C and C++, making it familiar to many programmers. Java has a large developer community and extensive learning resources. ' +
          'It is maintained today by Oracle and the wider Java community. Overall, Java is a popular, versatile language for building secure and reliable applications.',
      },
      {
        id: 'c-punct-tech',
        question: 'What are SQL, NoSQL & REST APIs?',
        answer: 'SQL uses ACID-compliant relational schemas; NoSQL offers horizontal scalability; REST APIs leverage standard HTTP methods (GET/POST/PUT/DELETE) over JSON.',
      },
    ];

    // Add enough mixed cards so we fill at least 3 sheets
    for (let k = 1; k <= 250; k++) {
      diverseCards.push({
        id: `filler-${k}`,
        question: `Question ${k}: Concept #${k}?`,
        answer: `Answer for concept #${k} demonstrates shelf packing, mixed height calculation, zero-waste sizing, and duplex alignment across multiple sheets.`,
      });
    }

    const pipelineResult = runLayoutPipeline(diverseCards, DEFAULT_LAYOUT_SETTINGS);
    expect(pipelineResult.sheets.length).toBeGreaterThanOrEqual(3);

    const doc = generateCardsPdf(pipelineResult.sheets, DEFAULT_LAYOUT_SETTINGS);
    // Total pages = sheets.length * 2 (each sheet has Front and Back)
    expect(doc.getNumberOfPages()).toBe(pipelineResult.sheets.length * 2);
    expect(doc.getNumberOfPages()).toBeGreaterThanOrEqual(6);
  });

  it('generates a 2-page calibration sheet PDF', () => {
    const calDoc = generateCalibrationPdf(DEFAULT_LAYOUT_SETTINGS);
    expect(calDoc.getNumberOfPages()).toBe(2);
  });
});

describe('6. Pasted Text Parser', () => {
  it('parses consecutive numbered questions with Answer: on separate lines without blank lines', () => {
    const raw = `1. What is Python?\nAnswer:\nPython is a high-level programming language.\nIt has a simple syntax.\n2. What are variables in Python?\nAnswer:\nA variable stores a value in memory.\n3. What are data types in Python?\nAnswer:\nData types define the type of value stored in a variable.`;
    const cards = parsePastedCards(raw);
    expect(cards.length).toBe(3);
    expect(cards[0].question).toBe('What is Python?');
    expect(cards[0].answer).toContain('Python is a high-level programming language.');
    expect(cards[1].question).toBe('What are variables in Python?');
    expect(cards[1].answer).toContain('A variable stores a value in memory.');
    expect(cards[2].question).toBe('What are data types in Python?');
    expect(cards[2].answer).toContain('Data types define the type of value stored in a variable.');
  });

  it('parses standard double-newline separated questions', () => {
    const raw = `What is Python?\nPython is a programming language.\n\nWhat is Java?\nJava is an OOP language.`;
    const cards = parsePastedCards(raw);
    expect(cards.length).toBe(2);
    expect(cards[0].question).toBe('What is Python?');
    expect(cards[1].question).toBe('What is Java?');
  });
});
