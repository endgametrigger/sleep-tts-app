# 🌙 Sleep TTS App

A simple, beginner-friendly text-to-speech web application using OpenAI's TTS API for creating soothing bedtime audio. Perfect for listening to bedtime stories, articles, or meditation scripts.

## Features

- **Dual TTS Provider Support** - Choose between OpenAI and ElevenLabs for text-to-speech
- **Multiple Soothing Voices** - 3 OpenAI voices + 5 ElevenLabs voices optimized for relaxation
- **Clean, Minimalist Interface** - Calming dark blue/purple color scheme designed for relaxation
- **Adjustable Playback Speed** - Control speed from 0.75x (slower) to 1.25x (faster)
- **Real-time Cost Estimation** - See estimated cost before generating audio
- **Extended Character Limit** - Convert up to 10,000 characters at once
- **Mobile Responsive** - Works great on phones, tablets, and desktops
- **Beginner-Friendly Code** - Extensively commented code to help you learn

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (vanilla - no frameworks)
- **Backend:** Node.js with Express
- **API:** OpenAI Text-to-Speech API
- **Dependencies:** express, dotenv, cors, axios

## Prerequisites

Before you begin, make sure you have:

1. **Node.js** installed (version 14 or higher)
   - Download from: https://nodejs.org/
   - Check if installed: `node --version`

2. **API Keys** (you can choose one or both providers):

   **OpenAI API Key** (Optional)
   - Get one at: https://platform.openai.com/api-keys
   - Make sure you have credits in your OpenAI account
   - Cost: $0.015 per 1,000 characters

   **ElevenLabs API Key** (Optional)
   - Get one at: https://elevenlabs.io/
   - Sign up for a free account
   - Free tier: 10,000 characters per month
   - Go to your profile settings to find your API key

## Setup Instructions

### Step 1: Install Dependencies

First, install all the required Node.js packages:

```bash
npm install
```

This will install:
- `express` - Web server framework
- `dotenv` - For loading environment variables from .env file
- `cors` - Allows frontend to communicate with backend
- `axios` - For making HTTP requests to OpenAI API

### Step 2: Configure Your API Keys

You need at least one API key to use the app. You can use OpenAI, ElevenLabs, or both.

Create a `.env` file in the project root (if it doesn't exist) and add your API keys:

```
# OpenAI API Key (required for OpenAI TTS)
OPENAI_API_KEY=your-openai-api-key-here

# ElevenLabs API Key (required for ElevenLabs TTS)
ELEVENLABS_API_KEY=your-elevenlabs-api-key-here
```

**Note:** You can use one or both services. If you only want to use OpenAI, just add the OpenAI key. If you only want to use ElevenLabs (free tier), just add the ElevenLabs key.

**IMPORTANT:** Never commit your `.env` file to version control! It's already in `.gitignore` for safety.

### Step 3: Start the Server

Run the server with:

```bash
npm start
```

You should see:
```
====================================
🌙 Sleep TTS App is running!
📡 Server: http://localhost:3000
🔑 OpenAI API Key: Loaded ✓
🔑 ElevenLabs API Key: Loaded ✓
====================================
Open your browser and go to http://localhost:3000
Press Ctrl+C to stop the server
====================================
```

### Step 4: Access the App

Open your web browser and go to:

```
http://localhost:3000
```

You should see the Sleep TTS App interface!

## How to Use

1. **Paste Your Text** - Copy any text you want to listen to (stories, articles, meditation scripts) and paste it into the textarea (up to 10,000 characters)

2. **Choose Your TTS Provider** - Select between OpenAI or ElevenLabs

3. **Select a Voice** - Pick from the available voices for your chosen provider

4. **Check the Cost** - The app will show you the estimated cost in real-time as you type

5. **Generate Audio** - Click the "Generate Audio" button and wait a few seconds

6. **Listen & Relax** - Use the audio player controls to play, pause, and adjust the speed

7. **Adjust Speed** - Use the slider to slow down (0.75x) or speed up (1.25x) the playback

## Available Voices

### OpenAI Voices
- **Shimmer** - Soft, warm, feminine
- **Alloy** - Neutral, calm, balanced
- **Nova** - Friendly, gentle, feminine

### ElevenLabs Voices
- **Rachel** - Calm, clear, American female
- **Domi** - Confident, strong female
- **Bella** - Soft, gentle, young female
- **Antoni** - Well-rounded, male
- **Arnold** - Crisp, American male

## Cost Breakdown

### OpenAI Pricing
OpenAI charges **$0.015 per 1,000 characters** for the `tts-1` model:

- 100 characters: $0.0015 (less than a penny)
- 1,000 characters: $0.015 (1.5 cents)
- 10,000 characters: $0.15 (15 cents)

**Example:** A typical bedtime story (2,000 characters) costs about $0.03 (3 cents)

### ElevenLabs Pricing
ElevenLabs offers a **free tier** with generous limits:

- **Free Tier:** 10,000 characters per month (FREE)
- **Paid Plans:** Available for higher usage starting at $5/month

**Recommendation:** Start with ElevenLabs free tier for testing, then use OpenAI for higher volume needs.

## File Structure

```
sleep-tts-app/
├── .env              # Your API key (DO NOT COMMIT!)
├── .gitignore        # Files to ignore in git
├── package.json      # Project dependencies
├── server.js         # Backend Express server
├── index.html        # Frontend HTML structure
├── style.css         # Styling and design
├── script.js         # Frontend JavaScript logic
└── README.md         # This file
```

## Troubleshooting

### "API key is missing" error
- Make sure your `.env` file exists in the project root
- Add the appropriate API key: `OPENAI_API_KEY` or `ELEVENLABS_API_KEY`
- Restart the server after adding API keys

### "Invalid API key" error
- Check that your API key is copied correctly (no extra spaces)
- For OpenAI: Make sure your account has credits
- For ElevenLabs: Verify your account is active and the key is from your profile settings

### "Rate limit exceeded" error
- You've made too many requests too quickly
- Wait a minute and try again

### Server won't start
- Make sure you ran `npm install` first
- Check that port 3000 is not being used by another application

### Audio doesn't play
- Check your browser's console for errors (F12 → Console tab)
- Make sure your browser supports HTML5 audio

## Learning Notes for Beginners

This project is designed to help you learn:

1. **Frontend Development:**
   - HTML structure and semantic elements
   - CSS styling with modern features (flexbox, grid, variables)
   - JavaScript DOM manipulation
   - Async/await for handling API calls
   - Event listeners and user interactions

2. **Backend Development:**
   - Node.js and Express basics
   - RESTful API design
   - Environment variables and security
   - Error handling
   - HTTP requests and responses

3. **API Integration:**
   - Making authenticated API calls
   - Handling binary data (audio files)
   - Base64 encoding/decoding
   - Error handling and user feedback

Every file is heavily commented to explain what each section does!

## Security Notes

- Never share your `.env` file or API key
- The API key is only used on the server (backend), never exposed to the browser
- The `.gitignore` file prevents committing sensitive files

## Future Enhancements

Ideas for improving this app:
- Add more TTS providers (Google Cloud TTS, Amazon Polly)
- Save generated audio files for offline listening
- Add a history of previously generated audio
- Support for even longer texts by splitting into chunks
- Dark/light mode toggle
- Download button for generated audio
- Voice preview samples
- Bookmark favorite voice/provider combinations

## Support

If you run into issues:
1. Check the browser console (F12 → Console)
2. Check the server terminal for error messages
3. Make sure all dependencies are installed
4. Verify your API key is correct and has credits

## License

MIT License - Feel free to use and modify for your own projects!

---

**Happy Relaxing! 🌙✨**
