const express = require('express');
const Card = require('../models/Card');
const Board = require('../models/Board');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const {createCardSchema,updateCardSchema,moveCardSchema} = require('../schemas/cardSchema');
const checkBoardAccess = require('../utils/boardAccess');

const router = express.Router();

router.use(auth);

router.get('/board/:boardId', async (req, res) => {
    try{
        const board = await checkBoardAccess(req.params.boardId, req.userId);
        if (!board) return res.status(403).json({error: 'Access Denied'});
        
        const card = await Card.find({boardId: req.params.boardId}).populate('assignee', 'name email avatar').sort({order: 1})
        
        res.json(card)
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

router.get('/:id', async (req, res) => {
    try{
        const card = await Card.findById(req.params.id).populate('assignee', 'name email avatar')
        
        if(!card) return res.status(403).json({error: 'Access Denied'});
        res.json(card)
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

router.post('/', validate(createCardSchema), async (req, res) => {
    try{
        const {title, columnId, boardId, description} = req.body;
        
        const board = await checkBoardAccess(boardId, req.userId);
        if (!board) return res.status(403).json({error: 'Access Denied'});
        
        const count = await Card.countDocuments({columnId});
        const card = await Card.create({
            title, columnId, boardId, description, order: count
        })
        
        res.status(201).json(card)
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

router.patch('/move', validate(moveCardSchema), async (req, res) => {
    try{
        const { cardId, fromColumnId, toColumnId, newOrder } = req.body;

        const card = await Card.findById(cardId);
        if(!card) return res.status(404).json({error: 'Access Denied'});

        const board = await checkBoardAccess(card.boardId, req.userId);
        if (!board) return res.status(403).json({error: 'Access Denied'});

        if(fromColumnId !== toColumnId){
            const oldColumnCards = await Card.find({ columnId:fromColumnId }).sort({order:1})

            await Promise.all(
                oldColumnCards
                    .filter(c => c._id.toString() !== cardId)
                    .map((c , i) => Card.findByIdAndUpdate(c._id, {order:1}))
            )
        }
        const newColumnCards = await Card.find({
            columnId:toColumnId,
            _id: { $ne: cardId}
        }).sort({order:1})

        await Promise.all(
            newColumnCards.map((c, i) => {
                const order = i >= newOrder ? i + 1 : 1
                return Card.findByIdAndUpdate(c._id, {order})
            })
        )

        card.columnId = toColumnId
        card.order = newOrder
        await card.save();

        res.json(card)
    }catch(err) {
        res.status(500).json({error: err.message})
    }
})

router.patch('/:id', validate(updateCardSchema), async (req, res) => {
    try{
        const card = await Card.findById(req.params.id)
        if(!card) return res.status(404).json({error: 'Access Denied'});
        
        const board = await checkBoardAccess(card.boardId, req.userId)
        if (!board) return res.status(403).json({error: 'Access Denied'});
        
        Object.assign(card, req.body)
        await card.save();
        
        await card.populate('assignee', 'name email avatar')
        res.json(card)
    }catch(err){
        res.status(400).json({error: err.message});
    }
})

router.delete('/:id', async (req, res) => {
    try{
        const card = await Card.findById(req.params.id)
        if(!card) return res.status(404).json({error: 'Access Denied'});
        
        const board = await checkBoardAccess(card.boardId, req.userId);
        if (!board) return res.status(403).json({error: 'Access Denied'});
        
        await Card.findByIdAndDelete(req.params.id)
        res.status(204).send()
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

module.exports = router;