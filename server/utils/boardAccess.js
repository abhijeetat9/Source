const Board = require('../models/Board')
async function checkBoardAccess(boardId, userId) {
    const board = await Board.findById(boardId)
    if (!board) return null
    const hasAccess = board.owner.toString() === userId ||
        board.members.map(m => m.toString()).includes(userId)
    return hasAccess ? board : null
}

module.exports = checkBoardAccess