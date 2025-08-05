const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

let latestData = null;

// Route to receive data from ESP32 or Postman
app.post('/api/sensors', (req, res) => {
  const { ldr, temp, smoke } = req.body;

  latestData = {
    ldr,
    temp,
    smoke,
    fireDetected: temp > 50 || smoke > 600,
    timestamp: new Date().toLocaleString()
  };

  console.log("🔥 Sensor Data Received:", latestData);
  res.status(200).json({ message: "Sensor data received" });
});

// Route to send data to frontend
app.get('/api/sensors', (req, res) => {
  if (!latestData) {
    return res.status(404).json({ message: 'No sensor data yet' });
  }
  res.status(200).json(latestData);
});

// Optional welcome route
app.get('/', (req, res) => {
  res.send("🔥 Tejas Backend is Running!");
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
