const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    id: String,
    title: String,
    details: String,
    status: String,
    createdAt: Date,
    startedAt: Date,
    finishedAt: Date,
    createdBy: String
})

const Task = mongoose.model('User', taskSchema)

module.exports = Task