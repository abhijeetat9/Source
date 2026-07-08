const mongoose = require("mongoose");
const express = require("express");
const useMiddleware = require("../middleware");
const { Account } = require("../db");

const router = express.Router();

router.get("/balance", useMiddleware, async (req, res) => {
    const account = await Account.findOne({ userID: req.userId });
    res.json({ balance: account.balance });
});

router.post("/transfer", useMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, to } = req.body;

        const account = await Account.findOne({ userID: req.userId }).session(session);
        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        const toAccount = await Account.findOne({ userID: to }).session(session);
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid account" });
        }

        await Account.updateOne({ userID: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userID: to }, { $inc: { balance: amount } }).session(session);

        await session.commitTransaction();
        res.json({ message: "Successfully transferred" });
    } finally {
        session.endSession();
    }
});

module.exports = router;
