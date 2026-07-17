const express = require('express');
const Board = require('../models/Board');
const User = require('../models/User');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const {createBoardSchema, updateBoardSchema, inviteMemberSchema} = require('../schemas/boardSchema');

const router = express.Router()

router.use(auth)

//GET ALL BOARDS - where user is owner or member
router.get('/', async (req, res) => {
    try{
        const boards = await Board.find(
            {
            $or: [
                {owner: req.userId},
                {members: req.userId},
            ]
        })
            .populate('owner', 'name email avatar')
            .populate('members', 'name email avatar')
            .sort({createdAt: -1})
        
        res.json(boards);
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

//GET SINGLE BOARD
router.get('/:id', async (req, res) => {
    try {
        const board = await Board.findById(req.params.id)
            .populate('owner', 'name email avatar')
            .populate('members', 'name email avatar')
        
        if(!board) return res.status(404).json({error: 'No board'});
        
        //check user is owner or member
        const isMember = board.members.some(m => m._id.toString() === req.userId) || board.owner._id.toString() === req.userId;
        
        if(!isMember) return res.status(403).json({error: 'Access denied'});
        
        res.json(board);
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

//CREATE BOARD
router.post('/', validate(createBoardSchema), async (req, res) => {
    try{
        const board = await Board.create({
            title: req.body.title,
            owner: req.userId,
            members: [],
        })
        
        await board.populate('owner', 'name email avatar')
        res.status(201).json(board);
    }catch(err){
        res.status(400).json({error: err.message});
    }
})

//UPDATE BOARD TITLE
router.patch('/:id', validate(updateBoardSchema), async (req, res) => {
    try{
        const board = await Board.findOneAndUpdate(
            {
                _id: req.params.id,
                owner: req.userId,
            },
            {title: req.body.title},
            {new: true, runValidators: true},
        ).populate('owner', 'name email avatar')
            .populate('members', 'name email avatar'
            )
        
        if(!board) return res.status(404).json({error: 'Board not found'});
        res.json(board);
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

//DELETE BOARD
router.delete('/:id', async (req, res) => {
    try{
        const board = await Board.findOneAndDelete({
        _id: req.params.id,
        owner: req.userId,})
        
        if(!board) return res.status(404).json({error: 'Board not found'});
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

// INVITE MEMBER BY EMAIL
router.post('/:id/members', validate(inviteMemberSchema), async (req, res) => {
    try {
        const board = await Board.findOne({_id: req.params.id, owner: req.userId })
        if (!board) return res.status(404).json({error: 'Board not found'});
        
        const invitee = await User.findOne({email: req.body.email})
        if(!invitee) return res.status(404).json({error: 'User not found'});
        
        if(board.members.includes(invitee._id)){
            return res.status(404).json({error: 'You already have a member'})
        }
        
        if(invitee._id.toString() === req.userId){
            return res.status(404).json({error: 'You already are the owner'})
        }
        
        board.members.push(invitee._id)
        await board.save()
        await board.populate('owner', 'name email avatar')
        await board.populate('members', 'name email avatar')
        
        res.json(board)
    }catch(err){
        res.status(500).json({error: err.message});
    }
})

module.exports = router;