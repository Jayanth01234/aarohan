const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Health endpoint
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// CV microservice proxy
const upload = multer({ storage: multer.memoryStorage() });
const CV_HOST = process.env.CV_HOST || 'http://localhost:8000';

app.post('/api/cv/count', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'image file is required (field name: image)' });
    const form = new FormData();
    form.append('file', req.file.buffer, { filename: req.file.originalname || 'image.jpg', contentType: req.file.mimetype });
    const { data } = await axios.post(`${CV_HOST}/count`, form, { headers: form.getHeaders(), timeout: 30000 });
    if (data && data.overcrowded) {
      io.emit('alert', { type: 'overcrowd', severity: 'high', payload: data });
    }
    return res.json(data);
  } catch (err) {
    console.error('CV proxy error', err?.message || err);
    return res.status(502).json({ error: 'cv_service_unavailable' });
  }
});

// Simulated crowd data
let crowdData = {
  totalVisitors: 0,
  zones: [
    { id: 'entrance', name: 'Entrance', capacity: 100, current: 0 },
    { id: 'mainHall', name: 'Main Hall', capacity: 300, current: 0 },
    { id: 'shrine', name: 'Shrine Area', capacity: 50, current: 0 }
  ]
};

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Send initial data
  socket.emit('crowdUpdate', crowdData);
  
  // Simulate periodic updates
  const updateInterval = setInterval(() => {
    // Update crowd numbers
    crowdData.zones.forEach(zone => {
      // Random fluctuation in crowd numbers
      const change = Math.floor(Math.random() * 10) - 5;
      zone.current = Math.max(0, Math.min(zone.capacity, zone.current + change));
    });
    
    // Update total visitors
    crowdData.totalVisitors = crowdData.zones.reduce((sum, zone) => sum + zone.current, 0);
    
    // Emit update
    socket.emit('crowdUpdate', crowdData);
  }, 5000);
  
  socket.on('disconnect', () => {
    clearInterval(updateInterval);
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});