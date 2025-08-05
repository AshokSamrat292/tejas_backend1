const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let latestData = null;

app.post('/api/sensors', (req, res) => {
  const { ldr, temp, smoke } = req.body;
  latestData = {
    ldr,
    temp,
    smoke,
    fireDetected: temp > 50 || smoke > 600,
    timestamp: new Date().toLocaleString()
  };
  console.log("Sensor data received:", latestData);
  res.status(200).json({ message: "Data received" });
});

app.get('/api/sensors', (req, res) => {
  if (!latestData) {
    return res.status(404).json({ message: 'No sensor data yet' });
  }
  res.status(200).json(latestData);
});

app.get('/', (req, res) => {
  res.send("🔥 Tejas backend is running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
