const axios = require('axios');
const { HumanMessage } = require('@langchain/core/messages');
const { ChatOpenAI } = require('@langchain/openai');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { z } = require('zod');
const base64 = require('base64-js');

// Fetch and encode the image
async function getImageData(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return base64.fromByteArray(new Uint8Array(response.data));
}

const taggingPrompt = ChatPromptTemplate.fromTemplate(
    `Analyze the provided passage and image. Extract and return the following information:
    
    1. "isExpenseBill": true or false - Whether the image is an applicable expense bill.
    2. "title": (string, optional) - Title for the expense bill.
    3. "category": (string, optional) - Category for the expense bill.
    4. "description": (string, optional) - Description of the expense bill.

    Passage:
    {input}
    `
);

// Define the Zod schema for structured output
const expenseSchema = z.object({
    isExpenseBill: z.boolean().describe("Whether the image is an applicable expense bill"),
    title: z.string().optional().describe("Title for the expense bill"),
    category: z.string().optional().describe("Category for the expense bill"),
    description: z.string().optional().describe("Description of the expense bill"),
});

// Analyze the image using GPT-4 via LangChain
async function analyzeImage(imageUrl) {
    const model = new ChatOpenAI({
        temperature: 0,
        modelName: 'gpt-4',
        apiKey: process.env.OPENAI_API_KEY,  // Ensure the API key is set in the environment variables
    });

    const imageData = await getImageData(imageUrl);
    const llmWithStructuredOutput = model.withStructuredOutput(expenseSchema, {
        name: 'extractor',
    });

    const taggingChain = taggingPrompt.pipe(llmWithStructuredOutput);

    // The content of the input to the LLM
    const inputContent = `This is the image data: data:image/jpeg;base64,${imageData}.`;

    const response = await taggingChain.invoke({ input: inputContent });

    // Validate the response using the Zod schema
    if (!response.success) {
        console.error("Response validation failed:", response.error);
        return;
    }

    // Output the structured JSON response
    console.log(response.data);
    return response.data;
}

module.exports = analyzeImage;
