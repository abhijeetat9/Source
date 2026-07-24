import {useState} from "react";
import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import {deleteCard} from '../api/cards'
import CardModal from "./CardModal.jsx";
export default function SortableCard({card, columnId ,token, onDelete}) {
    const [showModal, setShowModal] = useState(false)
    
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: card._id,
        data: {columnId}
    })
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        position: 'relative',
        zIndex: isDragging ? 999 : 1,
    }
    async function handleDelete(e) {
        e.stopPropagation()
        try{
            await deleteCard(token, card._id)
            onDelete(card._id)
        }catch(err){
            console.error(err)
        }
    }
    
    return (
        <>
        <div ref={setNodeRef}
        style={style} {...attributes} 
        className="group bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 active:cursor-grabbing hover:border-indigo-300 shadow-sm flex items-center
         justify-between relative overflow-hidden">
            
            {/*Drag Handle + title - opens card modal*/}
            <span {...listeners} className="cursor-grabbing p-1 text-gray-300 hover:text-gray-400 shrink-0">
                ⠿</span>
            <span onClick={() => setShowModal(true)}
            className="flex-1 cursor-pointer">
                <span className="block font-medium">{card.title}</span>
                {card.description && (
                    <span className="block text-xs text-gray-400 mt-0.5 truncate">{card.description}
                    </span>
                )}
                {card.assignee && (
                    <span className="block text-xs text-indigo-500 mt-0.5">{card.assignee.name || 'Assigned'}
                    </span>
                )}
            </span>
            <button onClick={handleDelete} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 text-xs ml-2 transition-all shrink-0"
            title="Delete card">x
            </button>
        </div>

    {/*Card Modal*/}
    {showModal && (
    <CardModal card={card} token={token} onClose={() => setShowModal(false)}
    />
    )}
        </>
    )
}