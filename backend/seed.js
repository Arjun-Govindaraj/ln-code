const mongoose = require('mongoose');
require('dotenv').config();
const Question = require('./models/Question');

const languages = ['python', 'javascript', 'html', 'java', 'c'];
const levels = ['beginner', 'intermediate', 'veteran'];

// Templates to generate 25 unique, valid questions per category level
const generateQuestions = () => {
  const allQuestions = [];

  languages.forEach((lang) => {
    levels.forEach((lvl) => {
      for (let i = 1; i <= 25; i++) {
        let questionText = "";
        let codeSnippet = "";
        let optionsList = [];
        let correctAns = 0;
        let explanationText = "";

        // Customize output per language & difficulty level
        if (lang === 'python') {
          if (lvl === 'beginner') {
            questionText = `[Python Beginner Q${i}] What is the output of evaluation #${i}?`;
            codeSnippet = `x = ${i}\ny = ${i * 2}\nprint(x + y)`;
            optionsList = [`${i}`, `${i * 3}`, `${i * 2}`, `Error`];
            correctAns = 1;
            explanationText = `The addition operator calculates ${i} + ${i * 2} which equals ${i * 3}.`;
          } else if (lvl === 'intermediate') {
            questionText = `[Python Intermediate Q${i}] What does this list comprehension yield?`;
            codeSnippet = `nums = [i for i in range(${i})]\nprint(len(nums))`;
            optionsList = [`${i - 1}`, `${i}`, `${i + 1}`, `0`];
            correctAns = 1;
            explanationText = `range(${i}) generates elements from 0 to ${i - 1}, resulting in a list of length ${i}.`;
          } else {
            questionText = `[Python Veteran Q${i}] What will be logged regarding scope variable #${i}?`;
            codeSnippet = `def func(val=${i}):\n    return val * 2\nprint(func())`;
            optionsList = [`${i}`, `${i * 2}`, `None`, `SyntaxError`];
            correctAns = 1;
            explanationText = `Default parameter retains value ${i}, which multiplies by 2 to equal ${i * 2}.`;
          }
        } else if (lang === 'javascript') {
          if (lvl === 'beginner') {
            questionText = `[JS Beginner Q${i}] What is the evaluated type of item #${i}?`;
            codeSnippet = `console.log(typeof ${i});`;
            optionsList = ["'string'", "'number'", "'boolean'", "'object'"];
            correctAns = 1;
            explanationText = `Numeric values return type 'number' in JavaScript.`;
          } else if (lvl === 'intermediate') {
            questionText = `[JS Intermediate Q${i}] What does this array map method return?`;
            codeSnippet = `const arr = [${i}, ${i + 1}];\nconsole.log(arr.map(x => x * 2));`;
            optionsList = [`[${i * 2}, ${(i + 1) * 2}]`, `[${i}, ${i + 1}]`, `[${i * 2}]`, `NaN`];
            correctAns = 0;
            explanationText = `The map function multiplies each element by 2 individually.`;
          } else {
            questionText = `[JS Veteran Q${i}] How does closure behave with loop counter #${i}?`;
            codeSnippet = `for (let k = 0; k < ${i}; k++) {}\nconsole.log(typeof k);`;
            optionsList = ["'number'", "'undefined'", "'object'", "ReferenceError"];
            correctAns = 3;
            explanationText = `let variables are block-scoped and cannot be accessed outside the for-loop block.`;
          }
        } else if (lang === 'html') {
          if (lvl === 'beginner') {
            questionText = `[HTML Beginner Q${i}] Which tag correctly represents section header #${i}?`;
            codeSnippet = `<h${(i % 6) + 1}>Heading Level ${(i % 6) + 1}</h${(i % 6) + 1}>`;
            optionsList = [`<h${(i % 6) + 1}>`, `<head>`, `<header>`, `<heading>`];
            correctAns = 0;
            explanationText = `HTML heading elements range from <h1> (highest) to <h6> (lowest importance).`;
          } else if (lvl === 'intermediate') {
            questionText = `[HTML Intermediate Q${i}] What is the standard purpose of attribute type #${i}?`;
            codeSnippet = `<input type="number" min="1" max="${i}">`;
            optionsList = ["Restricts input to numbers", "Creates a checkbox", "Submits form data", "Renders dropdown"];
            correctAns = 0;
            explanationText = `type='number' restricts input strictly to numeric values within min/max bounds.`;
          } else {
            questionText = `[HTML Veteran Q${i}] Which accessibility attribute is required for custom component #${i}?`;
            codeSnippet = `<div role="button" tabindex="${i > 10 ? 0 : -1}">Click</div>`;
            optionsList = ["tabindex", "aria-label", "src", "href"];
            correctAns = 0;
            explanationText = `tabindex controls keyboard focus navigation order for non-interactive elements.`;
          }
        } else if (lang === 'java') {
          if (lvl === 'beginner') {
            questionText = `[Java Beginner Q${i}] What is the printed integer result of operation #${i}?`;
            codeSnippet = `int a = ${i * 10};\nint b = 10;\nSystem.out.println(a / b);`;
            optionsList = [`${i}`, `${i * 10}`, `0`, `Error`];
            correctAns = 0;
            explanationText = `Integer division of ${i * 10} by 10 yields ${i}.`;
          } else if (lvl === 'intermediate') {
            questionText = `[Java Intermediate Q${i}] What is the size of array allocation #${i}?`;
            codeSnippet = `int[] arr = new int[${i}];\nSystem.out.println(arr.length);`;
            optionsList = [`${i - 1}`, `${i}`, `${i + 1}`, `0`];
            correctAns = 1;
            explanationText = `The .length property returns the total capacity specified during array instantiation.`;
          } else {
            questionText = `[Java Veteran Q${i}] What happens when casting object instance #${i}?`;
            codeSnippet = `Object obj = "${i}";\nString str = (String) obj;\nSystem.out.println(str);`;
            optionsList = [`"${i}"`, `ClassCastException`, `null`, `0`];
            correctAns = 0;
            explanationText = `Since the underlying instance is a String, explicit downcasting completes safely.`;
          }
        } else if (lang === 'c') {
          if (lvl === 'beginner') {
            questionText = `[C Beginner Q${i}] What is the value printed by format specifier #${i}?`;
            codeSnippet = `int x = ${i};\nprintf("%d", x);`;
            optionsList = [`${i}`, `%d`, `x`, `Garbage Value`];
            correctAns = 0;
            explanationText = `%d specifier correctly prints the integer value stored in x.`;
          } else if (lvl === 'intermediate') {
            questionText = `[C Intermediate Q${i}] What value is stored at pointer target #${i}?`;
            codeSnippet = `int num = ${i};\nint *p = &num;\nprintf("%d", *p);`;
            optionsList = [`Memory Address`, `${i}`, `0`, `NULL`];
            correctAns = 1;
            explanationText = `Dereferencing *p retrieves the value stored at address &num.`;
          } else {
            questionText = `[C Veteran Q${i}] What is allocated by memory routine #${i}?`;
            codeSnippet = `int *ptr = (int*) malloc(${i} * sizeof(int));`;
            optionsList = [
              `Allocates memory for ${i} integers`,
              `Frees memory`,
              `Causes Stack Overflow`,
              `Initializes elements to zero`
            ];
            correctAns = 0;
            explanationText = `malloc dynamically allocates continuous byte block equivalent to ${i} integer sizes.`;
          }
        }

        allQuestions.push({
          language: lang,
          level: lvl,
          question: questionText,
          code: codeSnippet,
          options: optionsList,
          answer: correctAns,
          explanation: explanationText
        });
      }
    });
  });

  return allQuestions;
};

// Seed script execution
async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
    
    // Clear old data
    await Question.deleteMany({});
    console.log("Cleared existing questions.");

    // Generate and insert 375 questions (5 languages * 3 levels * 25 questions)
    const dataset = generateQuestions();
    await Question.insertMany(dataset);
    
    console.log(`Successfully seeded ${dataset.length} questions (25 per level across all languages)!`);
    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
}

seedDatabase();