require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');
const connectDB = require('./db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {origin: 'http://localhost:5173', methods: ['GET', 'POST']}
})
const PORT = process.env.PORT || 6000;

connectDB()

app.use(cors())
app.use(express.json())

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const boardRoutes = require('./routes/boards');
app.use('/api/boards', boardRoutes);

app.get('/', (req, res) => {
    res.json({message: 'Collab tool API is online'});
})

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    })
})

server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})

module.exports = { io }
