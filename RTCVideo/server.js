const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http, {
    path: "/video-call"
});
// const port = process.env.PORT || 1212
const port = 8080;

app.use(express.static(__dirname + "/public"))
let clients = 0

io.on('connection', function (socket) {
    socket.on("NewClient", function () {
        // if (clients < 2) {
            if (clients == 1) {
                console.log('CreatePeer');
                this.emit('CreatePeer')
            }
        // }
        // else
            // console.log('SessionActive');
            // this.emit('SessionActive')
        clients++;
    })
    console.log('connection');
    socket.on('Offer', SendOffer)
    socket.on('Answer', SendAnswer)
    socket.on('disconnect', Disconnect)
})

function Disconnect() {
    if (clients > 0) {
        if (clients <= 2)
            this.broadcast.emit("Disconnect")
        clients--
    }
}

function SendOffer(offer) {
    console.log('BackOffer');
    this.broadcast.emit("BackOffer", offer)
}

function SendAnswer(data) {
    console.log('BackAnswer');
    this.broadcast.emit("BackAnswer", data)
}

http.listen(port, () => console.log(`Active on ${port} port`))



