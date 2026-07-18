const express = require('express');
const Column = require('../models/Column');
const Board = require('../models/Board');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const {createColumnSchema, updateColumnSchema, reorderColumnSchema} = require('../schemas/columnSchema');

const router = express.Router();

router.use(auth);

async function checkBoardAccess(boardId, userId){
    const board = await Board.findById(boardId)
    if(!board) return null;
    
    const hasAccess = board.owner.toString() === userId || board.members.map(m => m.toString()).includes(userId)
    
    return hasAccess ? board: null;
}

router.post('/', validate(createColumnSchema), async (req, res) => {
    try{
        const {title, boardId} = req.body;
        const board = await checkBoardAccess(boardId, req.userId);
        if(!board) return res.status(403).json({error: 'Board not found'});
        
        const count = await Column.countDocuments({boardId})
        
        const column = await Column.create({title, boardId, order: count});
        res.status(201).json({column})
    }catch(err){
        res.status(400).json({error: err.message});
    }
})

router.get('/board/:boardId', async (req, res) => {
    try{
        const board = await checkBoardAccess(req.params.boardId, req.userId);
        if(!board) return res.status(403).json({error: 'Board not found'});
        
        const columns = await Column.find({boardId: req.params.boardId}).sort({order: 1})
        
        res.json(columns);
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

router.patch('/reorder', validate(reorderColumnSchema), async (req, res) => {
    try {
        const {columns} = req.body;

        await Promise.all(
            columns.map(({_id, order}) => Column.findByIdAndUpdate(_id, {order})
            )
        )
        res.json({message: 'Columns Reordered'});
    }catch(err){
        res.status(400).json({error: err.message});
    }
})

router.patch('/:id', validate(updateColumnSchema), async (req, res) => {
    try{
        const column = await Column.findById(req.params.id)
        if(!column) return res.status(404).json({error: 'Column not found'});
        
        const board = await checkBoardAccess(column.boardId, req.userId);
        if(!board) return res.status(403).json({error: 'Access Denied'});
        
        column.title = req.body.title;
        await column.save();
        
        res.json(column);
    }catch(err){
        res.status(400).json({error: err.message});
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const column = await Column.findById(req.params.id)
        if(!column) return res.status(404).json({error: 'Column not found'});
        
        const board = await checkBoardAccess(column.boardId, req.userId);
        if(!board) return res.status(403).json({error: 'Access Denied'});
        
        await Column.findByIdAndDelete(req.params.id)
        res.status(204).send()
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

module.exports = router;