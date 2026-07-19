const {z} = require('zod');

const createCardSchema = z.object({
    title: z.string().min(1, 'Title is required').trim(),
    columnId: z.string().min(1, 'ColumnId is required'),
    boardId: z.string().min(1, 'BoardId is required'),
    description: z.string().default('')
})

const updateCardSchema = z.object({
    title: z.string().min(1).trim().optional(),
    description: z.string().optional(),
    assignee: z.string().nullable().optional(),
}).partial()

const moveCardSchema = z.object({
    cardId: z.string().min(1),
    fromColumnId: z.string().min(1),
    toColumnId: z.string().min(1),
    newOrder: z.number()
})

module.exports = {createCardSchema,updateCardSchema,moveCardSchema};