const app = require('http').createServer()
const io = require('socket.io')(app)

io.on('connection', socket => {
    socket.on('sendMessage', message => {
        io.emit('sendMessage', message)
    })
})

app.listen(3300, () => {
    console.log('listening on localhost:3300')
})
