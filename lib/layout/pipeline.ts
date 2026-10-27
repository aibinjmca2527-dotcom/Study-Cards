import {
  RawCardInput,
  ProcessedCard,
  CardLayout,
  SheetLayout,
  LayoutSettings,
  DEFAULT_LAYOUT_SETTINGS,
} from './types';
import { generateHeading } from './heading';
import { compressAnswer } from './compression';
import { splitAnswer } from './split';
import { calculateCardLayout } from './sizing';
import { packCardsIntoSheets } from './packing';

export const DEFAULT_SAMPLE_TEXT = `What is Java?
Java is a high-level, object-oriented programming language. It was developed by James Gosling at Sun Microsystems in 1995. Java is platform-independent because its programs run on the Java Virtual Machine (JVM). It follows the principle of "Write Once, Run Anywhere." Java supports classes, objects, inheritance, polymorphism, encapsulation, and abstraction. It is widely used for web applications, desktop software, enterprise applications, and Android development. Java provides automatic memory management through garbage collection. It has strong security features and a rich standard library. Java supports multithreading, allowing multiple tasks to execute concurrently. It also provides exception handling to manage runtime errors. Java is strongly typed and uses a compiler to convert source code into bytecode. The JVM executes this bytecode on supported platforms. Java offers good performance through Just-In-Time (JIT) compilation. It supports networking and database connectivity through JDBC. Java is commonly used in banking, business, and large-scale software systems. Its syntax is similar to C and C++, making it familiar to many programmers. Java has a large developer community and extensive learning resources. It is maintained today by Oracle and the wider Java community. Overall, Java is a popular, versatile language for building secure and reliable applications.

What is Python?
Python is a high-level, general-purpose programming language known for its readability and broad range of applications.

What is a byte?
Eight bits.`;

export const PRELOADED_TEST_CARDS: RawCardInput[] = [
  {
    id: 'preload-java',
    question: 'What is Java?',
    answer:
      'Java is a high-level, object-oriented programming language. It was developed by James Gosling at Sun Microsystems in 1995. Java is platform-independent because its programs run on the Java Virtual Machine (JVM). It follows the principle of "Write Once, Run Anywhere." Java supports classes, objects, inheritance, polymorphism, encapsulation, and abstraction. It is widely used for web applications, desktop software, enterprise applications, and Android development. Java provides automatic memory management through garbage collection. It has strong security features and a rich standard library. Java supports multithreading, allowing multiple tasks to execute concurrently. It also provides exception handling to manage runtime errors. Java is strongly typed and uses a compiler to convert source code into bytecode. The JVM executes this bytecode on supported platforms. Java offers good performance through Just-In-Time (JIT) compilation. It supports networking and database connectivity through JDBC. Java is commonly used in banking, business, and large-scale software systems. Its syntax is similar to C and C++, making it familiar to many programmers. Java has a large developer community and extensive learning resources. It is maintained today by Oracle and the wider Java community. Overall, Java is a popular, versatile language for building secure and reliable applications.',
  },
  {
    id: 'preload-python',
    question: 'What is Python?',
    answer:
      'Python is a high-level, general-purpose programming language known for its readability and broad range of applications.',
  },
  {
    id: 'preload-byte',
    question: 'What is a byte?',
    answer: 'Eight bits.',
  },
];

export interface PipelineResult {
  processedCards: ProcessedCard[];
  cardLayouts: CardLayout[];
  sheets: SheetLayout[];
}

/**
 * Executes the complete CardCut layout pipeline.
 */
export function runLayoutPipeline(
  inputs: RawCardInput[],
  settings: LayoutSettings = DEFAULT_LAYOUT_SETTINGS
): PipelineResult {
  const processedCards: ProcessedCard[] = [];
  const cardLayouts: CardLayout[] = [];

  for (const input of inputs) {
    if (!input.question && !input.answer) continue;

    // 1. Heading extraction
    const heading = generateHeading(input.question);

    // 2. Rule-based offline compression
    const compression = compressAnswer(input.answer);

    // 3. Balanced split into Front and Back halves
    const split = splitAnswer(heading, compression.compressed);

    const processed: ProcessedCard = {
      id: input.id,
      question: input.question,
      originalAnswer: input.answer,
      heading,
      compressedAnswer: compression.compressed,
      frontFirstHalf: split.front,
      backSecondHalf: split.back,
      warning: compression.warning,
    };
    processedCards.push(processed);

    // 4. Zero-waste card sizing & typography
    const layout = calculateCardLayout(
      input.id,
      heading,
      input.answer,
      compression.compressed,
      split.front,
      split.back,
      settings,
      compression.warning
    );
    cardLayouts.push(layout);
  }

  // 5. Packing into A4 sheets with duplex back-mirroring
  const sheets = packCardsIntoSheets(cardLayouts, settings);

  return {
    processedCards,
    cardLayouts,
    sheets,
  };
}
