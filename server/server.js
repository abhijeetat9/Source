require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const http = require('http');
const {Server} = require('socket.io');
const connectDB = require('./db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']},
    credentials: false
})
module.exports.io = io

const userSockets = new Map()
module.exports.userSockets = userSockets

const PORT = process.env.PORT || 8000;

connectDB()

app.use(cors())
app.use(express.json())

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const boardRoutes = require('./routes/boards');
app.use('/api/boards', boardRoutes);

const columnRoutes = require('./routes/columns');
app.use('/api/columns', columnRoutes);

const cardRoutes = require('./routes/cards');
app.use('/api/cards', cardRoutes);

app.get('/', (req, res) => {
    res.json({message: 'Collab tool API is online'});
})

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    socket.on('register', ({token}) => {
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId= decoded.userId
            userSockets.set(decoded.userId.toString(), socket.id)
            console.log(`User ${decoded.userId} registered socket ${socket.id}`)
        }catch(err){
            console.log('invalid token on register')
        }
    })
    
    socket.on('join-board', ({boardId, token}) => {
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            socket.userId = decoded.userId;
            userSockets.set(decoded.userId.toString(), socket.id)
            socket.join(boardId)
            console.log(`User ${decoded.userId} has joined the board ${boardId}`)
            console.log(`Room members:`, io.sockets.adapter.rooms.get(boardId)?.size)
            
            socket.to(boardId).emit('user-joined', {
                userId: decoded.userId,
                boardId
            })
        }catch(err){
            socket.emit('error', {message: 'Invalid Token'});
        }
    })
    
    socket.on('leave-board', ({boardId}) => {
            socket.leave(boardId);
            socket.to(boardId).emit('user-left', {
                userId: socket.userId,
                boardId
            })
            console.log(`User ${socket.userId} has left the board ${boardId}`)
    })
    
    socket.on('card-moved', ({boardId, cardId, fromColumnId, toColumnId, newOrder}) => {
        socket.to(boardId).emit('card-moved', {
            cardId,
            fromColumnId,
            toColumnId,
            newOrder
        })
    })
    
    socket.on('card-created', ({boardId, card}) => {
        socket.to(boardId).emit('card-created', {card})
    })
    
    socket.on('card-updated', ({boardId, card}) => {
        socket.to(boardId).emit('card-updated', {card})
    })
    
    socket.on('card-deleted', ({boardId, cardId}) => {
        socket.to(boardId).emit('card-deleted', {cardId})
    })
    
    socket.on('column-created', ({boardId, column}) => {
        socket.to(boardId).emit('column-created', {column})
    })
    
    socket.on('column-updated', ({boardId, column}) => {
        socket.to(boardId).emit('column-updated', {column})
    })
    
    socket.on('column-deleted', ({boardId, columnId}) => {
        console.log('column-created received, broadcasting to room:', boardId)
        socket.to(boardId).emit('column-deleted', {columnId})
    })
    
    socket.on('disconnect', () => {
        if(socket.userId){
            userSockets.delete(socket.userId.toString())
        }
        console.log(`Client disconnected ${socket.id}`)
    })
})


server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})

module.exports = { io, userSockets }
