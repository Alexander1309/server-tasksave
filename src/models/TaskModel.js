const { model, Schema } = require('mongoose')

const TaskModel = new model('tasks', new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    subject: { type: String, required: true },
    createdBy: { type: String, required: true },
    createdOn: { type: Date, default: Date.now }
}))

module.exports = TaskModel