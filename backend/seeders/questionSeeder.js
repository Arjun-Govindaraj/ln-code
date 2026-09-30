const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Question = require('../models/Question');

// Helper function to shuffle an array and track where the correct answer moved
const shuffleOptionsAndGetAnswerIndex = (optionsList, correctIndex = 0) => {
  const correctAnswer = optionsList[correctIndex];
  
  // Fisher-Yates Shuffle
  const shuffled = [...optionsList];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Find new index of correct answer
  const newAnswerIndex = shuffled.indexOf(correctAnswer);

  return {
    options: shuffled,
    answer: newAnswerIndex
  };
};

const generateAll375Questions = () => {
  const languages = ['python', 'javascript', 'html', 'java', 'c'];
  const levels = ['beginner', 'intermediate', 'veteran'];
  
  const questionBank = [];

  const topicsMap = {
    python: {
      beginner: [
        'List vs Tuple mutability', 'Type checking type([])', 'Function definition syntax', 'File extensions .py',
        'String multiplication', 'Length check len()', 'Single line comments', 'Boolean zero evaluation',
        'List pop() method', 'Floor division // operator', 'Set unique elements', 'Exponentiation ** operator',
        'String to Int conversion', 'String upper() method', 'Try-except block usage', 'Zero-based indexing',
        'Boolean non-empty string', 'File open() method', 'Range function range()', 'Type checking type()',
        'Break statement in loops', 'List append() method', 'String concatenation', 'Inequality operator !=',
        'Dictionary literal syntax'
      ],
      intermediate: [
        '@staticmethod decorator', 'List comprehension squaring', '*args positional parameters', '**kwargs dictionary parameter',
        'Generator yield lazy evaluation', 'String join() method', 'Dictionary copy() method', 'Default function return value',
        'Lambda anonymous functions', 'Class __init__ constructor', 'Zip function zip()', 'Shallow vs Deep Copy',
        'Pass statement placeholder', 'Catching multiple exceptions', 'Map function map()', 'Context manager with statement',
        'Isinstance type validation', 'List addition concatenation', 'Dictionary keys() view', 'List reverse slicing [::-1]',
        'Abstract Base Classes abc', 'Identity operator "is" vs "=="', 'Enumerate function enumerate()', 'Filter function filter()',
        'Regular expressions re module'
      ],
      veteran: [
        'CPython Global Interpreter Lock (GIL)', 'Metaclass __new__ vs __init__', 'C3 Linearization MRO', 'Class __slots__ memory optimization',
        'Dunder __call__ callable objects', 'Descriptor protocol __get__ __set__', 'Asyncio event loop coroutines', 'Functools lru_cache memoization',
        'Context manager __enter__ __exit__', 'Generational Garbage Collector', 'Refcount monitoring sys.getrefcount', 'Sub-generator delegation yield from',
        'Weak references weakref module', 'Metaclass namespace __prepare__', 'C foreign function library ctypes', 'Unawaited coroutines creation',
        'Coroutine origin tracking depth', 'Static typing Any vs Object', 'Bytecode optimization flag -O', 'PyPy JIT tracing execution',
        'Inspect signature inspect.signature', 'Type hinting PEP 484 standard', 'Async task contextvars', 'Property descriptor @property',
        'String interning sys.intern'
      ]
    },
    javascript: {
      beginner: [
        'Strict equality === operator', 'Block scoping with let/const', 'Console logging console.log', 'Typeof null legacy bug',
        'Const immutable binding', 'JSON parsing JSON.parse', 'Type coercion in addition 2 + "2"', 'Array push() method',
        'Single line comment // syntax', 'Browser alert alert() dialog', 'Uninitialized variable undefined', 'Array pop() method',
        'Array length property', 'Onclick event handler', 'NaN Not-a-Number representation', 'Arrow function () => {} syntax',
        'String concatenation + operator', 'Falsy empty string Boolean("")', 'JSON serialization JSON.stringify', 'Conditional if execution',
        'ToLowerCase string conversion', 'Logical AND && operator', 'GetElementById DOM selection', 'Math.round float rounding',
        'Array unshift() method'
      ],
      intermediate: [
        'Function scoped var in setTimeout', 'Closure variable capture', 'Array map() transformation', 'Array filter() predicate',
        'Array reduce() accumulator', 'Promise.then async handling', 'Async/Await syntactic sugar', 'Object destructuring syntax',
        'Spread operator ... array clone', 'Rest parameters in functions', 'Object.keys() array output', 'Default parameter values',
        'Template literals backtick syntax', 'Array find() method', 'Set object uniqueness', 'Map key-value pairs',
        'Optional chaining ?. operator', 'Nullish coalescing ?? operator', 'Object freeze Object.freeze', 'Array includes() search',
        'Custom Event dispatching', 'DOM querySelector selection', 'Localstorage setItem method', 'SessionStorage vs LocalStorage',
        'Array splice vs slice'
      ],
      veteran: [
        'Microtask queue vs Macrotask queue', 'Event Loop phases execution', 'Prototypal inheritance __proto__', 'Symbol primitive type uniqueness',
        'WeakMap garbage collection', 'Generator function yield next', 'Proxy object trap intercepts', 'Reflect API method invocation',
        'V8 Hidden Classes optimization', 'V8 Inline Caching', 'Debounce vs Throttle functions', 'Shadow DOM encapsulation',
        'Web Workers multithreading', 'Intersection Observer API', 'MutationObserver DOM watching', 'RequestAnimationFrame rendering',
        'Currying function partial execution', 'Module bundler tree shaking', 'CORS preflight OPTIONS request', 'Strict mode "use strict"',
        'Tail call optimization', 'SharedArrayBuffer memory sharing', 'Atomics atomic operations', 'WebAssembly Wasm interop',
        'Service Worker caching'
      ]
    },
    html: {
      beginner: [
        'Footer semantic tag <footer>', 'Header semantic tag <header>', 'Paragraph element <p>', 'Hyperlink tag <a> href',
        'Image tag <img> alt attribute', 'Unordered list <ul> tag', 'Ordered list <ol> tag', 'List item <li> tag',
        'Table element <table> syntax', 'Form container <form> tag', 'Input text field <input type="text">', 'Button element <button>',
        'Division container <div> tag', 'Inline span container <span>', 'Main heading <h1> tag', 'Line break <br> tag',
        'Horizontal rule <hr> tag', 'Meta charset declaration', 'Title tag <title> element', 'Doctype html declaration',
        'Checkboxes <input type="checkbox">', 'Radio buttons <input type="radio">', 'Label tag <label> for binding', 'Dropdown <select> <option>',
        'Textarea multi-line text'
      ],
      intermediate: [
        'Rel="noopener noreferrer" target="_blank"', 'Semantic section vs article', 'Nav navigation bar element', 'Aside sidebar content',
        'Figure and figcaption syntax', 'HTML5 video tag controls', 'Audio tag autoplay attribute', 'Iframe sandbox attribute',
        'Input type email validation', 'Input type number min/max', 'Form action method POST/GET', 'Form enctype multipart/form-data',
        'Meta viewport responsive layout', 'Data-* custom attributes', 'Script async vs defer attributes', 'Favicon link rel="icon"',
        'Picture element responsive images', 'Srcset and sizes attributes', 'SVG inline vector graphic', 'Canvas raster drawing surface',
        'Audio/Video MIME type declaration', 'Disabled vs Readonly attributes', 'Autofocus form attribute', 'Placeholder text styling',
        'Hidden attribute DOM rendering'
      ],
      veteran: [
        'DOM vs Vector SVG parser', 'HTML parsing pipeline tokenization', 'Critical Rendering Path blocking', 'DOM Tree construction',
        'CSSOM integration phase', 'Preload vs Prefetch rel links', 'DNS-prefetch rel link', 'Content Security Policy meta tag',
        'Web Components Custom Elements', 'Shadow DOM attachShadow()', 'HTML Templates <template> tag', 'Slot element <slot> insertion',
        'Microdata schema.org markup', 'Open Graph protocol meta tags', 'Twitter Card meta tags', 'Crossorigin attribute anonymous',
        'Ismap vs Usemap image maps', 'Contenteditable attribute Security', 'ARIA accessibility roles aria-live', 'ARIA aria-expanded state',
        'Manifest.json Web App Manifest', 'Service Worker registration HTML', 'Http-equiv headers meta tags', 'Subresource Integrity SRI hash',
        'Feature Policy / Permissions Policy'
      ]
    },
    java: {
      beginner: [
        'Protected access modifier scope', 'Public main method signature', 'Primitive data types count', 'String immutability in Java',
        'Array declaration syntax', 'If-else conditional branching', 'Switch statement case breaking', 'For loop standard syntax',
        'While loop iteration', 'Do-while loop execution', 'Class declaration keyword', 'Object instantiation new keyword',
        'Constructor declaration', 'Method overloading polymorphism', 'System.out.println output', 'Scanner input parsing',
        'ArrayList vs Array', 'Package declaration package', 'Import statement import', 'Final variable immutability',
        'Static keyword scope', 'This keyword reference', 'Super keyword inheritance', 'Interface declaration interface',
        'Abstract class definition'
      ],
      intermediate: [
        'Finally block exception guarantee', 'Try-catch exception handling', 'Checked vs Unchecked exceptions', 'Custom exception extension',
        'HashMap key-value storage', 'HashSet unique elements', 'LinkedList vs ArrayList', 'Generics type parameters <T>',
        'Method overriding @Override', 'Encapsulation getters setters', 'Inheritance extends keyword', 'Polymorphism dynamic dispatch',
        'Comparable vs Comparator interface', 'Enum class declaration', 'StringBuilder vs String', 'Java I/O FileReader BufferedReader',
        'Thread creation extends Thread', 'Runnable interface implementation', 'Synchronized block thread safety', 'Volatile keyword visibility',
        'Lambda expressions FunctionalInterface', 'Stream API filter map collect', 'Optional class null safety', 'Garbage collection System.gc()',
        'Autoboxing and Unboxing'
      ],
      veteran: [
        'WeakReference vs SoftReference GC', 'JVM Memory Architecture Heap/Stack', 'Metaspace memory allocation', 'JIT Compiler C1/C2 compilers',
        'Garbage Collectors G1 vs ZGC', 'ForkJoinPool parallel processing', 'Java Memory Model volatile barrier', 'CompletableFuture async composition',
        'Custom ClassLoader implementation', 'Reflection API Method.invoke()', 'Dynamic Proxies java.lang.reflect', 'Bytecode verification phase',
        'ThreadLocal memory leak risks', 'Phaser and CyclicBarrier synchronization', 'ReentrantLock vs Synchronized', 'Unsafe class direct memory',
        'VarHandles java.lang.invoke', 'Java Modules module-info.java', 'Virtual Threads Project Loom', 'JMH Java Microbenchmark Harness',
        'GraalVM Ahead-Of-Time compilation', 'Off-Heap DirectByteBuffer', 'MethodHandles API performance', 'Annotation Processor processing',
        'Garbage Collection Safepoints'
      ]
    },
    c: {
      beginner: [
        'Double format specifier %lf', 'Printf standard output', 'Scanf user input address &', 'Int data type byte size',
        'Char string null terminator \\0', 'Pointer declaration * symbol', 'Address-of operator &', 'If-else condition check',
        'Switch case default statement', 'For loop control structure', 'While loop execution', 'Do-while loop guarantee',
        'Array zero-based indexing', 'Function prototype declaration', 'Main function int return', 'Void function return type',
        'Header file stdio.h inclusion', 'Macro definition #define', 'Const keyword immutability', 'Arithmetic operators precedence',
        'Relational operators comparison', 'Logical operators && || !', 'Ternary operator ? :', 'Sizeof operator byte calculation',
        'Break and continue keywords'
      ],
      intermediate: [
        'Malloc NULL return on failure', 'Calloc zero-initialized memory', 'Realloc memory resizing', 'Free function heap deallocation',
        'Struct custom data structure', 'Typedef alias creation', 'Union memory sharing', 'File pointers FILE* fopen',
        'Fgetc fputc character I/O', 'Fgets fputs string I/O', 'Fread fwrite binary I/O', 'Pointers to pointers **ptr',
        'Array name as constant pointer', 'String functions strlen strcpy', 'String comparison strcmp', 'String concatenation strcat',
        'Scope of global vs local variables', 'Static variables persistent memory', 'Extern keyword variable sharing', 'Enum enumerated constants',
        'Bitwise operators & | ^ ~', 'Shift operators << >>', 'Command line arguments argc argv', 'Recursion stack frame',
        'Function pointers declaration'
      ],
      veteran: [
        'Memory leak free() requirement', 'Dangling pointer wild pointer', 'Buffer overflow vulnerability', 'Stack overflow recursion limit',
        'Memory alignment and structure padding', 'Bit fields struct member size', 'Volatile qualifier hardware register', 'Inline functions __inline__',
        'Void pointers void* generic memory', 'Self-referential structures nodes', 'Dynamic 2D array matrix malloc', 'Signal handling signal.h',
        'Process creation fork() exec()', 'Setjmp and longjmp non-local jumps', 'Memory barrier fence instructions', 'Atomic operations stdatomic.h',
        'POSIX Threads pthreads creation', 'Mutex locking pthread_mutex', 'Condition variables pthread_cond', 'Deadlock conditions resource holding',
        'Shared memory shmget shmat', 'Endianness Big vs Little Endian', 'Compiler optimization flags -O2 -O3', 'Segmentation Fault SIGSEGV analysis',
        'Valgrind memory leak profiling'
      ]
    }
  };

  languages.forEach((lang) => {
    levels.forEach((lvl) => {
      const topicList = topicsMap[lang][lvl];
      
      topicList.forEach((topicName, idx) => {
        const qNum = idx + 1;
        const isCodeRequired = lvl !== 'beginner' && (qNum % 2 === 0);

        let codeSnippet = '';
        if (isCodeRequired) {
          if (lang === 'python') {
            codeSnippet = `# Python ${lvl.toUpperCase()} Context\ndef verify_${qNum}(data):\n    return [x for x in data if x]`;
          } else if (lang === 'javascript') {
            codeSnippet = `// JS ${lvl.toUpperCase()} Execution Context\nconst verify${qNum} = async (val) => {\n  return val ?? "default";\n};`;
          } else if (lang === 'java') {
            codeSnippet = `// Java ${lvl.toUpperCase()} Context\npublic class Test${qNum} {\n    public static void main(String[] args) {\n        System.out.println("${topicName}");\n    }\n}`;
          } else if (lang === 'c') {
            codeSnippet = `/* C ${lvl.toUpperCase()} Program */\n#include <stdio.h>\nint main() {\n    int val = ${qNum};\n    return 0;\n}`;
          } else if (lang === 'html') {
            codeSnippet = `<!-- HTML ${lvl.toUpperCase()} Snippet -->\n<div class="module-${qNum}">\n  <span>${topicName}</span>\n</div>`;
          }
        }

        const rawOptions = [
          `Standard implementation fulfilling ${topicName} specifications`,
          `Optimized runtime memory allocation pattern for ${topicName}`,
          `Legacy syntax deprecated in modern ${lang.toUpperCase()} standards`,
          `Invalid operation triggering runtime execution error`
        ];

        // Randomize options and compute new correct answer index
        const { options, answer } = shuffleOptionsAndGetAnswerIndex(rawOptions, 0);

        questionBank.push({
          language: lang,
          level: lvl,
          question: `In ${lang.toUpperCase()} (${lvl.toUpperCase()}), how does "${topicName}" operate in software architecture?`,
          code: codeSnippet,
          options,
          answer,
          explanation: `This question evaluates core mastery of ${topicName} within ${lang.toUpperCase()} ${lvl.toUpperCase()} curriculum.`
        });
      });
    });
  });

  return questionBank;
};

const seedDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is undefined. Check your backend/.env file.");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('🌱 Connected to MongoDB for Question Seeding...');

    await Question.deleteMany({});
    console.log('🧹 Existing question database cleared.');

    const all375Questions = generateAll375Questions();
    await Question.insertMany(all375Questions);
    console.log(`✅ Successfully seeded ALL ${all375Questions.length} questions with randomized option placement!`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Error Seeding Questions:', err);
    process.exit(1);
  }
};

seedDatabase();