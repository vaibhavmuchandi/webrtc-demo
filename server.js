const express = require('express')
const http = require('http')
const app = express();
const server = http.createServer(app);
const socket = require('socket.io');
const io = socket(server);

let users = [];
io.on("connection", (socket) => {
    socket.on("join", () => {
        if(users){
            users.push(socket.id);
        }
        const otherUser = users.find(id => id!== socket.id);
        if(otherUser){
            socket.emit("other user", otherUser);
            socket.to(otherUser).emit("user joined", socket.id)
        }
    });
    socket.on("offer", (payload) => {
        io.to(payload.target).emit("offer", payload)
    });
    socket.on("answer", (payload) => {
        io.to(payload.target).emit("answer", payload)
    })
    socket.on('ice-candidate', (incoming) => {
        io.to(incoming.target).emit("ice-candidate", incoming.candidate)
    })
});

io.on("disconnect", () => {
    users = []
})


server.listen(8000, () => {console.log("server running on port 8000")})