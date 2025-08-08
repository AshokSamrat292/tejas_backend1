const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios'); // ✅ Add this for HTTP request

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

let latestData = null;

app.post('/api/sensors', async (req, res) => {
  const { ldr, temp, smoke } = req.body;

  if (!ldr || !temp || !smoke) {
    return res.status(400).json({ error: "Missing one or more sensor fields" });
  }

  const fireDetected = Number(temp) > 33 && Number(smoke) == 1 && Number(ldr) >18;

  latestData = {
    ldr,
    temp,
    smoke,
    fireDetected,
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  };

  console.log("🔥 Sensor Data:", latestData);

  res.status(200).json({ message: "Sensor data received" });

  // ✅ Forward to EC2 endpoint after responding
try {
  if (fireDetected) {
    await axios.post("http://13.60.209.249:5000/fire-alert", {
      status: "fire"
    });
    console.log("✅ Fire alert forwarded to EC2");
  }
} catch (err) {
  console.error("❌ Failed to forward to EC2:", err.message);
}
});

app.get('/api/sensors', (req, res) => {
  if (!latestData) {
    return res.status(404).json({ message: "No sensor data yet" });
  }
  res.status(200).json(latestData);
});

app.get('/', (req, res) => {
  res.send("🔥 Tejas Fire Monitor Backend is Live!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
