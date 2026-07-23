import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import {deleteCard} from '../api/cards'
export default function SortableCard({card, columnId ,token, onDelete}) {
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
        zIndex: isDragging ? 999 : 'auto',
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
        <div ref={setNodeRef}
        style={style} {...attributes} 
        className="group bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 active:cursor-grabbing hover:border-indigo-300 shadow-sm">
            <span {...listeners} className="flex-1 active:cursor-grabbing">{card.title}</span>
            <button onClick={handleDelete} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 text-xs ml-2 transition-all">x
            </button>
        </div>
    )
}