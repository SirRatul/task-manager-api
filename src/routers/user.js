const express = require('express')
const multer  = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const {sendWelcomeEmail, sendCancelationEmail} = require('../emails/account')
const router = new express.Router()

/* router.get('/test', (req, res) => {
    res.send('From a new file')
}) */

router.post('/users', async (req, res) => {
    /* console.log(req.body)
    res.send('Testing') */
    const user = new User(req.body)

    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        // res.status(201).send(user)
        res.status(201).send({user,token})
    } catch(error){
        res.status(400).send(error)
    }

    /* user.save().then(() => {
        res.status(201).send(user)
    }).catch((error) => {
        res.status(400).send(error) 
    }) */
})

router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        // res.status(201).send(user)
        res.status(201).send({user,token})
        // res.status(201).send({user: user.getPublicProfile(),token})
    } catch(error){
        res.status(400).send(error)
    }

    /* user.save().then(() => {
        res.status(201).send(user)
    }).catch((error) => {
        res.status(400).send(error) 
    }) */
})

router.post('/users/logout', auth , async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.status(201).send('Logout Successfully')
    } catch(error){
        res.status(500).send(error)
    }
})

router.post('/users/logoutAll', auth , async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(201).send('Logout Successfully')
    } catch(error){
        res.status(500).send(error)
    }
})

router.get('/users/me', auth , async (req, res) => {
    res.send(req.user)
    /* try{
        const users = await User.find({})
        res.send(users)
    } catch(error){
        res.status(500).send(error)
    } */
    /* User.find({}).then((users) => {
        res.send(users)
    }).catch((error) => {
        res.status(500).send(error)
    }) */
})

/* router.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send('User not found')
        }
        res.send(user)
    } catch(error){
        res.status(404).send(error)
    }
    /* User.findById(_id).then((user) => {
        if(!user){
            return res.status(404).send('User not found')
        }
        res.send(user)
    }).catch((error) => {
        res.status(404).send(error)
    }) */ 
/* }) */

/* router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(404).send('Invalid update') 
    }
    try{
        const user = await User.findById(req.params.id)

        updates.forEach((update) => user[update] = req.body[update])
        await user.save()

        /* const user = await User.findByIdAndUpdate(req.params.id,req.body, {
            new: true, 
            runValidators: true
        }) */
        /* if(!user){
            return res.status(404).send('User not update')
        }
        res.send(user)
    } catch(error){
        res.status(404).send(error)
    }
}) */

/* router.delete('/users/:id', async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send('User not found')
        }
        res.send('Deleted Successfully') 
    } catch(error){
        res.status(404).send(error)
    }
}) */

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(404).send('Invalid update') 
    }
    try{
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch(error){
        res.status(404).send(error)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try{
        /* const user = await User.findByIdAndDelete(req.user._id)
        if(!user){
            return res.status(404).send('User not found')
        } */
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send('Deleted Successfully') 
    } catch(error){
        res.status(404).send(error)
    }
})

/* const upload = multer({ 
    dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
}) */

const upload = multer({ 
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

/* router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
    res.send('Uploaded successfully.')
}, (error, req, res, next) => {
    res.status(400).send(error.message)
}) */

/* router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send('Uploaded successfully.')
}, (error, req, res, next) => {
    res.status(400).send(error.message)
}) */

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send('Uploaded successfully.')
}, (error, req, res, next) => {
    res.status(400).send(error.message)
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send('Deleted successfully.')
})

router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch(error){
        res.status(404).send('Picture not found') 
    }
})

module.exports = router