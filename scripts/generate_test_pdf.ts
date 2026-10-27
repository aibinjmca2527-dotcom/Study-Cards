import fs from 'fs';
import path from 'path';
import {
  runLayoutPipeline,
  generateCardsPdf,
  generateCalibrationPdf,
  DEFAULT_LAYOUT_SETTINGS,
  RawCardInput,
} from '../lib/layout';

const testCards: RawCardInput[] = [
  {
    id: 'test-1-word',
    question: 'What is a bit?',
    answer: 'Binary.',
  },
  {
    id: 'test-byte',
    question: 'What is a byte?',
    answer: 'Eight bits.',
  },
  {
    id: 'test-python',
    question: 'What is Python?',
    answer:
      'Python is a high-level, general-purpose programming language known for its readability and broad range of applications.',
  },
  {
    id: 'test-java-long',
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
    id: 'test-punct-tech',
    question: 'What are SQL, NoSQL & REST APIs?',
    answer:
      'SQL databases utilize ACID-compliant relational schemas with strict table constraints; NoSQL stores (key-value, document, graph) emphasize horizontal scale; REST APIs expose standard HTTP CRUD endpoints returning structured JSON.',
  },
  {
    id: 'test-multiline',
    question: 'How do Operating System Kernels manage processes?',
    answer:
      'The kernel uses Process Control Blocks (PCBs) to maintain CPU registers, memory maps, and file descriptors. Context switching saves register state on hardware timer interrupts. Preemptive schedulers balance throughput and latency via Multi-Level Feedback Queues.',
  },
  {
    id: 'test-mixed-height-1',
    question: 'What is DNS?',
    answer: 'Domain Name System translates human-readable hostnames into IP addresses.',
  },
  {
    id: 'test-mixed-height-2',
    question: 'What is Big-O Notation?',
    answer:
      'Big-O notation characterizes the upper bound of an algorithm’s time or memory requirements in terms of input size N.',
  },
];

async function main() {
  const outputDir = path.resolve(process.cwd(), 'test_output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Running layout pipeline on test cards...');
  const result = runLayoutPipeline(testCards, DEFAULT_LAYOUT_SETTINGS);

  console.log(`Generated ${result.sheets.length} sheets (${result.sheets.length * 2} pages).`);
  for (const sheet of result.sheets) {
    console.log(
      `Sheet ${sheet.sheetIndex}: ${sheet.frontCards.length} front cards, ${sheet.backCards.length} back cards.`
    );
  }

  const doc = generateCardsPdf(result.sheets, DEFAULT_LAYOUT_SETTINGS);
  const pdfBytes = doc.output('arraybuffer');
  const pdfPath = path.join(outputDir, 'test_cards.pdf');
  fs.writeFileSync(pdfPath, Buffer.from(pdfBytes));
  console.log(`Saved cards PDF to ${pdfPath} (${pdfBytes.byteLength} bytes)`);

  const calDoc = generateCalibrationPdf(DEFAULT_LAYOUT_SETTINGS);
  const calBytes = calDoc.output('arraybuffer');
  const calPath = path.join(outputDir, 'test_calibration.pdf');
  fs.writeFileSync(calPath, Buffer.from(calBytes));
  console.log(`Saved calibration PDF to ${calPath} (${calBytes.byteLength} bytes)`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
