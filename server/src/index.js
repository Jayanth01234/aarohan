const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

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