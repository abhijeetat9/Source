import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'

export default function SortableCard({card, columnId}) {
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
    
    return (
        <div ref={setNodeRef}
        style={style} {...attributes} {...listeners}
        className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 active:cursor-grabbing hover:border-indigo-300 shadow-sm">
            {card.title}
        </div>
    )
}