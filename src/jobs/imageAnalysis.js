const axios = require('axios');
const { OpenAI } = require('openai');  // Import OpenAI class

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,  // Make sure API key is set in your environment variables
});

// Function to download image from URL and analyze it using GPT-4V
async function analyzeImage(imageUrl) {
    try {
        // Download the image from the URL
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageData = Buffer.from(response.data, 'binary');

        // Call OpenAI GPT-4V (Vision model)
        const apiResponse = await openai.chat.completions.create({
            model: 'gpt-4-vision',
            messages: [
                {
                    role: 'system',
                    content: `You are a helpful assistant that analyzes expense bill images.`,
                },
                {
                    role: 'user',
                    content: `Analyze the provided image and extract the following information:
                    
                    1. "isExpenseBill": true or false - Whether the image is an applicable expense bill.
                    2. "title": (string, optional) - Title for the expense bill.
                    3. "category": (string, optional) - Category for the expense bill.
                    4. "description": (string, optional) - Description of the expense bill.
                    `,
                },
            ],
            file: imageData,  // Attach the downloaded image data
        });

        // Handle the response from GPT-4V
        const analysisResult = apiResponse.choices[0].message.content;
        console.log('Analysis Result:', analysisResult);
        return analysisResult;
    } catch (error) {
        console.error('Error analyzing image with GPT-4V:', error);
    }
}

module.exports = analyzeImage;
