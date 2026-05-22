const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const twilio = require('twilio');

// Setup Twilio if available
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
let twilioClient;

if (accountSid && authToken) {
  twilioClient = twilio(accountSid, authToken);
  console.log("Twilio initialized successfully.");
} else {
  console.log("No Twilio credentials found in .env! Backend is running in development/simulation mode.");
}

app.post('/send-sos', async (req, res) => {
  const { name, location, contacts, blood_group, med_conditions } = req.body;

  if (!name || !location || !contacts || !Array.isArray(contacts)) {
    return res.status(400).json({ success: false, error: 'Missing required SOS payload parameters.' });
  }

  const mapLink = location.lat ? `https://maps.google.com/?q=${location.lat},${location.lng}` : 'Location tracking restricted by device.';
  const payloadMessage = `EMERGENCY! ${name} (Blood Group: ${blood_group || 'Unknown'}) needs immediate assistance. Condition: ${med_conditions || 'None Declared'}. Coordinates: ${mapLink}`;

  try {
    const dispatchPromises = contacts.map(async (contact) => {
      if (twilioClient && contact.phone.length > 5) { // Roughly valid phone
        // SMS Integration
        await twilioClient.messages.create({
           body: payloadMessage,
           from: process.env.TWILIO_PHONE_NUMBER,
           to: contact.phone
        });

        // Voice Call Integration Setup (uncomment if TwiML is desired for calls)
        /*
        await twilioClient.calls.create({
           twiml: `<Response><Say>Emergency alert triggered for ${name}. Please check your SMS for coordinates.</Say></Response>`,
           from: process.env.TWILIO_PHONE_NUMBER,
           to: contact.phone
        });
        */
      } else {
        // Output locally if Twilio API keys aren't mounted or contact is invalid format
        console.log(`[SIMULATED TWILIO SMS] sent to ${contact.name} at Phone: ${contact.phone}`);
        console.log(`[BODY] ${payloadMessage}`);
      }
    });

    await Promise.all(dispatchPromises);
    console.log(`SOS dispatched successfully for User: ${name}`);

    return res.json({ success: true, message: 'Emergency endpoints notified.' });
  } catch (error) {
    console.error("Failed to broadcast Twilio APIs:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`MediBridge India API is securely tracking on port: ${PORT}`);
});
