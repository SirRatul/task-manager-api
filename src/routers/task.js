const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

/* router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try{
        await task.save()
        res.status(201).send(task)
    } catch(error){
        res.status(400).send(error)
    }
    /* task.save().then(() => {
        res.status(201).send(task)
    }).catch((error) => {
        res.status(400).send(error)
    }) *//* 
}) */

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    } catch(error){
        res.status(400).send(error)
    }
})

/* router.get('/tasks', async (req, res) => {
    try{
        const tasks = await Task.find({})
        res.send(tasks)
    } catch(error){
        res.status(500).send(error)
    }
    /* Task.find({}).then((tasks) => {
        res.send(tasks)
    }).catch((error) => {
        res.status(500).send(error)
    }) *//* 
}) */ 

/* router.get('/tasks', auth, async (req, res) => {
    try{
        /* const tasks = await Task.find({owner: req.user._id})
        res.send(tasks) */
        /* await req.user.populate('tasks').execPopulate()
        res.send(req.user.tasks)
    } catch(error){
        res.status(500).send(error)
    }
}) */ 

// GET /tasks?completed=true
/* router.get('/tasks', auth, async (req, res) => {
    const match = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    try{
        await req.user.populate({
            path: 'tasks',
            match
        }).execPopulate()
        res.send(req.user.tasks)
    } catch(error){
        res.status(500).send(error)
    }
}) */

// GET /tasks?limit=10&skip=20
/* router.get('/tasks', auth, async (req, res) => {
    const match = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip)
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch(error){
        res.status(500).send(error)
    }
}) */

// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                /* sort: {
                    // createdAt: 1 //asc
                    // createdAt: -1 //desc
                    // completed: -1 //true
                    completed: 1 //false
                } */
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch(error){
        res.status(500).send(error)
    }
})

/* router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try{
        const task = await Task.findById(_id)
        if(!task){
            return res.status(404).send('Task not found')
        }
        res.send(task)
    } catch(error){
        res.status(404).send(error)
    }
    /* Task.findById(_id).then((task) => {
        if(!task){
            return res.status(404).send('Task not found')
        }
        res.send(task)
    }).catch((error) => {
        res.status(404).send(error)
    }) */ /* 
}) */

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try{
        // const task = await Task.findById(_id)
        const task = await Task.findOne({_id, owner: req.user._id})
        if(!task){
            return res.status(404).send('Task not found')
        }
        res.send(task)
    } catch(error){
        res.status(404).send(error)
    }
})

/* router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(404).send('Invalid update') 
    }
    try{
        const task = await Task.findById(req.params.id)

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        /* const task = await Task.findByIdAndUpdate(req.params.id,req.body, {
            new: true, 
            runValidators: true
        }) */
        /* if(!task){
            return res.status(404).send('Task not update')
        }
        res.send(task)
    } catch(error){
        res.status(404).send(error)
    }
}) */ 

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(404).send('Invalid update') 
    }
    try{
        // const task = await Task.findById(req.params.id)
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        if(!task){
            return res.status(404).send('Task not update')
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch(error){
        res.status(404).send(error)
    }
})

/* router.delete('/tasks/:id', async (req, res) => {
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send('Task not found')
        }
        res.send('Deleted Successfully') 
    } catch(error){
        res.status(404).send(error)
    }
}) */

router.delete('/tasks/:id', auth, async (req, res) => {
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task){
            return res.status(404).send('Task not found')
        }
        res.send('Deleted Successfully') 
    } catch(error){
        res.status(404).send(error)
    }
})

module.exports = router