const router = require('express').Router()
const TaskModel = require('../models/TaskModel')
const { verifyToken } = require('../lib/functions')

router.get('/getTasks', verifyToken, async (req, res) => {
    const { id } = req.user
    const getTasks = await TaskModel.find({createdBy: id}).exec()
    res.json(getTasks)
})

router.post('/createTask', verifyToken, async (req, res) => {
    const { title, description, subject } = req.body
    const { id } = req.user

    const newTask = new TaskModel({
        title,
        description,
        subject,
        createdBy: id,
    })

    try {
        await newTask.save()
        res.json({server: 'taskCreated'})
    } catch (e) {
        res.json({server: 'taskNotCreated'})
    }
})

router.put('/updateTask/:idTask', verifyToken, async (req, res) => {
    const { title, description, subject } = req.body
    const { id } = req.user
    const { idTask } = req.params
    const getTask = await TaskModel.findOne({_id: idTask}).exec()
    if(getTask === null || getTask.createdBy !== id) res.json({server: 'TaskNotExist'})
    else {
        const updateTask = await TaskModel.updateOne({_id: idTask}, {title, description, subject}).exec()
        if(updateTask.modifiedCount) res.json({server: 'updatedTask'})
        else res.json({server: 'taskNotUpdated'})
    }
})

router.delete('/deleteTask/:idTask', verifyToken, async (req, res) => {
    const { id } = req.user
    const { idTask } = req.params
    const getTask = await TaskModel.findOne({_id: idTask}).exec()
    if(getTask === null || getTask.createdBy !== id) res.json({server: 'TaskNotExist'})
    else {
        const deleteTask = await TaskModel.deleteOne({_id: idTask}).exec()
        if(deleteTask.deletedCount) res.json({server: 'taskEliminated'})
        else res.json({server: 'taskNotEliminated'})
    }
})

module.exports = router