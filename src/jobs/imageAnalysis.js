const { HumanMessage } = require('langchain_core/messages');
const { ChatOpenAI } = require('langchain_openai');
const { z } = require('zod');
const httpx = require('httpx');
const base64 = require('base64-js');

// Fetch and encode the image
async function getImageData(url) {
    const response = await httpx.get(url, { responseType: 'arraybuffer' });
    return base64.fromByteArray(new Uint8Array(response.data));
}

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
        model: 'gpt-4o',
        apiKey: process.env.OPENAI_API_KEY,  // Ensure the API key is set in the environment variables
    });

    const modelWithOutput = model.withStructuredOutput(expenseSchema, {
        name: "Expense Bill Analyzer",
    });

    const imageData = await getImageData(imageUrl);

    const message = new HumanMessage({
        content: [
            { type: 'text', text: 'Is this an applicable expense bill? If so, provide a title, category, and description for it.' },
            {
                type: 'image_url',
                image_url: `data:image/jpeg;base64,${imageData}`,
            },
        ],
    });

    const response = await modelWithOutput.invoke([message]);

    // Output the structured JSON response
    console.log(response);
    return response;
}

module.exports = analyzeImage;