const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
let latestData = {};

app.post('/api/sensors', (req, res) => {
  const { ldr, temp, smoke } = req.body;
  latestData = {
    ldr: parseInt(ldr),
    temp: parseInt(temp),
    smoke: parseInt(smoke),
    fireDetected: parseInt(smoke) > 500 || parseInt(ldr) < 200 || parseInt(temp) > 50,
    timestamp: new Date().toLocaleString()
  };
  console.log("Received sensor data:", latestData);
  if (latestData.fireDetected) {
    sendTelegramAlert(`■ FIRE DETECTED!\nLDR: ${ldr}, Temp: ${temp}°C, Smoke: ${smoke}`);
  }
  res.sendStatus(200);
});

app.get('/api/sensors', (req, res) => {
  res.json(latestData);
});

function sendTelegramAlert(message) {
  const botToken = 'your_telegram_bot_token';
  const chatId = 'your_chat_id';
  axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    chat_id: chatId,
    text: message
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
