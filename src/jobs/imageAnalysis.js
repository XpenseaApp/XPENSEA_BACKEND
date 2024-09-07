const { ChatOpenAI } = require('@langchain/openai');
const { HumanMessage } = require('@langchain/core/messages');
const axios = require('axios');

let llm;

// Function to analyze image using GPT-4 Vision model
async function analyzeImage ( imageURL, extraDetails = '') {
  let imageSummary = '';
  openAIApiKey = process.env.OPENAI_API_KEY;

  try {
    // Initialize OpenAI client if not already initialized
    if (!llm) {
      llm = new ChatOpenAI({
        openAIApiKey,
        modelName: 'gpt-4o',
        maxTokens: 1024,
      });
    }

    // Fetch the image and convert it to base64
    const response = await axios.get(imageURL, { responseType: 'arraybuffer' });
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');

    // Construct the multimodal message (text + image)
    const text = `Below is the image for reference. Please provide a comprehensive analysis of the contents of the image.\n${extraDetails}`;

    const imagePromptMessage = new HumanMessage({
      content: [
        {
          type: 'text',
          text,
        },
        {
          type: 'image_url',
          image_url: {
            url: `data:image/jpeg;base64,${base64Image}`,
            detail: 'high', // 'low' or 'high' for desired detail
          },
        },
      ],
    });

    // Invoke the GPT-4 Vision model
    const responseLLM = await llm.invoke([imagePromptMessage]);
    if (responseLLM?.content) {
      imageSummary = responseLLM.content;
    }
  } catch (error) {
    console.error('Error analyzing image:', error);
  }

  return imageSummary;
};

// Exporting the function
module.exports = { analyzeImage };
