const mongoose = require('mongoose')
// const { mongo } = require('../../config/config')

const taskSchema = mongoose.Schema({
    name: String,
})

const Task = mongoose.model('User', taskSchema)

module.exports = Task