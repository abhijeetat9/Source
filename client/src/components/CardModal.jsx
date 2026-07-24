import {useState} from 'react'
import {updateCard} from "../api/cards.js";
import useBoardStore from "../store/boardStore.js";

export default function CardModal({card, token, onClose}) {
    const {board, updateCard: updateCardStore} = useBoardStore()
    
    const [title, setTitle] = useState(card.title)
    const [description, setDescription] = useState(card.description || '')
    const [assignee, setAssignee] = useState(card.assignee?._id || card.assignee || '')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    
    async function handleSave(){
        setSaving(true)
        setError(null)
        try{
            const updated = await updateCard(token, card._id, {
                title,
                description,
                assignee: assignee || null,
            })
            updateCardStore(updated)
            onClose()
        }catch(err){
            setError(err.error || 'Failed to save')
        }finally {
            setSaving(false)
        }
    }
    
    const members = [
        board?.owner,
        ...(board?.members || [])
    ].filter(Boolean)
    
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-100">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl">

                {/*HEADER*/}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Card Detail</h2>
                    <button onClick={handleSave}
                    className="text-gray-400 hover:text-gray-600">
                        x
                    </button>
                </div>

                <div className="space-y-4">
                    
                    {/*TITLE*/}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                    </div>

                    {/*DESCRIPTION*/}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description
                        </label>
                        <textarea value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={4}
                    placeholder="Add a description.."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/> 
                    </div>
                    
                    {/*ASSIGNEE*/}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Assignee
                        </label>
                        <select value={assignee}
                        onChange={e => setAssignee(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="">Unassigned</option>
                            {members.map(member => (
                                <option key={member._id} value={member._id}>
                                    {member.name} ({member.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}
                </div>

                {/*ACTIONS*/}
                <div className="flex gap-3 justify-end mt-6">
                    <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2">
                        Cancel
                    </button>
                    <button onClick={handleSave}
                    disabled={saving || !title.trim()} className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">{saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    )
}