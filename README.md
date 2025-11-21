# 🌙 Sleep TTS App

A simple, beginner-friendly text-to-speech web application using OpenAI's TTS API for creating soothing bedtime audio. Perfect for listening to bedtime stories, articles, or meditation scripts.

## Features

- **Dual TTS Provider Support** - Choose between OpenAI and ElevenLabs for text-to-speech
- **Multiple Premium Voices** - 3 OpenAI voices + 14 ElevenLabs Creator voices optimized for relaxation
- **Playlist Queue System** - Queue multiple audio tracks for continuous playback
- **Mobile Background Playback** - Audio keeps playing even when your phone screen locks! 📱
- **Lock Screen Controls** - Control playback from your phone's lock screen or headphones
- **ElevenLabs Creator Plan Integration** - Advanced voice controls with adjustable settings
- **Voice Customization Sliders** - Fine-tune stability, clarity, and expressiveness (ElevenLabs only)
- **Clean, Minimalist Interface** - Calming dark blue/purple color scheme designed for relaxation
- **Adjustable Playback Speed** - Control speed from 0.75x (slower) to 1.25x (faster)
- **Real-time Cost Estimation** - See estimated cost before generating audio
- **Extended Character Limit** - Convert up to 25,000 characters at once
- **Mobile Optimized** - Large touch targets (44px) for easy mobile control
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
   - Creator Plan recommended: 100,000 characters per month ($11/month)
   - Access to premium voices and advanced voice settings
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

### Accessing from Mobile Devices 📱

To use the app on your phone (recommended for bedtime listening with lock screen controls):

1. **Make sure your phone and computer are on the same WiFi network**

2. **Find your computer's IP address:**

   **On Windows:**
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" under your WiFi adapter (e.g., `192.168.1.100`)

   **On Mac/Linux:**
   ```bash
   ifconfig | grep "inet "
   ```
   or
   ```bash
   ip addr show
   ```
   Look for your local IP (usually starts with `192.168.` or `10.0.`)

3. **On your phone's browser, go to:**
   ```
   http://YOUR_IP_ADDRESS:3000
   ```
   Example: `http://192.168.1.100:3000`

4. **The app will work exactly the same**, but now with full mobile features:
   - Lock screen controls ✅
   - Background playback ✅
   - Headphone button integration ✅

**Troubleshooting mobile access:**
- Make sure your computer's firewall allows port 3000
- Verify both devices are on the same WiFi network (not guest network)
- Try disabling any VPN on either device
- On Windows, you may need to allow Node.js through the firewall

## How to Use

1. **Paste Your Text** - Copy any text you want to listen to (stories, articles, meditation scripts) and paste it into the textarea (up to 25,000 characters)

2. **Choose Your TTS Provider** - Select between OpenAI or ElevenLabs

3. **Select a Voice** - Pick from the available voices for your chosen provider

4. **Adjust Voice Settings** (ElevenLabs Creator only):
   - **Voice Consistency** - Control how stable the voice sounds (higher = more consistent)
   - **Voice Clarity** - Control how close to the original voice (higher = clearer)
   - **Expressiveness** - Control emotional variation (keep low for sleep content)

5. **Check the Cost** - The app will show you the estimated cost in real-time as you type

6. **Generate Audio** - Click the "Generate Audio" button and wait a few seconds

7. **Listen & Relax** - Use the audio player controls to play, pause, and adjust the speed

8. **Adjust Speed** - Use the slider to slow down (0.75x) or speed up (1.25x) the playback

## Using the Playlist Feature 🎵

The playlist feature is perfect for queuing multiple stories, chapters, or meditations for uninterrupted bedtime listening:

1. **Add to Playlist** - Instead of clicking "Generate Audio", click "Add to Playlist"
   - Give your track a custom name (e.g., "Chapter 1", "Meditation Part 1") or leave blank for auto-naming
   - The track will be generated and added to your queue

2. **Build Your Queue** - Add as many tracks as you want
   - Mix and match OpenAI and ElevenLabs voices
   - Each track can use different voices and providers
   - Reorder tracks using the ▲ and ▼ buttons
   - Remove unwanted tracks with the ✕ button

3. **Play All** - Click the "▶ Play All" button to start the playlist
   - Tracks play automatically one after another
   - No gaps between tracks - seamless transitions
   - The currently playing track is highlighted in green

4. **Navigate** - Use the playlist controls:
   - **⏮ Previous** - Go back to the previous track
   - **⏭ Next** - Skip to the next track
   - **🗑 Clear Playlist** - Remove all tracks (asks for confirmation)

5. **Progress Tracking** - See what's playing and what's coming up:
   - **Currently Playing:** Shows the active track name
   - **Up Next:** Preview the next track in the queue
   - **Track Counter:** See your position (e.g., "Track 2 of 5")

## Mobile Background Playback 📱

**CRITICAL FOR SLEEP USE:** The app uses the Media Session API to ensure your audio keeps playing even when your phone screen locks!

### How It Works

When you play audio from the app, it integrates with your phone's media controls:

1. **Lock Screen Controls** - When your screen is locked, you'll see:
   - Track name and voice information
   - Play/Pause button
   - Previous/Next track buttons
   - Seek backward/forward (10 seconds)

2. **Headphone Controls** - Use your headphone buttons:
   - **Single press:** Play/Pause
   - **Double press:** Next track
   - **Triple press:** Previous track

3. **Notification Controls** - Pull down your notification shade to see full media controls

### Tips for Best Mobile Experience

- **Keep the browser tab active** - Don't navigate away from the page
- **Use headphones** - Better battery life and control
- **Lock your screen** - The audio will keep playing! 🎉
- **Airplane mode** - Once playlist is loaded, you can enable airplane mode
- **Do Not Disturb** - Enable DND mode for uninterrupted sleep

### Browser Compatibility

The Media Session API works on:
- ✅ **Chrome/Edge (Android)** - Full support
- ✅ **Safari (iOS 13.4+)** - Full support
- ✅ **Firefox (Android)** - Full support
- ⚠️ **Desktop browsers** - Partial support (no lock screen, but works in notification area)

**Best experience:** Use Chrome on Android or Safari on iOS for complete lock screen integration.

## Available Voices

### OpenAI Voices
- **Shimmer** - Soft, warm, feminine
- **Alloy** - Neutral, calm, balanced
- **Nova** - Friendly, gentle, feminine

### ElevenLabs Voices (Creator Plan) - 14 Curated Voices
All voices are carefully selected for their soothing, relaxing qualities perfect for bedtime:

- **Eryn** - Hyper Real Convo
- **Mellow Matt** - Calm American
- **Angela** - Warm and Friendly
- **Dan** - Clear Middle England
- **Ellis** - British Storyteller
- **Charlotte** - Swedish, soothing
- **Rachel** - Calm, clear ⭐ *Recommended for bedtime stories*
- **Bella** - Soft, gentle
- **Lily** - British, gentle
- **Domi** - Confident but warm
- **Callum** - British, smooth ⭐ *Recommended for bedtime stories*
- **Antoni** - Well-rounded
- **Arnold** - Crisp American
- **Josh** - Deep, calming

**Advanced Settings** (ElevenLabs only):
- Adjust voice consistency, clarity, and expressiveness with easy sliders
- Defaults optimized for sleep and relaxation content
- Fine-tune to your personal preference

## Cost Breakdown

### OpenAI Pricing
OpenAI charges **$0.015 per 1,000 characters** for the `tts-1` model:

- 100 characters: $0.0015 (less than a penny)
- 1,000 characters: $0.015 (1.5 cents)
- 25,000 characters: $0.375 (38 cents)

**Example:** A typical bedtime story (2,000 characters) costs about $0.03 (3 cents)

### ElevenLabs Pricing (Creator Plan)
ElevenLabs Creator Plan offers excellent value:

- **Creator Plan:** $11/month for 100,000 characters
- **Includes:** Access to premium voices and advanced voice settings
- **Cost per use:** Effectively free within your monthly limit
- **Example:** 100 bedtime stories (2,000 chars each) = $11/month total

**Recommendation:** Use ElevenLabs Creator Plan for the best value and voice quality with advanced customization options.

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
- Save generated audio files for offline listening (download button)
- Add a history of previously generated audio
- Support for even longer texts by splitting into chunks automatically
- Dark/light mode toggle
- Voice preview samples (hear voice before committing)
- Bookmark favorite voice/provider combinations
- Sleep timer (auto-stop after X minutes)
- Fade out at the end of playlist
- Custom artwork for lock screen

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
