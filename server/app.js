//imports 
require("dotenv").config()
const express = require("express");
const app = express();
const socket = require("socket.io");
const axios = require("axios");


//routes
app.get("/", (req, res) => {
    res.send("node server");
})

const server = app.listen(4000, () => {
    console.log("server started");
});

const io = socket(server, {
    cors: {
        origin: ["http://localhost:3000", "http://192.168.29.200:3000", "https://www.coinwatch.ml", "https://coinwatch.ml"],
        methods: ["GET", "POST"]
    }
});

const data = [];

io.on("connection", (socket) => {

    console.log(socket.id);
    socket.on("joinroom", (room) => {
        data.push({
            id: socket.id,
            room,
        })
        //write.sync("data.json", JSON.stringify(data), { overwrite: true });
        socket.join(room);
        socket.on("chatMessage", (chat) => {
          io.to(room).emit("message", chat);
        });
        const send = async () => {
            const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/${room}`)
            socket.emit("time", new Date().toUTCString() + " " + room)
            socket.emit("data", data);
        }
        setInterval(send, 10000)
        socket.on("disconnect", async () => {
            const index = data.findIndex(user => user.id === socket.id);
            data.splice(index, 1);
            console.log(data)
            //write.sync("data.json", JSON.stringify(data), { overwrite: true })
        })
        
    })
    
})

