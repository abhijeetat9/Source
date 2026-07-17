const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { registerUserSchema, loginUserSchema } = require('../schemas/userSchema');

const router = express.Router();

//REGISTER
router.post('/register', validate(registerUserSchema), async (req, res) => {
    try{
        const {name, email, password} = req.body
        
        const existing = await User.findOne({email})
        if(existing){
            return res.status(400).send({error: 'Email already exists'})
        }
        
        const hashed = await bcrypt.hash(password, 12)
        const user = await User.create({name, email, password: hashed})
        
        const token = jwt.sign(
            {userId: user._id}, 
            process.env.JWT_SECRET, 
            {expiresIn: '7d'})
        
        res.status(201).json({
            token,
        user: {id: user._id, name: user.name, email: user.email, avatar: user.avatar}
        })
    }catch(err){
        res.status(500).send({error: err.message})
    }
})

//LOGIN
router.post('/login', validate(loginUserSchema), async (req, res) => {
    try{
        const {email, password} = req.body;
        
        const user = await User.findOne({email})
        if(!user){
            return res.status(401).send({error: 'Invalid email or password'})
        }
        
        const match = await bcrypt.compare(password, user.password)
        if(!match){
            return res.status(401).send({error: 'Invalid password'})
        }
        
        const token = jwt.sign(
            { userId: user._id},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        )
        
        res.json({
            token,
            user: {id: user._id, name: user.name, email: user.email, avatar: user.avatar}
        })
    }catch(err){
        res.status(500).send({error: err.message})
    }
})

//GET CURRENT USER - new endpoint

router.get('/me', auth, async (req, res) => {
    try{
        const user = await User.findById(req.userId).select('-password')
        if(!user) return res.status(404).json({error: 'User not found'})
        res.json(user)
    }catch(err){
        res.status(500).send({error: err.message})
    }
})

module.exports = router;