import {useState} from 'react'
import {createCard} from "../api/cards"

export default function AddCardInline({columnId, boardId, token, onAdd}) {
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