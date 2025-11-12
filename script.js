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

    // ============================
    // EVENT LISTENERS
    // ============================

    // Update character count and estimated cost as user types
    textInput.addEventListener('input', updateCharacterCount);

    // When user clicks the "Generate Audio" button
    generateBtn.addEventListener('click', generateSpeech);

    // When user moves the speed slider
    speedSlider.addEventListener('input', updatePlaybackSpeed);

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

        // Update the character count display (e.g., "245 / 4096 characters")
        charCount.textContent = `${length} / 4096 characters`;

        // Calculate estimated cost
        // OpenAI charges $0.015 per 1,000 characters for tts-1 model
        const cost = (length / 1000) * 0.015;

        // Update the estimated cost display (e.g., "Estimated cost: $0.01")
        estimatedCost.textContent = `Estimated cost: $${cost.toFixed(4)}`;

        // Change color based on text length
        if (length > 3500) {
            // Turn orange when getting close to the limit
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

        // Get the selected voice from the dropdown
        // This will be one of: 'shimmer', 'alloy', or 'nova'
        const selectedVoice = voiceSelect.value;

        // Validation: Check if text is empty
        if (!text) {
            showError('Please enter some text to convert to speech.');
            return; // Stop here if there's no text
        }

        // Validation: Check if text is too long
        if (text.length > 4096) {
            showError('Text is too long. Please keep it under 4096 characters.');
            return; // Stop here if text is too long
        }

        // Hide any previous error messages
        hideError();

        // Hide the audio player section while we generate new audio
        audioSection.style.display = 'none';

        // Update UI to show loading state
        setLoadingState(true);

        // Log which voice we're using (helpful for debugging)
        console.log(`Generating speech with voice: ${selectedVoice}`);

        try {
            // Make a POST request to our backend server
            // fetch() is a built-in JavaScript function for making HTTP requests
            const response = await fetch('http://localhost:3000/api/generate-speech', {
                method: 'POST',              // We're sending data, so use POST
                headers: {
                    'Content-Type': 'application/json'  // Tell server we're sending JSON
                },
                // Send both the text and the selected voice to the backend
                body: JSON.stringify({
                    text: text,              // The text to convert to speech
                    voice: selectedVoice     // The voice to use (shimmer, alloy, or nova)
                })
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
