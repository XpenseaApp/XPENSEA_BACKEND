const { ChatOpenAI } = require('@langchain/openai');
const { HumanMessage } = require('@langchain/core/messages');

// Initialize OpenAI client for GPT-4
const openAIModel = new ChatOpenAI({
  model: 'gpt-4',  // Use GPT-4 or any other suitable model
  apiKey: process.env.OPENAI_API_KEY,  // API Key should be set in environment variables
});

// Function to analyze the image
async function analyzeImage(imageUrl) {
  // Create a message with text and image URL for analysis
  const message = new HumanMessage({
    content: [
      {
        type: 'text',
        text: 'Analyze the provided image and extract the following information: \n1. "isExpenseBill": true or false - Whether the image is an applicable expense bill.\n2. "title": (string, optional) - Title for the expense bill.\n3. "category": (string, optional) - Category for the expense bill.\n4. "description": (string, optional) - Description of the expense bill.',
      },
      {
        type: 'image_url',
        image_url: { url: imageUrl },  // Image URL passed here
      },
    ],
  });

  try {
    const response = await openAIModel.invoke([message]);
    console.log('Analysis Result:', response.content);  // Log the response content
    return response.content;  // Return the analysis result
  } catch (error) {
    console.error('Error analyzing image with GPT-4:', error);
    throw error;  // Propagate the error
  }
}

// Export the function as a module
module.exports = { analyzeImage };
