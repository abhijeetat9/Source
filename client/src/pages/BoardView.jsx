import {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import useAuthStore from "../store/authStore"
import socket from "../socket/socket"
import {getBoard} from "../api/boards"
import {getColumns, createColumn} from "../api/columns"
import {getCards, createCard} from "../api/cards"
import useBoardStore from "../store/boardStore";

export default function BoardView() {
    const {id} = useParams()
    const {token, user} = useAuthStore()
    const navigate = useNavigate()
    
    const {
        board, columns, cards,
        setBoard, setColumns, setCards,
        addCard, updateCard, removeCard, moveCard,
        addColumn, removeColumn
    } = useBoardStore()
    
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [newColTitle, setNewColTitle] = useState('')
    const [addingCol, setAddingCol] = useState(false)
    
    useEffect(() =>{
        async function load() {
            try {
                const [boardData, columnsData, cardsData] = await Promise.all([
                    getBoard(token, id),
                    getColumns(token, id),
                    getCards(token, id),
                ])
                setBoard(boardData)
                setColumns(columnsData)
                setCards(cardsData)
            }catch(err){
                setError('Failed to load board')
            }finally {
                setLoading(false)
            }
        }
        load()
    }, [id, token])
    
    useEffect(() => {
        function joinBoard() {
            socket.emit('join-board', {boardId: id, token})
            console.log('Emitting join-board for', id)
        }
        if(socket.connected){
            joinBoard()
        }else {
            socket.connect()
            socket.once('connect', joinBoard)
        }
        
        socket.on('card-created', ({card}) => addCard(card))
        socket.on('card-updated', ({card}) => updateCard(card))
        socket.on('card-deleted', ({card}) => removeCard(card))
        socket.on('card-moved', ({cardId, toColumnId, newOrder}) => moveCard(cardId, toColumnId, newOrder))
        socket.on('column-created', ({column}) => addColumn(column))
        socket.on('column-deleted', ({columnId}) => removeColumn(columnId))
        
        return () => {
            socket.emit('leave-board', {boardId: id})
            socket.off('card-created')
            socket.off('card-updated')
            socket.off('card-deleted')
            socket.off('card-moved')
            socket.off('column-created')
            socket.off('column-deleted')
        }
    }, [id, token])
    
    //Add column
    async function handleAddColumn(e) {
        e.preventDefault()
        if(!newColTitle.trim()) return
        setAddingCol(true)
        try{
            const response = await createColumn(token, {title: newColTitle, boardId: id})
            const column = response.column ?? response
            addColumn(column)
            socket.emit('column-created', {boardId: id, column})
            setNewColTitle('')
        }catch(err){
            setError('Failed to create column')
        }finally {
            setAddingCol(false)
        }
    }
    
    function getColumnCards(columnId){
        return cards
            .filter(c => c.columnId === columnId)
            .sort((a,b) => a.order - b.order)
    }
    
    if(loading) return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">Loading board...</p>
        </div>
    )
    
    if(error) return (
        <div className="min-h-screen bg-red-100 flex items-center justify-center">
            <p className="text-red-500">{error}</p>
        </div>
    )
    
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/*HEADER*/}
            <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 shrink-0">
                <button 
                    onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-gray-600 text-sm">Back</button>
                <h1 className="text-lg font-bold text-gray-900">{board?.title}</h1>
            </header>
            
            {/*Board -horizontal scroll*/}
            <div className="flex-1 overflow-x-auto p-6">
                <div className="flex gap-4 h-full items-start">
                    
                    {/*Columns*/}

                    {columns.map(column => (
                        <div 
                            key={column._id} 
                             className="bg-white rounded-xl border border-gray-100 flex items-center justify-between">
                            
                            {/* Column header */}
                            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-800">{column.title}
                            <span className="text-xs text-gray-400">{getColumnCards(column._id).length}</span></h3>
                        </div>

                    {/* Cards */}
                        <div className="p-3 flex flex-col gap-2 flex-1">
                            {getColumnCards(column._id).map(card => (
                                <div key={card._id} 
                                     className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 cursor-pointer hover:border-indigo-300 hover:bg-white transition-all">
                                    {card.title}
                                </div>
                            ))}
                        </div>

                            {/* Add card — stub for now */}  
                            <AddCardInline columnId={column._id}
                            boardId={id}
                            token={token}
                            onAdd={(card) => {
                                addCard(card)
                                socket.emit('card-created', {boardId: id, card})
                            }}
                            />
                </div>
                        ))}

                    {/* Add column */}
                    <div className="bg-white rounded-xl border border-gray-200 w-72 shrink-0 flex flex-col">
                        <form onSubmit={handleAddColumn} className="flex flex-col gap-2">
                            <input type="text"
                            value={newColTitle}
                            onChange={e => setNewColTitle(e.target.value)}
                                   placeholder="Add a column..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus: ring-indigo-500"/>
                            <button type="submit"
                            disabled={addingCol || !newColTitle.trim()}
                            className="bg-indigo-700 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-900 disabled:opacity-50 transition-colors">
                                {addingCol ? 'Adding Column...' : 'Add Column'}
                            </button>
                        </form>
                    </div>
            </div>
        </div>
        </div>
    )
}

function AddCardInline({columnId, boardId, token, onAdd}) {
    const [title, setTitle] = useState('')
    const [adding, setAdding] = useState(false)
    const [open, setOpen] = useState(false)
    
    async function handleSubmit(e) {
        e.preventDefault()
        if(!title.trim()) return
        setAdding(true)
        try {
            const card = await createCard(token, {title, columnId, boardId})
            onAdd(card)
            setTitle('')
            setOpen(false)
        }catch(err){
            console.log(err)
        }finally {
            setAdding(false)
        }
    }
    
    if(!open) return (
        <button onClick={() => setOpen(true)} 
                className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-b-xl transition-colors">
            + Add Card
        </button>
    )
    
    return (
        <form onSubmit={handleSubmit} className="p-3 border-t border-gray-100">
            <input type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Card title..."
            autoFocus
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"/>
            <div className="flex gap-2">
                <button type="submit"
                disabled={adding || !title.trim()}
                className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-indigo-700 disabled:opacity-50">
                    {adding ? 'Adding...' : 'Add'}
                </button>
                <button type="button"
                onClick={() => {setOpen(false); setTitle('') }}
                className="text-gray-400 hover:text-gray-600 text-xs px-2">
                    Cancel
                </button>
            </div>
        </form>
    )
}