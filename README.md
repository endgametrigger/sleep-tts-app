# 🌙 Sleep TTS App

A simple, beginner-friendly text-to-speech web application using OpenAI's TTS API for creating soothing bedtime audio. Perfect for listening to bedtime stories, articles, or meditation scripts.

## Features

- **Clean, Minimalist Interface** - Calming dark blue/purple color scheme designed for relaxation
- **OpenAI TTS Integration** - Uses the soothing "Shimmer" voice with the fast, cost-effective "tts-1" model
- **Adjustable Playback Speed** - Control speed from 0.75x (slower) to 1.25x (faster)
- **Real-time Cost Estimation** - See estimated cost before generating audio ($0.015 per 1,000 characters)
- **Character Counter** - Know exactly how much text you're converting (max 4,096 characters)
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

2. **OpenAI API Key**
   - Get one at: https://platform.openai.com/api-keys
   - Make sure you have credits in your OpenAI account

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

### Step 2: Configure Your API Key

Your `.env` file should already contain your OpenAI API key. If not, create a `.env` file in the project root and add:

```
OPENAI_API_KEY=your-api-key-here
```

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
🔑 API Key loaded: Yes ✓
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

1. **Paste Your Text** - Copy any text you want to listen to (stories, articles, meditation scripts) and paste it into the textarea

2. **Check the Cost** - The app will show you the estimated cost in real-time as you type

3. **Generate Audio** - Click the "Generate Audio" button and wait a few seconds

4. **Listen & Relax** - Use the audio player controls to play, pause, and adjust the speed

5. **Adjust Speed** - Use the slider to slow down (0.75x) or speed up (1.25x) the playback

## Cost Breakdown

OpenAI charges **$0.015 per 1,000 characters** for the `tts-1` model:

- 100 characters: $0.0015 (less than a penny)
- 1,000 characters: $0.015 (1.5 cents)
- 4,000 characters: $0.06 (6 cents)

**Example:** A typical bedtime story (2,000 characters) costs about $0.03 (3 cents)

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
- Make sure your `.env` file exists and contains `OPENAI_API_KEY=your-key`
- Restart the server after adding the API key

### "Invalid API key" error
- Check that your API key is correct
- Make sure your OpenAI account has credits

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
- Add multiple voice options (alloy, echo, fable, onyx, nova, shimmer)
- Save generated audio files for offline listening
- Add a history of previously generated audio
- Support for longer texts by splitting into chunks
- Dark/light mode toggle
- Download button for generated audio

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
