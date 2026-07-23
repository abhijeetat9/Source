import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import BoardView from './pages/BoardView'
import ProtectedRoute from './components/ProtectedRoute'
import {useEffect} from 'react'
import useAuthStore from "./store/authStore.js";
import socket from "./socket/socket.js";

export default function App() {
    const token = useAuthStore(state => state.token)

    useEffect(() => {
        if (!token) return

        function registerSocket() {
            socket.emit('register', { token })
            console.log('Socket registered')
        }

        if (socket.connected) {
            registerSocket()
        } else {
            socket.connect()
            socket.once('connect', registerSocket)
        }
    }, [token])
    
    return (
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>}/>
            <Route path="/boards/:id" element={
                <ProtectedRoute><BoardView/></ProtectedRoute>
            }/>
            <Route path="*" element={<Navigate to="/login"/>}></Route>
        </Routes>
    )
}
