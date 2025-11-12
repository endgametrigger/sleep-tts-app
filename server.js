// ============================
// IMPORT REQUIRED PACKAGES
// ============================

// Express is a web framework that helps us create a web server easily
const express = require('express');

// Axios is a library that helps us make HTTP requests to external APIs (like OpenAI)
const axios = require('axios');

// CORS (Cross-Origin Resource Sharing) allows our frontend to talk to our backend
const cors = require('cors');

// Dotenv loads environment variables from .env file (keeps our API key secret)
require('dotenv').config();

// ============================
// CREATE EXPRESS APP
// ============================

// Create an instance of an Express application
const app = express();

// Define which port our server will listen on (3000 is a common choice for local development)
const PORT = process.env.PORT || 3000;

// ============================
// MIDDLEWARE SETUP
// ============================

// Enable CORS so our frontend (HTML/JS) can communicate with this backend server
app.use(cors());

// Enable Express to parse JSON data from incoming requests
app.use(express.json({ limit: '50mb' })); // 50mb limit to handle larger text inputs

// Serve static files (HTML, CSS, JS) from the current directory
// This means when someone visits http://localhost:3000, they'll see index.html
app.use(express.static('.'));

// ============================
// API ENDPOINT FOR TEXT-TO-SPEECH
// ============================

// POST endpoint at /api/generate-speech
// This is where our frontend will send text to be converted to speech
app.post('/api/generate-speech', async (req, res) => {
  try {
    // Extract the text and voice from the request body that was sent from the frontend
    const { text, voice } = req.body;

    // Validation: Make sure text was actually provided
    if (!text) {
      return res.status(400).json({
        error: 'No text provided. Please enter some text to convert to speech.'
      });
    }

    // Validation: Check if the text is too long (OpenAI has limits)
    if (text.length > 4096) {
      return res.status(400).json({
        error: 'Text is too long. Please keep it under 4096 characters.'
      });
    }

    // Define the list of valid OpenAI TTS voices
    // These are the three most soothing voices for relaxation
    const validVoices = ['shimmer', 'alloy', 'nova'];

    // Get the voice from the request, or default to 'shimmer' if not provided
    let selectedVoice = voice || 'shimmer';

    // Validation: Make sure the voice is one of the allowed voices
    // This prevents users from sending invalid voice names to OpenAI
    if (!validVoices.includes(selectedVoice)) {
      console.warn(`Invalid voice "${selectedVoice}" requested, defaulting to shimmer`);
      selectedVoice = 'shimmer'; // Fall back to default voice
    }

    // Get the API key from environment variables (loaded from .env file)
    const apiKey = process.env.OPENAI_API_KEY;

    // Check if API key exists
    if (!apiKey) {
      console.error('ERROR: OPENAI_API_KEY not found in .env file');
      return res.status(500).json({
        error: 'Server configuration error. API key is missing.'
      });
    }

    console.log(`Generating speech for ${text.length} characters using "${selectedVoice}" voice...`);

    // Make a request to OpenAI's Text-to-Speech API
    const response = await axios.post(
      'https://api.openai.com/v1/audio/speech', // OpenAI TTS endpoint
      {
        model: 'tts-1',           // Use tts-1 model (faster and cheaper than tts-1-hd)
        input: text,               // The text to convert to speech
        voice: selectedVoice,      // Use the voice selected by the user (shimmer, alloy, or nova)
        response_format: 'mp3'     // Get audio back as MP3 file
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,  // Authenticate with OpenAI using API key
          'Content-Type': 'application/json'     // Tell OpenAI we're sending JSON data
        },
        responseType: 'arraybuffer'  // Important: Get binary audio data, not text
      }
    );

    // Calculate the cost (OpenAI charges $0.015 per 1,000 characters for tts-1)
    const characterCount = text.length;
    const estimatedCost = (characterCount / 1000) * 0.015;
    console.log(`Speech generated successfully! Cost: $${estimatedCost.toFixed(4)}`);

    // Convert the audio data to base64 format (easier to send to frontend)
    const audioBase64 = Buffer.from(response.data).toString('base64');

    // Send the audio data back to the frontend as JSON
    res.json({
      success: true,
      audio: audioBase64,           // The audio file in base64 format
      characterCount: characterCount, // How many characters were processed
      estimatedCost: estimatedCost   // Estimated cost for this request
    });

  } catch (error) {
    // Error handling: If something goes wrong, log it and send error message to frontend
    console.error('Error generating speech:', error.response?.data || error.message);

    // Check if it's an OpenAI API error
    if (error.response?.status === 401) {
      return res.status(401).json({
        error: 'Invalid API key. Please check your OPENAI_API_KEY in .env file.'
      });
    } else if (error.response?.status === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Please wait a moment and try again.'
      });
    } else {
      return res.status(500).json({
        error: 'Failed to generate speech. Please try again.'
      });
    }
  }
});

// ============================
// HEALTH CHECK ENDPOINT
// ============================

// Simple endpoint to check if the server is running
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Sleep TTS App server is running!',
    timestamp: new Date().toISOString()
  });
});

// ============================
// START THE SERVER
// ============================

// Start listening for requests on the specified port
app.listen(PORT, () => {
  console.log('====================================');
  console.log(`🌙 Sleep TTS App is running!`);
  console.log(`📡 Server: http://localhost:${PORT}`);
  console.log(`🔑 API Key loaded: ${process.env.OPENAI_API_KEY ? 'Yes ✓' : 'No ✗'}`);
  console.log('====================================');
  console.log('Open your browser and go to http://localhost:3000');
  console.log('Press Ctrl+C to stop the server');
  console.log('====================================');
});
