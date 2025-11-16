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
    const elevenLabsVoices = [
        { value: 'rachel', label: 'Rachel - Calm, clear, American female' },
        { value: 'domi', label: 'Domi - Confident, strong female' },
        { value: 'bella', label: 'Bella - Soft, gentle, young female' },
        { value: 'lily', label: 'Lily - British, gentle female' },
        { value: 'charlotte', label: 'Charlotte - Swedish, calm female' },
        { value: 'antoni', label: 'Antoni - Well-rounded, male' },
        { value: 'callum', label: 'Callum - British, smooth male' },
        { value: 'arnold', label: 'Arnold - Crisp, American male' }
    ];

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
    // INITIALIZE ON PAGE LOAD
    // ============================

    // Call updateCharacterCount once when page loads to show "0 / 4096 characters"
    updateCharacterCount();

    console.log('Sleep TTS App initialized!');
    console.log('Ready to convert text to speech 🌙');

}); // End of DOMContentLoaded event listener
