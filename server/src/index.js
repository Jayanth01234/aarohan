const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
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

// Static uploads dir for media previews
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

app.post('/api/cv/count', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'image file is required (field name: image)' });
    const form = new FormData();
    form.append('file', req.file.buffer, { filename: req.file.originalname || 'image.jpg', contentType: req.file.mimetype });
    const { data } = await axios.post(`${CV_HOST}/count`, form, { headers: form.getHeaders(), timeout: 30000 });
    if (data && data.overcrowded) {
      io.emit('alert', { type: 'overcrowd', severity: 'high', payload: data });
    }
    // Save media and emit URL for live preview
    const ext = (req.file.originalname && path.extname(req.file.originalname)) || (req.file.mimetype?.includes('video') ? '.mp4' : '.jpg');
    const filename = `cv_${Date.now()}${ext}`;
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, req.file.buffer);
    const mediaUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
    io.emit('media', { url: mediaUrl, type: req.file.mimetype || 'application/octet-stream' });
    return res.json(data);
  } catch (err) {
    console.error('CV proxy error', err?.message || err);
    return res.status(502).json({ error: 'cv_service_unavailable' });
  }
});

// Per-second CV microservice proxy (series)
app.post('/api/cv/count_series', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'image file is required (field name: image)' });
    const form = new FormData();
    form.append('file', req.file.buffer, { filename: req.file.originalname || 'video.mp4', contentType: req.file.mimetype });
    const { data } = await axios.post(`${CV_HOST}/count_series`, form, { headers: form.getHeaders(), timeout: 60000 });
    // Save media and emit URL for live preview
    const ext = (req.file.originalname && path.extname(req.file.originalname)) || (req.file.mimetype?.includes('video') ? '.mp4' : '.jpg');
    const filename = `cv_${Date.now()}${ext}`;
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, req.file.buffer);
    const mediaUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
    io.emit('media', { url: mediaUrl, type: req.file.mimetype || 'application/octet-stream' });
    return res.json(data);
  } catch (err) {
    console.error('CV series proxy error', err?.message || err);
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
let cumulativeVisitors = 0;

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Send initial data
  socket.emit('crowdUpdate', crowdData);
  
  // Simulate periodic updates
  const updateInterval = setInterval(() => {
    // Update crowd numbers
    const alerts = [];
    crowdData.zones.forEach(zone => {
      const change = Math.floor(Math.random() * 10) - 5;
      // count arrivals at entrance only for cumulative visitors
      if (zone.id === 'entrance' && change > 0) cumulativeVisitors += change;
      zone.current = Math.max(0, Math.min(zone.capacity, zone.current + change));
      if (zone.current >= zone.capacity) {
        alerts.push({ zone: zone.id, name: zone.name, current: zone.current, capacity: zone.capacity });
      }
    });
    
    // Update total visitors as cumulative arrivals
    crowdData.totalVisitors = cumulativeVisitors;
    
    // Emit update
    socket.emit('crowdUpdate', crowdData);
    // Emit alerts if any zone overcrowded
    if (alerts.length > 0) {
      io.emit('alert', { type: 'overcrowd', severity: 'high', payload: { zones: alerts } });
    }
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