
const Tesseract = require('tesseract.js');
const Expense = require('../models/expenseModel');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { ChatOpenAI } = require('@langchain/openai');
const { z } = require('zod');


const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
  throw new Error('Missing OpenAI API key. Please set OPENAI_API_KEY in your .env file.');
}

const taggingPrompt = ChatPromptTemplate.fromTemplate(
  `Extract the desired information from the following passage.
  
  Only extract the properties mentioned in the 'Classification' function.
  
  Passage:
  {input}
  `
);

const classificationSchema = z.object({
  authenticity: z
    .number()
    .int()
    .min(0)
    .max(10)
    .describe("Evaluates the legitimacy of the bill. This score could be determined by checking for common signs of tampering, the presence of a recognizable vendor logo, date formatting, etc."),
  accuracy: z
    .number()
    .int()
    .min(0)
    .max(10)
    .describe("Measures how accurately the expense details match the company's reimbursement policy. This can include verifying amounts, dates, and the nature of the expense."),
  compliance: z
    .number()
    .int()
    .min(0)
    .max(10)
    .describe("Assesses how well the expense adheres to company policies and guidelines. Factors may include spending limits, approved vendors, and relevant categories."),
  completeness: z
    .number()
    .int()
    .min(0)
    .max(10)
    .describe("Ensures that all required information is present and correctly filled out on the bill. Missing information or illegible entries could lower this score."),
  relevance: z
    .number()
    .int()
    .min(0)
    .max(10)
    .describe("Evaluates how relevant the expense is to the employee's job function and current projects. Non-relevant expenses might score lower."),
});

// LLM
const llm = new ChatOpenAI({
  temperature: 0,
  model: 'gpt-3.5-turbo-0125',
  apiKey: openaiApiKey
});

const llmWithStructuredOutput = llm.withStructuredOutput(classificationSchema, {
  name: 'extractor',
});

const taggingChain = taggingPrompt.pipe(llmWithStructuredOutput);

async function createWorker() {
  const worker = await Tesseract.createWorker();
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  return worker;
}

async function getExpenseWithoutAIScore(id) {
  return await Expense.findOne({ _id: id, aiScore: { $exists: false } });
}

async function runOCR(id) {
  try {
    const expense = await getExpenseWithoutAIScore(id);
    if (!expense) {
      console.log('No expense without AI score found for the given ID.');
      return;
    }

    if (!expense.image) {
      console.log('Expense does not have an image.');
      return;
    }

    const worker = await createWorker();

    try {
      console.log('Starting OCR for expense:', expense._id);
      const { data: { text } } = await worker.recognize(expense.image);
      console.log('Recognition result for expense', expense._id, ':', text);

      const input = `This is a reimbursement expense. The name of the expense is ${expense.title}, the amount is ${expense.amount}, the date is ${expense.date}, the time is ${expense.time}, the category is ${expense.category}, the description is ${expense.description}, and the data in the image is ${text}. Based on the data in the image find the scores for authenticity, accuracy, compliance, completeness, and relevance of the expense. If the data in the image does not represent any type of bill then the scores should be 0.`;

      const classificationResult = await taggingChain.invoke({ input });

      // Update the expense with the classification result
      expense.aiScores = classificationResult;
      await expense.save();

      console.log('Processed values', classificationResult);
    } catch (err) {
      console.error('Error processing expense', expense._id, ':', err);
    }

    await worker.terminate();
  } catch (err) {
    console.error('Error in runOCR function:', err);
  }
}
//test
module.exports = runOCR;
