const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Column title is required'],
        trim: true,
    },
    
    boardId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
        required: true,
    },
    
    order:{
        type: Number,
        default: 0,
    }
},
    {timestamps: true}
)

module.exports = mongoose.model('Column', columnSchema);