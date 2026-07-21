import {io} from 'socket.io-client'

const socket = io('http://localhost:6000', {
    autoConnect: false,
});

export default socket;