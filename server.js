const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 🔐 Twilio credentials (replace with real values)
const accountSid = 'AC7b15e592e2f790d0e3b859f2ddd233cd';      // e.g., ACxxxxxxxxxxxxxxxxxxxx
const authToken = 'c2c7a1609a5423fdfe626ec0e5ae9754';        // e.g., 7bxxxxxxxxxxxxxxxx
const twilioFrom = '+17409488496';                  // Your Twilio number
const alertTo = '+917061575796';                   // Your phone number

const client = twilio(accountSid, authToken);

// 🔄 Temporary in-memory storage
let latestData = null;

// 🔥 POST: Receive sensor data
app.post('/api/sensors', (req, res) => {
  const { ldr, temp, smoke } = req.body;

  if (!ldr || !temp || !smoke) {
    return res.status(400).json({ error: "Missing one or more sensor fields" });
  }

  const fireDetected = Number(temp) > 50 || Number(smoke) > 600;

  latestData = {
    ldr,
    temp,
    smoke,
    fireDetected,
    timestamp: new Date().toLocaleString()
  };

  console.log("🔥 Sensor Data:", latestData);

  // 📲 Send SMS if fire detected
  if (fireDetected) {
    const smsText = `🚨 Fire Detected!\nTemp: ${temp}°C\nSmoke: ${smoke}\nLDR: ${ldr}`;

    client.messages
      .create({
        body: smsText,
        from: twilioFrom,
        to: alertTo
      })
      .then(message => {
        console.log("✅ SMS sent:", message.sid);
      })
      .catch(error => {
        console.error("❌ SMS sending failed:", error.message);
      });
  }

  res.status(200).json({ message: "Sensor data received" });
});

// 📡 GET: Return latest sensor data
app.get('/api/sensors', (req, res) => {
  if (!latestData) {
    return res.status(404).json({ message: "No sensor data yet" });
  }
  res.status(200).json(latestData);
});

// 🏠 Root route
app.get('/', (req, res) => {
  res.send("🔥 Tejas Fire Monitor Backend is Live with SMS Alerts!");
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

