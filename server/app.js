const express = require("express");
const app = express();
const socket = require("socket.io");
const fs = require("fs");
const axios = require("axios");
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

        socket.join(room);
        const send = async () => {
            const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/${room}`)
            io.to(room).emit("time", new Date().toUTCString() + " " + room)
            io.to(room).emit("data", data);
        }
        setInterval(send, 10000)

    })

})

