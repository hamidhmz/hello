const express = require("express");
const path = require("path");
// const server = require('http').createServer();
const app = express();
const server = require("http").createServer(app);
const io = require('socket.io')(server);
app.use( express.static(__dirname +'/../frontend/'));
io.on('connection', function(socket){
    console.log('an user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});
io.on("connection",function (socket) {
   socket.on("send message",function(data){
     // io.emit("new message",data);
     console.log(data);
     socket.broadcast.emit("new message",data);
   });
});
app.get("/",async (req,res) => {
    res.sendFile(path.resolve(__dirname+"/../frontend/index.html"));
});
server.listen(3001,()=> console.log("server started localhost port 3001"));
