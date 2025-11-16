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
// ELEVENLABS VOICE ID MAPPINGS (CREATOR PLAN)
// ============================

// ElevenLabs uses unique voice IDs instead of simple names
// These are the voice IDs for the most soothing/relaxing voices
// Creator Plan includes access to more premium voices
const elevenLabsVoiceIds = {
  'rachel': '21m00Tcm4TlvDq8ikWAM',  // Calm, clear, American female
  'domi': 'AZnzlk1XvdvUeBnXmlld',    // Confident, strong female
  'bella': 'EXAVITQu4vr4xnSDxMaL',   // Soft, gentle, young female
  'lily': 'pFZP5JQG7iQjIQuC4Bku',    // British, gentle female
  'charlotte': 'XB0fDUnXU5powFXDhCwa', // Swedish, calm female
  'antoni': 'ErXwobaYiN019PkySvjV',  // Well-rounded, male
  'callum': 'N2lVS1w4EtoT3dr4eOWO',  // British, smooth male
  'arnold': 'VR6AewLTigWG4xSOukaG'   // Crisp, American male
};

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
    // Extract the text, voice, and provider from the request body
    const { text, voice, provider } = req.body;

    // Validation: Make sure text was actually provided
    if (!text) {
      return res.status(400).json({
        error: 'No text provided. Please enter some text to convert to speech.'
      });
    }

    // Validation: Check if the text is too long (increased to 25,000 characters for Creator plan)
    if (text.length > 25000) {
      return res.status(400).json({
        error: 'Text is too long. Please keep it under 25,000 characters.'
      });
    }

    // Validation: Make sure provider is specified and valid
    const validProviders = ['openai', 'elevenlabs'];
    const selectedProvider = provider || 'openai'; // Default to OpenAI

    if (!validProviders.includes(selectedProvider)) {
      return res.status(400).json({
        error: 'Invalid provider. Must be either "openai" or "elevenlabs".'
      });
    }

    // Route to the appropriate TTS provider
    if (selectedProvider === 'openai') {
      // ============================
      // OPENAI TTS PROCESSING
      // ============================

      // Define the list of valid OpenAI TTS voices
      const validOpenAIVoices = ['shimmer', 'alloy', 'nova'];

      // Get the voice from the request, or default to 'shimmer'
      let selectedVoice = voice || 'shimmer';

      // Validation: Make sure the voice is one of the allowed voices
      if (!validOpenAIVoices.includes(selectedVoice)) {
        console.warn(`Invalid OpenAI voice "${selectedVoice}" requested, defaulting to shimmer`);
        selectedVoice = 'shimmer';
      }

      // Get the OpenAI API key from environment variables
      const apiKey = process.env.OPENAI_API_KEY;

      if (!apiKey) {
        console.error('ERROR: OPENAI_API_KEY not found in .env file');
        return res.status(500).json({
          error: 'OpenAI API key is missing. Please add OPENAI_API_KEY to your .env file.'
        });
      }

      console.log(`[OpenAI] Generating speech for ${text.length} characters using "${selectedVoice}" voice...`);

      // Make a request to OpenAI's Text-to-Speech API
      const response = await axios.post(
        'https://api.openai.com/v1/audio/speech',
        {
          model: 'tts-1',           // Use tts-1 model (faster and cheaper)
          input: text,               // The text to convert to speech
          voice: selectedVoice,      // The voice selected by the user
          response_format: 'mp3'     // Get audio back as MP3 file
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'  // Get binary audio data
        }
      );

      // Calculate the cost (OpenAI charges $0.015 per 1,000 characters)
      const characterCount = text.length;
      const estimatedCost = (characterCount / 1000) * 0.015;
      console.log(`[OpenAI] Speech generated successfully! Cost: $${estimatedCost.toFixed(4)}`);

      // Convert the audio data to base64 format
      const audioBase64 = Buffer.from(response.data).toString('base64');

      // Send the audio data back to the frontend
      res.json({
        success: true,
        audio: audioBase64,
        characterCount: characterCount,
        estimatedCost: estimatedCost,
        provider: 'openai'
      });

    } else if (selectedProvider === 'elevenlabs') {
      // ============================
      // ELEVENLABS TTS PROCESSING (CREATOR PLAN)
      // ============================

      // Get the voice from the request, or default to 'rachel'
      let selectedVoice = voice || 'rachel';

      // Validation: Make sure the voice is one of the allowed ElevenLabs voices
      const validElevenLabsVoices = Object.keys(elevenLabsVoiceIds);

      if (!validElevenLabsVoices.includes(selectedVoice)) {
        console.warn(`Invalid ElevenLabs voice "${selectedVoice}" requested, defaulting to rachel`);
        selectedVoice = 'rachel';
      }

      // Get the voice ID from the mapping
      const voiceId = elevenLabsVoiceIds[selectedVoice];

      // Get the ElevenLabs API key from environment variables
      const apiKey = process.env.ELEVENLABS_API_KEY;

      if (!apiKey) {
        console.error('ERROR: ELEVENLABS_API_KEY not found in .env file');
        return res.status(500).json({
          error: 'ElevenLabs API key is missing. Please add ELEVENLABS_API_KEY to your .env file.'
        });
      }

      // Extract advanced voice settings from request (Creator Plan features)
      // These settings control the quality and style of the generated voice
      const { stability, similarity_boost, style } = req.body;

      // Use provided values or sensible defaults for sleep/relaxation content
      const voiceSettings = {
        stability: stability !== undefined ? stability : 0.5,           // Voice consistency (0-1)
        similarity_boost: similarity_boost !== undefined ? similarity_boost : 0.75, // Voice clarity (0-1)
        style: style !== undefined ? style : 0.0                        // Expressiveness (0-1, keep low for sleep)
      };

      console.log(`[ElevenLabs Creator] Generating speech for ${text.length} characters using "${selectedVoice}" voice (ID: ${voiceId})...`);
      console.log(`[ElevenLabs Creator] Settings - Stability: ${voiceSettings.stability}, Similarity: ${voiceSettings.similarity_boost}, Style: ${voiceSettings.style}`);

      // Make a request to ElevenLabs Text-to-Speech API
      // Note: ElevenLabs API is different from OpenAI - voice ID goes in the URL
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          text: text,                           // The text to convert to speech
          model_id: 'eleven_monolingual_v1',   // Use the standard English model
          voice_settings: voiceSettings         // Use the advanced settings from the frontend
        },
        {
          headers: {
            'xi-api-key': apiKey,               // ElevenLabs uses 'xi-api-key' header
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'           // Get binary audio data
        }
      );

      const characterCount = text.length;
      console.log(`[ElevenLabs Creator] Speech generated successfully! Characters used: ${characterCount} / 100,000 monthly limit`);

      // Convert the audio data to base64 format
      const audioBase64 = Buffer.from(response.data).toString('base64');

      // Send the audio data back to the frontend
      // Note: Creator Plan has 100,000 chars/month
      res.json({
        success: true,
        audio: audioBase64,
        characterCount: characterCount,
        estimatedCost: 0,  // Creator Plan (included in subscription)
        provider: 'elevenlabs'
      });
    }

  } catch (error) {
    // Error handling: If something goes wrong, log it and send error message to frontend
    console.error('Error generating speech:', error.response?.data || error.message);

    // Check for API-specific errors
    if (error.response?.status === 401) {
      return res.status(401).json({
        error: 'Invalid API key. Please check your API key in the .env file.'
      });
    } else if (error.response?.status === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Please wait a moment and try again.'
      });
    } else if (error.response?.status === 403) {
      return res.status(403).json({
        error: 'Access forbidden. Check your API key permissions or subscription status.'
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
  console.log(`🔑 OpenAI API Key: ${process.env.OPENAI_API_KEY ? 'Loaded ✓' : 'Missing ✗'}`);
  console.log(`🔑 ElevenLabs API Key: ${process.env.ELEVENLABS_API_KEY ? 'Loaded ✓' : 'Missing ✗'}`);
  console.log('====================================');
  console.log('Open your browser and go to http://localhost:3000');
  console.log('Press Ctrl+C to stop the server');
  console.log('====================================');
});
