import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

const users = []

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


export default app