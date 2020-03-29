const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

app.use(express.json())

/* const router = new express.Router()
router.get('/test', (req, res) => {
    res.send('This is from my other router')
})

app.use(router) */

/* app.use((req, res, next) => { */
    /* console.log(req.method, req.path)
    next() */
    /* if(req.method === 'GET') {
        res.send('GET requests are disabled')
    } else {
        next()
    } 
}) */

/* app.use((req, res, next) => {
    res.status(503).send('Site is currently down. Check back soon.')
}) */

/* const multer  = require('multer')
const upload = multer({ 
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error('Please upload a word document'))
        }
        /* if(!file.originalname.endsWith('.pdf')){
            return cb(new Error('Please upload a PDF'))
        } */
        /* cb(undefined, true)
        /* cb(new Error('File must be a PDF'))
        cb(undefined, true)
        cb(undefined, false) *//* 
    }/*
}) */ 
/* app.post('/upload', upload.single('upload'), (req, res) => {
    res.send('Uploaded successfully.')
}) */
/* const errorMiddleware = (req, res, next) => {
    throw new Error('From my middleware')
}
app.post('/upload', errorMiddleware, (req, res) => {
    res.send('Uploaded successfully.')
}, (error, req, res, next) => {
    res.status(400).send(error.message)
}) */
/* app.post('/upload', upload.single('upload'), (req, res) => {
    res.send('Uploaded successfully.')
}, (error, req, res, next) => {
    res.status(400).send(error.message)
}) */

app.use(userRouter) 
app.use(taskRouter)   
app.listen(port, () => {  
    console.log('Server is up on port '+port)
})

/* const bcrypt = require('bcryptjs');

const myFunction = async () => {
    const password = 'Red12345!'
    const hashedPassword = await bcrypt.hash(password, 8)

    console.log(password)
    console.log(hashedPassword)

    const isMatch = await bcrypt.compare('red12345!', hashedPassword)
    console.log(isMatch)
}

myFunction() */

/* const jwt = require('jsonwebtoken');

const myFunction = async () => {
    const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', {expiresIn: '7 days'});
    console.log(token)

    const data = jwt.verify(token, 'thisismynewcourse')
    console.log(data)
}

myFunction() */

/* const pet = {
    name: 'Hal'
}

pet.toJSON = function () {
    /* console.log(this)
    return this */
    /* return {}
} */
/* 
console.log(JSON.stringify(pet)) */

/* const Task = require('./models/task')
const User = require('./models/user')

const main = async () => {
    /* const task = await Task.findById('5e7cd92ee3dd182528b0f1ab')
    await task.populate('owner').execPopulate()
    console.log(task.owner) */
    /* const user = await User.findById('5e7aded2cc202814d8aa951d')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}

main() */ 

