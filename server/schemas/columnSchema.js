const {z} = require('zod');

const createColumnSchema = z.object({
    title: z.string().min(1, 'Title is required').trim(),
    boardId: z.string().min(1, 'Board ID is required'),
})

const updateColumnSchema = z.object({
    title: z.string().min(1, 'Title is required').trim(),
})

const reorderColumnSchema = z.object({
    columns: z.array(
        z.object({
            _id: z.string(),
            order: z.number(),
        })
    ),
})

module.exports = {createColumnSchema, updateColumnSchema, reorderColumnSchema};