const axios = require('axios');
const { HumanMessage } = require('@langchain/core/messages');
const { ChatOpenAI } = require('@langchain/openai');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { z } = require('zod');

// Fetch the image data as a URL or binary buffer
async function getImageData(url) {
    console.log("Fetching image data from URL:", url);
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    console.log("Image data successfully fetched.");
    return response.data; // Return binary data instead of base64
}

const taggingPrompt = ChatPromptTemplate.fromTemplate(
    `Analyze the provided image and extract the following information:
    
    1. "isExpenseBill": true or false - Whether the image is an applicable expense bill.
    2. "title": (string, optional) - Title for the expense bill.
    3. "category": (string, optional) - Category for the expense bill.
    4. "description": (string, optional) - Description of the expense bill.
    Image and additional details:
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
    console.log("Starting analysis of image:", imageUrl);

    const model = new ChatOpenAI({
        temperature: 0,
        modelName: 'gpt-4',
        apiKey: process.env.OPENAI_API_KEY,  // Ensure the API key is set in the environment variables
    });

    try {
        const imageData = await getImageData(imageUrl);
        console.log("Image data prepared for analysis.");

        // Consider storing the image to a temporary storage and passing the URL instead
        // For example:
        // const temporaryImageUrl = await uploadImageToTemporaryStorage(imageData);

        const inputContent = `The image URL is: ${imageUrl}. Please analyze the image accordingly.`;
        console.log("Input content for LLM prepared:", inputContent);

        const llmWithStructuredOutput = model.withStructuredOutput(expenseSchema, {
            name: 'extractor',
        });

        const taggingChain = taggingPrompt.pipe(llmWithStructuredOutput);

        const response = await taggingChain.invoke({ input: inputContent });
        console.log("Response from LLM received:", response);

        // Validate the response using the Zod schema


        // Output the structured JSON response
        console.log("Validated response data:", response);
        return response;
    } catch (error) {
        console.error("Error during image analysis:", error);
    }
}

module.exports = analyzeImage;