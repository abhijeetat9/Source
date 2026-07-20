const {io} = require('socket.io-client');
require('dotenv').config({ path: './server/.env' })

const TOKEN = process.env.TOKEN;
const BOARD_ID = '6a5ac8433b1395167363c10a'

const client1 = io('http://localhost:6000')
const client2 = io('http://localhost:6000')

client1.on('connect', () => {
    console.log('Client connected!', client1.id)

    client1.emit('join-board', {boardId: BOARD_ID, token: TOKEN})
    
    client1.on('card-moved', (data) => {
    console.log('Client 1 received card-moved: ', data)
})
    client1.on('user-joined', (data) => {
    console.log('Client 1 sees user joined:', data)
})
})

client2.on('connect', () => {
    console.log('Client 2 connected:', client2.id)

    // Join the board room
    client2.emit('join-board', { boardId: BOARD_ID, token: TOKEN })

    // After 1 second — emit a card-moved event
    setTimeout(() => {
        console.log('Client 2 emitting card-moved...')
        client2.emit('card-moved', {
            boardId:      BOARD_ID,
            cardId:       '6a5c1ba9dbd0d4d03566562a',
            fromColumnId: '6a5acb3a243094f2427b4c14',
            toColumnId:   '6a5acb45243094f2427b4c15',
            newOrder:     0,
        })
    }, 1000)
})

setTimeout(() => {
    console.log('Disconnecting...')
    client1.disconnect()
    client2.disconnect()
    process.exit(0)
}, 3000)
