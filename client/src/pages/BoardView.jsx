import {useState, useEffect} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {DndContext, closestCorners} from '@dnd-kit/core'
import useAuthStore from "../store/authStore"
import useBoardStore from "../store/boardStore.js";
import socket from "../socket/socket"
import {getBoard} from "../api/boards"
import {getColumns, createColumn} from "../api/columns"
import {getCards, moveCard as moveCardAPI} from "../api/cards"
import Column from "../components/Column";
import InviteModal from "../components/InviteModal";


export default function BoardView() {
    const {id} = useParams()
    const {token} = useAuthStore()
    const navigate = useNavigate()
    
    const {
        board, columns, cards,
        setBoard, setColumns, setCards,
        addCards, updateCard, removeCard, moveCard,
        addColumn, removeColumn
    } = useBoardStore()
    
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [newColTitle, setNewColTitle] = useState('')
    const [addingCol, setAddingCol] = useState(false)
    
    const [showInvite, setShowInvite] = useState(false)
    
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
        if(socket.connected) joinBoard()
        else {
            socket.connect()
            socket.once('connect', joinBoard)
        }
        
        socket.on('card-created', ({card}) => addCards(card))
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
    
    //Drag and Drop
    async function handleDragEnd(event){
        const { active, over } = event
        if(!over) return
        
        const cardId = active.id
        const fromColumnId = active.data.current?.columnId
        const toColumnId = over.data.current?.columnId ?? fromColumnId
        
        if (cardId === over.id && fromColumnId === toColumnId) return
        
        const destCards = cards
            .filter(c => c.columnId === toColumnId).sort((a,b) => a.order-b.order)
        
        const overIndex = destCards.findIndex(c => c._id === over.id)
        const newOrder = overIndex >= 0 ? overIndex : destCards.length
        
        moveCard(cardId, toColumnId, newOrder)
        
        try{
            await moveCardAPI(token, {cardId, fromColumnId, toColumnId, newOrder})
            socket.emit('card-moved', {boardId: id, cardId, fromColumnId, toColumnId, newOrder})
        }catch(err){
            console.log('Move failed', err)
            const cardsData = await getCards(token, id)
            setCards(cardsData)
        }
    }
    
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
                <button onClick={() => setShowInvite(true)} className="ml-auto text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">
                    + Invite
                </button>
            </header>

            {showInvite && (
                <InviteModal boardId={id}
                             token={token}
                             onClose={() => setShowInvite(false)}/>
            )}
            
            {/*Board */}
            <div className="flex-1 overflow-x-auto p-6">
                <DndContext collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}>
                <div className="flex gap-4 items-start">
                
                    {/*Columns*/}

                    {columns.map(column => (
                        <Column 
                            key={column._id} 
                            column={column}
                            cards={getColumnCards(column._id)}
                            boardId={id}
                            token={token}
                            onAddCard={(card) => {
                                addCards(card)
                                socket.emit('card-created', {boardId: id, card})
                            }}/>
                    ))}
                    
                    <div className="bg-white rounded-xl border border-gray-200 w-72 shrink-0 p-3">
                        <form onSubmit={handleAddColumn} className="flex flex-col gap-2">
                            <input type="text"
                            value={newColTitle}
                            onChange={e => setNewColTitle(e.target.value)}
                            placeholder="Add a column.."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus: ring-indigo-500"/>
                            <button
                                type="submit"
                                disabled={addingCol || !newColTitle.trim()}
                                className="bg-indigo-700 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-900 disabled:opacity-50 transition-colors"
                            >
                                {addingCol ? 'Adding...' : 'Add Column'}
                            </button>
                        </form>
                    </div>
                            
                            
            </div>
                </DndContext>
        </div>
        </div>
    )
}