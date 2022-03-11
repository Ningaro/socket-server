const express = require('express')
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 80

app.use(express.static('public'))

// Socket IO Logic

let players = []

io.on('connection', socket => {

    io.emit('join', { id: socket.id })
    players.push(socket.id)
    io.emit('players', { for: socket.id, players })

    console.log("Player add", players)

    socket.on('pos', msg => {
        console.log(msg)
        io.emit('pos', msg)
    })

    socket.on('disconnect', reason => {
        players = players.filter(id => id !== socket.id)
        io.emit('players', { for: "all", id: socket.id })
        console.log(`Player leave for ${reason}`, players)
    })
})

http.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`)
})