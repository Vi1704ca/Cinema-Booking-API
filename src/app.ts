import express from "express"

const HOST = 'http:/localhost'
const PORT = 3001
const app = express()
// GET /sessions
// GET /sessions/:id
// GET /sessions/:id/seats
// POST /sessions/:id/book

app.get('/', (req, res) => {
    res.send("Hi")
})

app.get('/sessions', (req, res) => {
    res.json({
        
    })
})
