var express = require('express')
  , http = require('http')
  , socketio = require("socket.io")
  , eyes = require('eyes')

var app = express()
  , server = http.createServer(app)
  , io = socketio.listen(server)

server.listen(3000)

app.configure(function(){
    app.use(express.methodOverride())
    app.use(express.bodyParser())
    app.use(app.router)
    app.use(express.static(__dirname + '/public'))
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
})


var sockets = {};

io.sockets.on('connection', function(client) {
  sockets[client.id] = {};

  client.broadcast.emit('new_user', { id: client.id })

  client.emit('message', { stuff: 'and then some' })

  client.on('move_cnc_to', function(coords) {
    // send coords { x:500, y:100 } to the cnc
    console.log(eyes.inspect(coords))
  })

  client.on('disconnect', function() {
    client.broadcast.emit('remove_user', { id: client.id })
    delete sockets[client.id]
  })
})

// update clients with cnc position data
var cnc_positions = []

