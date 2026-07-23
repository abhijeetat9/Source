import {create} from 'zustand';

const useBoardStore = create((set,get) => ({
    board: null,
    columns: [],
    cards: [],
    
    setBoard: (board) => set({board}),
    setColumns: (columns) => set({columns}),
    setCards: (cards) => set({cards}),
    
    addCard: (card) => set((state) => ({
        cards: [...state.cards, card],
    })),
    
    updateCard: (updatedCard) => set((state) => ({
        cards: state.cards.map(c => c._id === updatedCard._id ? updatedCard : c),
    })),
    
    removeCard: (cardId) => set((state) => ({
        cards: state.cards.filter(c => c._id !== cardId)
    })),
    
    moveCard: (cardId, toColumnId, newOrder) => set((state) => ({
        cards: state.cards.map(c =>
        c._id === cardId ? { ...c, columnId: toColumnId, order: newOrder } 
            : c
        )
    })),
    
    addColumn: (column) => set((state) => ({
        columns: [...state.columns, column],
    })),
    
    removeColumn: (columnId) => set((state) => ({
        columns: state.columns.filter(c => c._id !== columnId)
    }))
}))

export default useBoardStore;