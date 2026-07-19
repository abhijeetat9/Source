const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Card title is required'],
        trim: true,
    },
    description: {
        type: String,
        default: '',
    },
    columnId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Column',
        required: true,
    },
    boardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
    assignee:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    order:{
        type: Number,
        default: 0,
    },
},
    {timestamps: true}
)

module.exports = mongoose.model('Card', cardSchema)