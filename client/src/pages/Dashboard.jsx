import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import useAuthStore from "../store/authStore"
import socket from "../socket/socket"
import {getBoards, createBoard} from "../api/boards"
import Toast from "../components/Toast"
import useNotificationStore from "../store/notificationStore.js";
export default function Dashboard() {
    
    const {token, user, logout} = useAuthStore()
    const navigate = useNavigate()
    
    const [boards, setBoards] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [newTitle, setNewTitle] = useState('')
    const [creating, setCreating] = useState(false)
    const addNotification = useNotificationStore(state => state.addNotification)

    useEffect(() => {
        socket.on('board-invite', ({board}) => {
            console.log('board-invite', board)
            addNotification({
                boardId: board._id,
                boardTitle: board.title,
            })
            
            setBoards(prev => {
            const exists = prev.find(b => b._id === board._id)
        if (exists) return prev
        return [board, ...prev]
        })
    })
        return () =>{
            socket.off('board-invite')
        }
    }, [])
    
    useEffect(() => {
        async function load() {
            try{
                const data = await getBoards(token)
                setBoards(data)
            }catch(error){
                console.log(error)
                setError('Failed to load boards')
            }finally{
                setLoading(false)
            }
        }
        load()
    }, [token]);
    
    async function handleCreate(e){
        e.preventDefault()
        if(!newTitle.trim())return
        setCreating(true)
        try {
            const board = await createBoard(token, {title: newTitle})
            setBoards(prev => [board, ...prev])
            setNewTitle('')
        }catch(error){
            setError('Failed to create board')
        }finally{
            setCreating(false)
        }
    }
    
    function handleLogout(){
        socket.disconnect()
        logout()
        navigate('/login')
    }
    
    if(loading) return(
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading boards...</p>
    </div>
    )
    
    return (
        <div className="min-h-screen bg-gray-50">
            {/*HEADER*/}
            <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-900">Collab Tool</h1>
                <div className="flex items-center gap-4">
                    <span className="text-lg text-gray-500">{user?.name}</span>
                    <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-medium">Logout</button>
                </div>
            </header>
            
            <main className="max-w-6xl mx-auto px-8 py-8">
                {/*Board Creation*/}
                <form onSubmit={handleCreate} className="flex gap-3 mb-8">
                    <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="New board name..." className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"></input>
                    <button type="submit" disabled={creating || !newTitle.trim()} className="bg-indigo-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-900 disabled:opacity-50 transition-colors">{creating ? 'Creating...' : '+ New Board'}
                    </button>
                </form>

                {error && (<div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-6">{error}</div>)}
                
                {/*Boards grid*/}

                {boards.length === 0 ? (
                    <div className="text-center py-24 text-gray-400">
                        <p className="text-lg">No boards yet</p>
                        <p className="text-sm mt-1">Create your first board above</p>
                    </div>
                ): (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {boards.map(board => (
                        <div key={board._id} 
                             onClick={() => navigate(`/boards/${board._id}`)} className="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all">
                            <h3 className="font-semibold text-gray-900 text-lg mb-2">{board.title}</h3>
                            <div className="flex items-center justify-center">
                                <span className="text-xs text-gray-400">
                                    {new Date(board.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>)}
            </main>
            <Toast/>
        </div>
    )
}