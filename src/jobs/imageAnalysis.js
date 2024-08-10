const https = require('https');
const { HumanMessage } = require('@langchain/core/messages');
const { ChatOpenAI } = require('@langchain/openai');
const { z } = require('zod');
const base64 = require('base64-js');

// Fetch and encode the image as a base64 string
async function getImageData(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = [];

            response.on('data', (chunk) => data.push(chunk));
            response.on('end', () => {
                const buffer = Buffer.concat(data);
                const base64Image = base64.fromByteArray(new Uint8Array(buffer));
                console.log('Image successfully fetched and encoded.');
                resolve(base64Image);
            });

            response.on('error', (err) => {
                console.error('Error fetching image:', err);
                reject(err);
            });
        });
    });
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
    try {
        const model = new ChatOpenAI({
            temperature: 0,
            modelName: 'gpt-4',
            apiKey: process.env.OPENAI_API_KEY,
        });

        const modelWithOutput = model.withStructuredOutput(expenseSchema, {
            name: "Expense Bill Analyzer",
        });

        console.log('Fetching and encoding image...');
        const imageData = await getImageData(imageUrl);
        const imageBase64 = `data:image/jpeg;base64,${imageData}`;

        console.log('Preparing message for model invocation...');
        const message = new HumanMessage({
            content: 'Is this an applicable expense bill? If so, provide a title, category, and description for it.',
            additional_kwargs: { image_url: imageBase64 },
        });

        console.log('Invoking model...');
        const response = await modelWithOutput.invoke([message]);

        console.log('Model response received:', response);
        return response;
    } catch (error) {
        console.error('Error during image analysis:', error);
        throw error;
    }
}

module.exports = analyzeImage;
