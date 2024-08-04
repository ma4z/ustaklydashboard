require('dotenv').config(); // Load environment variables from .env file
const axios = require('axios');

// Retrieve environment variables
const WEBHOOK_ENABLED = process.env.WEBHOOK_ENABLED === 'true';
const WEBHOOK_URL = process.env.WEBHOOK_URL;

if (!WEBHOOK_ENABLED || !WEBHOOK_URL) {
    console.log('Webhook is disabled. Skipping it.');
    module.exports = () => {}; // No-op function if webhook is disabled
    return;
}

// Define the embed message
const embedMessage = {
    content: '', // The content of the message; left empty since the embed will contain the message
    embeds: [
        {
            title: 'Ustakly Logging',
            description: 'Dashboard is Started',
            color: 0x00FF00, // Green color
            footer: {
                text: 'By Mtq4',
            },
            thumbnail: {
                url: 'https://mtq4.pages.dev/ustakly.png' // Custom logo
            } 
        },
    ],
};

// Flag to track if the log message has been sent
let logMessageSent = false;

// Function to send the embed message
const sendLogMessage = async () => {
    if (logMessageSent) {
        return; // Exit if the message has already been sent
    }

    try {
        await axios.post(WEBHOOK_URL, embedMessage);
        console.log('Log message sent successfully');
        logMessageSent = true; // Update the flag after sending the message
    } catch (error) {
        console.error('Error sending log message:', error);
    }
};

// Export the function
module.exports = sendLogMessage;

// Call the sendLogMessage function to send the startup message only once
if (require.main === module) {
    sendLogMessage();
}
