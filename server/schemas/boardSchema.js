const {z} = require("zod");

const createBoardSchema = z.object({
    title: z.string().min(1, 'Title is required').trim(),
})

const updateBoardSchema = z.object({
    title: z.string().min(1, 'Title is required').trim(),
})

const inviteMemberSchema = z.object({
    email: z.string().email('Invalid email address'),
})

module.exports = {createBoardSchema, updateBoardSchema, inviteMemberSchema}