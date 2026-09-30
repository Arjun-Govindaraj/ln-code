const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// 1. Middleware (Updated CORS for deployment compatibility)
app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));

// 2. Serve uploaded files statically (PDF, PPT, DOCX, TXT)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 3. Socket.IO Setup (Global Community Chat)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  socket.on('sendMessage', (data) => {
    io.emit('receiveMessage', data);
  });
});

// 4. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' Connected to MongoDB Atlas Cloud!'))
  .catch((err) => console.log('MongoDB Atlas Error:', err));

// 5. API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/quiz', require('./routes/quizRoutes'));

// 6. Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));