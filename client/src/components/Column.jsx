import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable'
import SortableCard from './SortableCard'
import AddCardInLine from './AddCardInLine'

export default function Column({column, cards, boardId, token, onAddCard}) {
    return (
<div className="bg-white rounded-xl border border-gray-200 w-72 shrink-0 flex flex-col">
            
    {/*HEADER*/}
            
    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 text-sm">{column.title}</h3>
        <span className="text-xs text-gray-400">{cards.length}</span>
    </div>
        
    {/*CARDS*/}
    
    <SortableContext
    items={cards.map(c=> c._id)}
    strategy={verticalListSortingStrategy}>
        <div className="p-3 flex flex-col gap-2 flex-1 min-h-16">
            {cards.map(card => (
                <SortableCard 
                key = {card._id}
                card = {card}
                columnId = {column._id}
                />
            ))}
        </div>
    </SortableContext>
            
    {/*Add card*/}
            
    <AddCardInLine
    columnId={column._id}
    boardId={boardId}
    token={token}
    onAdd={onAddCard}/>
</div>
    )
}