const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://abhijeettawde95:QBAJ9CHKIOVekuST@testcluster.vvonavf.mongodb.net/todos");

const todoSchema = new mongoose.Schema({
    title: String,
    description: String,
    completed: Boolean,
})

const todo = mongoose.model('Todos', todoSchema);

module.exports = {
    todo
};
