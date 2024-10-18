import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

const users = []

function checksExistsUserAccount(req, res, next) {
    const { username } = req.headers
    const user = users.find((user) => user.username === username)

    if(!user) {
      return res.status(400).json({ error : "User not found" })
   }

   req.user = user

   return next()
}

app.post('/users', (req, res) => {
    const {name, username} = req.body

    const userAlreadyExists = users.some((user) => user.username === username)

    if (userAlreadyExists) {
        return res.status(400).json({ error: 'User already exists'})
    }

   users.push({
    name,
    username,
    id: uuidv4(),   
    todos: []
   }) 

  return res.status(201).send()
})

app.get('/todos', checksExistsUserAccount, (req, res) => {
    const { username } = req.headers
    
    return res.json(username.todos)
})

app.post('/todos', checksExistsUserAccount, (req, res) => {
    const { title, deadline } = req.body
    const { username } = req.headers
   
    
    const todoOperation = {
        id: uuidv4(),
        title,
        done: false,
        deadline: new Date(deadline),
        created_at: new Date()
    }

    username.todos.push(todoOperation)

    return res.status(201).send()
})

export default app