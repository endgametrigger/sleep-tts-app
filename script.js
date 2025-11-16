// ============================
// WAIT FOR PAGE TO LOAD
// ============================

// This ensures all HTML elements are loaded before we try to access them
document.addEventListener('DOMContentLoaded', function() {

    // ============================
    // GET REFERENCES TO HTML ELEMENTS
    // ============================

    // Get all the elements we need to interact with from the HTML
    const textInput = document.getElementById('textInput');           // The textarea where user types
    const providerOpenAI = document.getElementById('providerOpenAI'); // OpenAI provider radio button
    const providerElevenLabs = document.getElementById('providerElevenLabs'); // ElevenLabs provider radio button
    const voiceSelect = document.getElementById('voiceSelect');       // The voice selection dropdown
    const generateBtn = document.getElementById('generateBtn');       // The "Generate Audio" button
    const btnText = document.getElementById('btnText');               // The text inside the button
    const spinner = document.getElementById('spinner');               // The loading spinner
    const charCount = document.getElementById('charCount');           // Character count display
    const estimatedCost = document.getElementById('estimatedCost');   // Estimated cost display
    const errorMessage = document.getElementById('errorMessage');     // Error message container
    const audioSection = document.getElementById('audioSection');     // The audio player section
    const audioPlayer = document.getElementById('audioPlayer');       // The actual audio element
    const speedSlider = document.getElementById('speedSlider');       // Speed control slider
    const speedValue = document.getElementById('speedValue');         // Speed display (1.00x)
    const processedChars = document.getElementById('processedChars'); // Chars processed after generation
    const actualCost = document.getElementById('actualCost');         // Actual cost after generation

    // ElevenLabs Creator Plan advanced settings elements
    const elevenLabsSettings = document.getElementById('elevenLabsSettings'); // Advanced settings container
    const stabilitySlider = document.getElementById('stabilitySlider');       // Voice consistency slider
    const stabilityValue = document.getElementById('stabilityValue');         // Voice consistency value display
    const similaritySlider = document.getElementById('similaritySlider');     // Voice clarity slider
    const similarityValue = document.getElementById('similarityValue');       // Voice clarity value display
    const styleSlider = document.getElementById('styleSlider');               // Expressiveness slider
    const styleValue = document.getElementById('styleValue');                 // Expressiveness value display

    // Playlist elements
    const addToPlaylistBtn = document.getElementById('addToPlaylistBtn');     // "Add to Playlist" button
    const playlistBtnText = document.getElementById('playlistBtnText');       // Text inside playlist button
    const playlistSpinner = document.getElementById('playlistSpinner');       // Loading spinner for playlist button
    const playlistEntryName = document.getElementById('playlistEntryName');   // Optional entry name input
    const playlistSection = document.getElementById('playlistSection');       // Playlist section container
    const playlistProgress = document.getElementById('playlistProgress');     // Progress display container
    const currentTrackName = document.getElementById('currentTrackName');     // Currently playing track name
    const nextTrackName = document.getElementById('nextTrackName');           // Next track name
    const currentTrackNum = document.getElementById('currentTrackNum');       // Current track number
    const totalTracks = document.getElementById('totalTracks');               // Total tracks count
    const playAllBtn = document.getElementById('playAllBtn');                 // Play All button
    const prevTrackBtn = document.getElementById('prevTrackBtn');             // Previous track button
    const nextTrackBtn = document.getElementById('nextTrackBtn');             // Next track button
    const clearPlaylistBtn = document.getElementById('clearPlaylistBtn');     // Clear playlist button
    const playlistEmpty = document.getElementById('playlistEmpty');           // Empty playlist message
    const playlistList = document.getElementById('playlistList');             // Playlist items list

    // ============================
    // VOICE OPTIONS FOR EACH PROVIDER
    // ============================

    // Define available voices for OpenAI TTS
    const openAIVoices = [
        { value: 'shimmer', label: 'Shimmer - Soft, warm, feminine' },
        { value: 'alloy', label: 'Alloy - Neutral, calm, balanced' },
        { value: 'nova', label: 'Nova - Friendly, gentle, feminine' }
    ];

    // Define available voices for ElevenLabs TTS (Creator Plan)
    // Curated list of soothing voices perfect for sleep and relaxation
    const elevenLabsVoices = [
        { value: 'eryn', label: 'Eryn - Hyper Real Convo' },
        { value: 'mellowmatt', label: 'Mellow Matt - Calm American' },
        { value: 'angela', label: 'Angela - Warm and Friendly' },
        { value: 'dan', label: 'Dan - Clear Middle England' },
        { value: 'ellis', label: 'Ellis - British Storyteller' },
        { value: 'charlotte', label: 'Charlotte - Swedish, soothing' },
        { value: 'rachel', label: 'Rachel - Calm, clear' },
        { value: 'bella', label: 'Bella - Soft, gentle' },
        { value: 'lily', label: 'Lily - British, gentle' },
        { value: 'domi', label: 'Domi - Confident but warm' },
        { value: 'callum', label: 'Callum - British, smooth' },
        { value: 'antoni', label: 'Antoni - Well-rounded' },
        { value: 'arnold', label: 'Arnold - Crisp American' },
        { value: 'josh', label: 'Josh - Deep, calming' }
    ];

    // ============================
    // PLAYLIST DATA STRUCTURE
    // ============================

    /**
     * Array to store playlist items
     * Each item contains:
     * - id: Unique identifier for the playlist item
     * - name: Display name for the track
     * - audioUrl: Blob URL pointing to the audio data
     * - characterCount: Number of characters in the text
     * - provider: Which TTS provider was used ('openai' or 'elevenlabs')
     * - voice: Which voice was used
     */
    let playlist = [];

    /**
     * Track the current playing index in the playlist
     * -1 means no track is currently playing
     */
    let currentPlayingIndex = -1;

    /**
     * Counter for auto-generating playlist entry names
     * Used when user doesn't provide a custom name
     */
    let playlistCounter = 1;

    // ============================
    // EVENT LISTENERS
    // ============================

    // Update character count and estimated cost as user types
    textInput.addEventListener('input', updateCharacterCount);

    // When user switches between OpenAI and ElevenLabs
    providerOpenAI.addEventListener('change', updateVoiceOptions);
    providerElevenLabs.addEventListener('change', updateVoiceOptions);

    // When user clicks the "Generate Audio" button
    generateBtn.addEventListener('click', generateSpeech);

    // When user moves the speed slider
    speedSlider.addEventListener('input', updatePlaybackSpeed);

    // When user adjusts ElevenLabs advanced settings sliders
    stabilitySlider.addEventListener('input', updateStabilityValue);
    similaritySlider.addEventListener('input', updateSimilarityValue);
    styleSlider.addEventListener('input', updateStyleValue);

    // Playlist button event listeners
    addToPlaylistBtn.addEventListener('click', addToPlaylist);
    playAllBtn.addEventListener('click', playAll);
    prevTrackBtn.addEventListener('click', playPreviousTrack);
    nextTrackBtn.addEventListener('click', playNextTrack);
    clearPlaylistBtn.addEventListener('click', clearPlaylist);

    // Auto-advance to next track when current track ends
    audioPlayer.addEventListener('ended', onTrackEnded);

    // ============================
    // FUNCTION: UPDATE VOICE OPTIONS
    // ============================

    /**
     * Updates the voice dropdown based on selected TTS provider
     * Called when user switches between OpenAI and ElevenLabs
     */
    function updateVoiceOptions() {
        // Clear existing voice options
        voiceSelect.innerHTML = '';

        // Determine which provider is selected
        const isOpenAI = providerOpenAI.checked;
        const voices = isOpenAI ? openAIVoices : elevenLabsVoices;

        // Populate voice dropdown with appropriate voices
        voices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = voice.value;
            option.textContent = voice.label;
            // Select the first voice by default
            if (index === 0) {
                option.selected = true;
            }
            voiceSelect.appendChild(option);
        });

        // Show/hide ElevenLabs advanced settings based on provider
        if (isOpenAI) {
            // Hide advanced settings for OpenAI (they don't have these options)
            elevenLabsSettings.style.display = 'none';
        } else {
            // Show advanced settings for ElevenLabs Creator plan
            elevenLabsSettings.style.display = 'block';
        }

        // Update cost estimate when provider changes
        updateCharacterCount();

        console.log(`Switched to ${isOpenAI ? 'OpenAI' : 'ElevenLabs'} provider`);
    }

    // ============================
    // FUNCTION: UPDATE CHARACTER COUNT
    // ============================

    /**
     * Updates the character count and estimated cost display
     * Called every time the user types in the textarea
     */
    function updateCharacterCount() {
        // Get the current length of text in the textarea
        const length = textInput.value.length;

        // Update the character count display (e.g., "245 / 25,000 characters")
        charCount.textContent = `${length} / 25,000 characters`;

        // Calculate estimated cost based on selected provider
        const isOpenAI = providerOpenAI.checked;

        if (isOpenAI) {
            // OpenAI charges $0.015 per 1,000 characters for tts-1 model
            const cost = (length / 1000) * 0.015;
            estimatedCost.textContent = `Estimated cost: $${cost.toFixed(4)}`;
        } else {
            // ElevenLabs Creator Plan: 100,000 characters per month
            estimatedCost.textContent = `Creator Plan: ${length} / 100,000 chars/month`;
        }

        // Change color based on text length
        if (length > 23000) {
            // Turn orange when getting close to the limit (25,000)
            charCount.style.color = '#ff9f43';
        } else {
            // Keep it normal color
            charCount.style.color = 'var(--text-secondary)';
        }
    }

    // ============================
    // FUNCTION: GENERATE SPEECH
    // ============================

    /**
     * Main function that sends text to the backend and gets audio back
     * This is an async function because we need to wait for the server response
     */
    async function generateSpeech() {
        // Get the text from the textarea
        const text = textInput.value.trim(); // trim() removes extra spaces at start/end

        // Get the selected provider (OpenAI or ElevenLabs)
        const selectedProvider = providerOpenAI.checked ? 'openai' : 'elevenlabs';

        // Get the selected voice from the dropdown
        const selectedVoice = voiceSelect.value;

        // Validation: Check if text is empty
        if (!text) {
            showError('Please enter some text to convert to speech.');
            return; // Stop here if there's no text
        }

        // Validation: Check if text is too long (increased to 25,000 characters)
        if (text.length > 25000) {
            showError('Text is too long. Please keep it under 25,000 characters.');
            return; // Stop here if text is too long
        }

        // Hide any previous error messages
        hideError();

        // Hide the audio player section while we generate new audio
        audioSection.style.display = 'none';

        // Update UI to show loading state
        setLoadingState(true);

        // Build the request body
        const requestBody = {
            text: text,                  // The text to convert to speech
            voice: selectedVoice,        // The voice to use
            provider: selectedProvider   // The TTS provider (openai or elevenlabs)
        };

        // If using ElevenLabs, include advanced settings from sliders
        if (selectedProvider === 'elevenlabs') {
            requestBody.stability = parseFloat(stabilitySlider.value);
            requestBody.similarity_boost = parseFloat(similaritySlider.value);
            requestBody.style = parseFloat(styleSlider.value);

            console.log(`ElevenLabs settings - Stability: ${requestBody.stability}, Similarity: ${requestBody.similarity_boost}, Style: ${requestBody.style}`);
        }

        // Log which provider and voice we're using (helpful for debugging)
        console.log(`Generating speech with ${selectedProvider} using voice: ${selectedVoice}`);

        try {
            // Make a POST request to our backend server
            // fetch() is a built-in JavaScript function for making HTTP requests
            const response = await fetch('http://localhost:3000/api/generate-speech', {
                method: 'POST',              // We're sending data, so use POST
                headers: {
                    'Content-Type': 'application/json'  // Tell server we're sending JSON
                },
                // Send the request body (includes text, voice, provider, and ElevenLabs settings if applicable)
                body: JSON.stringify(requestBody)
            });

            // Parse the JSON response from the server
            const data = await response.json();

            // Check if the request was successful
            if (!response.ok) {
                // If there was an error, throw it so we can catch it below
                throw new Error(data.error || 'Failed to generate speech');
            }

            // Success! We got the audio back from the server
            console.log('Speech generated successfully!');

            // The audio comes back as base64 encoded data
            // We need to convert it to a format the audio player can use
            const audioBlob = base64ToBlob(data.audio, 'audio/mpeg');

            // Create a URL that points to this audio data
            const audioUrl = URL.createObjectURL(audioBlob);

            // Set the audio player's source to this URL
            audioPlayer.src = audioUrl;

            // Update the generation info display
            processedChars.textContent = data.characterCount;
            actualCost.textContent = data.estimatedCost.toFixed(4);

            // Show the audio player section
            audioSection.style.display = 'block';

            // Automatically scroll down to show the audio player
            audioSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            // Optional: Automatically start playing the audio
            // Uncomment the line below if you want auto-play
            // audioPlayer.play();

        } catch (error) {
            // If anything went wrong, show the error message to the user
            console.error('Error:', error);
            showError(error.message || 'Failed to generate speech. Please try again.');
        } finally {
            // Always turn off the loading state, whether we succeeded or failed
            setLoadingState(false);
        }
    }

    // ============================
    // FUNCTION: SET LOADING STATE
    // ============================

    /**
     * Updates the UI to show or hide loading state
     * @param {boolean} isLoading - true to show loading, false to hide
     */
    function setLoadingState(isLoading) {
        if (isLoading) {
            // Disable the button so user can't click it again
            generateBtn.disabled = true;

            // Hide the button text and show the spinner
            btnText.style.display = 'none';
            spinner.style.display = 'inline-block';
        } else {
            // Re-enable the button
            generateBtn.disabled = false;

            // Show the button text and hide the spinner
            btnText.style.display = 'inline';
            spinner.style.display = 'none';
        }
    }

    // ============================
    // FUNCTION: SHOW ERROR
    // ============================

    /**
     * Displays an error message to the user
     * @param {string} message - The error message to display
     */
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';

        // Scroll to the error message so user can see it
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // ============================
    // FUNCTION: HIDE ERROR
    // ============================

    /**
     * Hides the error message
     */
    function hideError() {
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';
    }

    // ============================
    // FUNCTION: UPDATE PLAYBACK SPEED
    // ============================

    /**
     * Updates the audio playback speed based on slider value
     */
    function updatePlaybackSpeed() {
        // Get the current value from the slider (e.g., 1.00, 0.75, 1.25)
        const speed = parseFloat(speedSlider.value);

        // Update the display to show the current speed
        speedValue.textContent = `${speed.toFixed(2)}x`;

        // Change the actual playback speed of the audio
        // playbackRate controls how fast or slow the audio plays
        audioPlayer.playbackRate = speed;
    }

    // ============================
    // FUNCTIONS: UPDATE ELEVENLABS SETTINGS VALUES
    // ============================

    /**
     * Updates the stability slider value display
     * Stability controls voice consistency (higher = more consistent)
     */
    function updateStabilityValue() {
        const value = parseFloat(stabilitySlider.value);
        stabilityValue.textContent = value.toFixed(2);
    }

    /**
     * Updates the similarity boost slider value display
     * Similarity controls how close the voice stays to the original
     */
    function updateSimilarityValue() {
        const value = parseFloat(similaritySlider.value);
        similarityValue.textContent = value.toFixed(2);
    }

    /**
     * Updates the style slider value display
     * Style controls expressiveness/emotion (keep low for sleep content)
     */
    function updateStyleValue() {
        const value = parseFloat(styleSlider.value);
        styleValue.textContent = value.toFixed(2);
    }

    // ============================
    // HELPER FUNCTION: BASE64 TO BLOB
    // ============================

    /**
     * Converts base64 encoded audio data to a Blob object
     * This is necessary because the audio player needs a Blob, not base64
     *
     * @param {string} base64 - The base64 encoded string
     * @param {string} contentType - The MIME type (e.g., 'audio/mpeg')
     * @returns {Blob} - A Blob object containing the audio data
     */
    function base64ToBlob(base64, contentType) {
        // Decode the base64 string to binary data
        const byteCharacters = atob(base64);

        // Create an array to hold the binary data
        const byteArrays = [];

        // Process the data in chunks for better performance
        const sliceSize = 512;
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            // Get a slice of the data
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            // Convert each character to a byte
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            // Create a typed array from the bytes
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        // Create and return a Blob from all the byte arrays
        return new Blob(byteArrays, { type: contentType });
    }

    // ============================
    // PLAYLIST FUNCTIONS
    // ============================

    /**
     * Adds the current text to the playlist
     * Generates audio and stores it for later playback
     */
    async function addToPlaylist() {
        // Get the text from the textarea
        const text = textInput.value.trim();

        // Get the selected provider and voice
        const selectedProvider = providerOpenAI.checked ? 'openai' : 'elevenlabs';
        const selectedVoice = voiceSelect.value;

        // Validation: Check if text is empty
        if (!text) {
            showError('Please enter some text to add to the playlist.');
            return;
        }

        // Validation: Check if text is too long
        if (text.length > 25000) {
            showError('Text is too long. Please keep it under 25,000 characters.');
            return;
        }

        // Hide any previous error messages
        hideError();

        // Update UI to show loading state for playlist button
        setPlaylistLoadingState(true);

        // Build the request body
        const requestBody = {
            text: text,
            voice: selectedVoice,
            provider: selectedProvider
        };

        // If using ElevenLabs, include advanced settings
        if (selectedProvider === 'elevenlabs') {
            requestBody.stability = parseFloat(stabilitySlider.value);
            requestBody.similarity_boost = parseFloat(similaritySlider.value);
            requestBody.style = parseFloat(styleSlider.value);
        }

        console.log(`Adding to playlist with ${selectedProvider} using voice: ${selectedVoice}`);

        try {
            // Make a POST request to our backend server to generate audio
            const response = await fetch('http://localhost:3000/api/generate-speech', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            // Parse the JSON response
            const data = await response.json();

            // Check if the request was successful
            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate speech');
            }

            // Success! Convert the audio to a blob URL
            const audioBlob = base64ToBlob(data.audio, 'audio/mpeg');
            const audioUrl = URL.createObjectURL(audioBlob);

            // Get the entry name (use custom name if provided, otherwise auto-generate)
            let entryName = playlistEntryName.value.trim();
            if (!entryName) {
                entryName = `Track ${playlistCounter}`;
                playlistCounter++;
            }

            // Create a playlist item object
            const playlistItem = {
                id: Date.now(), // Use timestamp as unique ID
                name: entryName,
                audioUrl: audioUrl,
                characterCount: data.characterCount,
                provider: selectedProvider,
                voice: selectedVoice
            };

            // Add the item to the playlist array
            playlist.push(playlistItem);

            console.log(`Added "${entryName}" to playlist (${playlist.length} items total)`);

            // Update the playlist UI
            renderPlaylist();

            // Clear the entry name input for next addition
            playlistEntryName.value = '';

            // Show a success message by briefly updating the button text
            playlistBtnText.textContent = '✓ Added to Playlist!';
            setTimeout(() => {
                playlistBtnText.textContent = 'Add to Playlist';
            }, 2000);

        } catch (error) {
            // If anything went wrong, show the error message
            console.error('Error adding to playlist:', error);
            showError(error.message || 'Failed to add to playlist. Please try again.');
        } finally {
            // Always turn off the loading state
            setPlaylistLoadingState(false);
        }
    }

    /**
     * Sets the loading state for the "Add to Playlist" button
     * @param {boolean} isLoading - true to show loading, false to hide
     */
    function setPlaylistLoadingState(isLoading) {
        if (isLoading) {
            addToPlaylistBtn.disabled = true;
            playlistBtnText.style.display = 'none';
            playlistSpinner.style.display = 'inline-block';
        } else {
            addToPlaylistBtn.disabled = false;
            playlistBtnText.style.display = 'inline';
            playlistSpinner.style.display = 'none';
        }
    }

    /**
     * Renders the playlist UI
     * Updates the playlist items list and shows/hides sections as needed
     */
    function renderPlaylist() {
        // If playlist is empty, show empty message and hide playlist section
        if (playlist.length === 0) {
            playlistSection.style.display = 'none';
            playlistList.innerHTML = '';
            return;
        }

        // Show the playlist section
        playlistSection.style.display = 'block';
        playlistEmpty.style.display = 'none';

        // Clear the existing list
        playlistList.innerHTML = '';

        // Create a list item for each playlist item
        playlist.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'playlist-item';
            li.dataset.index = index;

            // Add "playing" class if this is the current track
            if (index === currentPlayingIndex) {
                li.classList.add('playing');
            }

            // Create the HTML content for this item
            li.innerHTML = `
                <div class="playlist-item-info">
                    <div class="playlist-item-header">
                        <strong class="playlist-item-name">${item.name}</strong>
                        <span class="playlist-item-badge ${item.provider}">${item.provider.toUpperCase()}</span>
                    </div>
                    <div class="playlist-item-details">
                        <span>Voice: ${item.voice}</span>
                        <span>•</span>
                        <span>${item.characterCount} characters</span>
                    </div>
                </div>
                <div class="playlist-item-controls">
                    <button class="playlist-item-btn" onclick="window.movePlaylistItemUp(${index})"
                            ${index === 0 ? 'disabled' : ''} title="Move up">
                        ▲
                    </button>
                    <button class="playlist-item-btn" onclick="window.movePlaylistItemDown(${index})"
                            ${index === playlist.length - 1 ? 'disabled' : ''} title="Move down">
                        ▼
                    </button>
                    <button class="playlist-item-btn danger" onclick="window.removePlaylistItem(${index})" title="Remove">
                        ✕
                    </button>
                </div>
            `;

            playlistList.appendChild(li);
        });

        // Update the total tracks display
        totalTracks.textContent = playlist.length;
    }

    /**
     * Starts playing all tracks in the playlist from the beginning
     */
    function playAll() {
        // Make sure there are tracks to play
        if (playlist.length === 0) {
            showError('Playlist is empty. Add some tracks first!');
            return;
        }

        // Start playing from the first track
        playTrackAtIndex(0);

        // Show the progress display
        playlistProgress.style.display = 'block';

        console.log('Starting playlist playback...');
    }

    /**
     * Plays the track at the specified index
     * @param {number} index - The index of the track to play
     */
    function playTrackAtIndex(index) {
        // Validate the index
        if (index < 0 || index >= playlist.length) {
            console.error('Invalid track index:', index);
            return;
        }

        // Get the track
        const track = playlist[index];

        // Update the current playing index
        currentPlayingIndex = index;

        // Set the audio source to this track's URL
        audioPlayer.src = track.audioUrl;

        // Show the audio section
        audioSection.style.display = 'block';

        // Update the generation info
        processedChars.textContent = track.characterCount;
        actualCost.textContent = track.provider === 'openai' ?
            ((track.characterCount / 1000) * 0.015).toFixed(4) : '0.00';

        // Start playing
        audioPlayer.play();

        // Update the progress display
        updatePlaylistProgress();

        // Re-render the playlist to highlight the current track
        renderPlaylist();

        // Scroll to the audio section
        audioSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        console.log(`Playing track ${index + 1}/${playlist.length}: ${track.name}`);
    }

    /**
     * Updates the playlist progress display
     * Shows current track, next track, and track counter
     */
    function updatePlaylistProgress() {
        // If no track is playing, hide progress
        if (currentPlayingIndex === -1 || playlist.length === 0) {
            playlistProgress.style.display = 'none';
            prevTrackBtn.disabled = true;
            nextTrackBtn.disabled = true;
            return;
        }

        // Show progress display
        playlistProgress.style.display = 'block';

        // Update current track name
        currentTrackName.textContent = playlist[currentPlayingIndex].name;

        // Update next track name
        if (currentPlayingIndex < playlist.length - 1) {
            nextTrackName.textContent = playlist[currentPlayingIndex + 1].name;
        } else {
            nextTrackName.textContent = 'End of playlist';
        }

        // Update track counter
        currentTrackNum.textContent = currentPlayingIndex + 1;

        // Enable/disable previous button
        prevTrackBtn.disabled = currentPlayingIndex === 0;

        // Enable/disable next button
        nextTrackBtn.disabled = currentPlayingIndex === playlist.length - 1;
    }

    /**
     * Plays the previous track in the playlist
     */
    function playPreviousTrack() {
        if (currentPlayingIndex > 0) {
            playTrackAtIndex(currentPlayingIndex - 1);
        }
    }

    /**
     * Plays the next track in the playlist
     */
    function playNextTrack() {
        if (currentPlayingIndex < playlist.length - 1) {
            playTrackAtIndex(currentPlayingIndex + 1);
        }
    }

    /**
     * Called when a track finishes playing
     * Automatically advances to the next track
     */
    function onTrackEnded() {
        // Only auto-advance if we're playing from the playlist
        if (currentPlayingIndex !== -1 && currentPlayingIndex < playlist.length - 1) {
            console.log('Track ended, auto-advancing to next track...');
            playNextTrack();
        } else if (currentPlayingIndex === playlist.length - 1) {
            console.log('Playlist finished!');
            // Reset to -1 when playlist is complete
            currentPlayingIndex = -1;
            updatePlaylistProgress();
            renderPlaylist();
        }
    }

    /**
     * Removes a playlist item at the specified index
     * @param {number} index - The index of the item to remove
     */
    function removePlaylistItem(index) {
        // Validate the index
        if (index < 0 || index >= playlist.length) {
            console.error('Invalid index for removal:', index);
            return;
        }

        // Get the item to remove
        const item = playlist[index];

        // IMPORTANT: Clean up the blob URL to free memory
        // This prevents memory leaks when removing items
        URL.revokeObjectURL(item.audioUrl);

        console.log(`Removing "${item.name}" from playlist`);

        // Remove the item from the array
        playlist.splice(index, 1);

        // Adjust currentPlayingIndex if necessary
        if (currentPlayingIndex === index) {
            // If we're removing the currently playing track, stop playback
            audioPlayer.pause();
            currentPlayingIndex = -1;
            audioSection.style.display = 'none';
        } else if (currentPlayingIndex > index) {
            // If we're removing a track before the current one, adjust the index
            currentPlayingIndex--;
        }

        // Re-render the playlist
        renderPlaylist();
        updatePlaylistProgress();
    }

    /**
     * Moves a playlist item up in the queue
     * @param {number} index - The index of the item to move up
     */
    function movePlaylistItemUp(index) {
        // Can't move the first item up
        if (index <= 0 || index >= playlist.length) {
            return;
        }

        // Swap with the previous item
        [playlist[index - 1], playlist[index]] = [playlist[index], playlist[index - 1]];

        // Adjust currentPlayingIndex if necessary
        if (currentPlayingIndex === index) {
            currentPlayingIndex--;
        } else if (currentPlayingIndex === index - 1) {
            currentPlayingIndex++;
        }

        // Re-render the playlist
        renderPlaylist();
        updatePlaylistProgress();

        console.log(`Moved item up to position ${index}`);
    }

    /**
     * Moves a playlist item down in the queue
     * @param {number} index - The index of the item to move down
     */
    function movePlaylistItemDown(index) {
        // Can't move the last item down
        if (index < 0 || index >= playlist.length - 1) {
            return;
        }

        // Swap with the next item
        [playlist[index], playlist[index + 1]] = [playlist[index + 1], playlist[index]];

        // Adjust currentPlayingIndex if necessary
        if (currentPlayingIndex === index) {
            currentPlayingIndex++;
        } else if (currentPlayingIndex === index + 1) {
            currentPlayingIndex--;
        }

        // Re-render the playlist
        renderPlaylist();
        updatePlaylistProgress();

        console.log(`Moved item down to position ${index + 2}`);
    }

    /**
     * Clears all items from the playlist
     */
    function clearPlaylist() {
        // Confirm with the user before clearing
        if (playlist.length > 0 && !confirm('Are you sure you want to clear the entire playlist?')) {
            return;
        }

        // Clean up all blob URLs to free memory
        playlist.forEach(item => {
            URL.revokeObjectURL(item.audioUrl);
        });

        console.log(`Cleared ${playlist.length} items from playlist`);

        // Clear the playlist array
        playlist = [];

        // Reset state
        currentPlayingIndex = -1;
        playlistCounter = 1;

        // Stop playback
        audioPlayer.pause();
        audioSection.style.display = 'none';

        // Update UI
        renderPlaylist();
        updatePlaylistProgress();
    }

    // Make playlist functions available globally so they can be called from onclick attributes
    window.removePlaylistItem = removePlaylistItem;
    window.movePlaylistItemUp = movePlaylistItemUp;
    window.movePlaylistItemDown = movePlaylistItemDown;

    // ============================
    // INITIALIZE ON PAGE LOAD
    // ============================

    // Call updateCharacterCount once when page loads to show "0 / 4096 characters"
    updateCharacterCount();

    console.log('Sleep TTS App initialized!');
    console.log('Ready to convert text to speech 🌙');

}); // End of DOMContentLoaded event listener
