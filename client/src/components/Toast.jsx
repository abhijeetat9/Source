import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import useNotificationStore from '../store/notificationStore'

function ToastItem({notification}) {
    const removeNotification = useNotificationStore(state => state.removeNotification)
    const navigate = useNavigate()
    
    useEffect(() => {
        const timer = setTimeout(() => {
            removeNotification(notification.id)
        }, 5000)
        return () => clearTimeout(timer)
    }, [notification])
    
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 flex items-start gap-3 w-80">
            <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">Send Invite</p>
                <p className="text-sm text-gray-500 mt-0.5">You were invited to<span className="font-medium text-indigo-600">{notification.boardTitle}</span></p>
            </div>
            <div className="flex flex-col gap-2 items-end">
                <button onClick={() => removeNotification(notification.id)}
                className="text-gray-300 hover:text-gray-500 text-xs">
                    x
                </button>
                <button onClick={() => { navigate(`/boards/${notification.boardId}`)
                    removeNotification(notification.id)
                }} className="text-xs text-indigo-600 font-medium hover:underline">
                    Open
                </button>
            </div>
        </div>
    )
}

export default function Toast() {
    const notifications = useNotificationStore(state => state.notifications)
    
    if(notifications.length === 0) return null
    
    return (
        <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
            {notifications.map(n => (
                <ToastItem key={n.id} notification={n}/>
            ))}
        </div>
    )
}