const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 🔄 Temporary in-memory storage
let latestData = null;

// 🔥 POST: Receive sensor data
app.post('/api/sensors', (req, res) => {
  const { ldr, temp, smoke } = req.body;

  if (!ldr || !temp || !smoke) {
    return res.status(400).json({ error: "Missing one or more sensor fields" });
  }

const fireDetected = Number(temp) > 50 && Number(smoke) == 1 && Number(ldr) > 170;

latestData = {
  ldr,
  temp,
  smoke,
  fireDetected,
  timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })  // ✅ Now in IST
};


  console.log("🔥 Sensor Data:", latestData);

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
  res.send("🔥 Tejas Fire Monitor Backend is Live!");
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
