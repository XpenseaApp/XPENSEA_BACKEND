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
    `Extract the desired information from the following passage.
    
    Only extract the properties mentioned in the 'Classification' function.
    
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

    
    // Commented out the `withStructuredOutput` as it might not be supported.
    // const modelWithOutput = model.withStructuredOutput(expenseSchema, {
        //     name: "Expense Bill Analyzer",
        // });
        
        const imageData = await getImageData(imageUrl);
        const llmWithStructuredOutput = model.withStructuredOutput(expenseSchema, {
            name: 'extractor',
        });
        const taggingChain = taggingPrompt.pipe(llmWithStructuredOutput);

    const message = new HumanMessage({
        content: `Is this an applicable expense bill? If so, provide a title, category, and description for it.`,
        metadata: {
            image: `data:image/jpeg;base64,${imageData}`,
        },
    });

    const input = `${input}` ;

    const response = await taggingChain.invoke({message});

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
