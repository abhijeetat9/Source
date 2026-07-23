import {useState} from 'react'
import {inviteMembers} from "../api/boards"

export default function InviteModal({boardId, token, onClose}) {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    
    async function handleSubmit(e) {
        e.preventDefault()
        if(!email.trim()) return
        setLoading(true)
        setError(null)
        try{
            await inviteMembers(token, boardId, email)
            setEmail('')
            onClose()
        }catch(err){
            setError(err.error || 'Failed to invite member')
        }finally{
            setLoading(false)
        }
    }
    
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Invite to board</h2>
                <form onSubmit={handleSubmit}
                className="space-y-4">
                    <input type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter email address.."
                    required
                    autoFocus
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-indigo-500"/>
                    
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    
                    <div className="flex gap-3 justify-end">
                        <button type="button"
                        onClick={onClose}
                        className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5">Cancel
                        </button>
                        <button type="submit"
                        disabled={loading || !email.trim()}
                        className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">{loading ? 'Inviting...' : 'Send Invite'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}