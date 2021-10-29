//imports 
require("dotenv").config()
const express = require("express");
const app = express();
const socket = require("socket.io");
const { initializeApp } = require("firebase/app")
const { getDatabase, ref, set, remove } = require("firebase/database");
const { GoogleAuthProvider, signInWithRedirect, getAuth } = require("firebase/auth");
const axios = require("axios");


//routes
app.get("/", (req, res) => {
    res.send("node server");
})

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderID: process.env.MESSAGE_SENDER,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUR_ID
}

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

const db = getDatabase(firebaseApp)
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
        set(ref(db, socket.id), {
            id: socket.id,
            room,
        });
        //write.sync("data.json", JSON.stringify(data), { overwrite: true });
        socket.join(room);
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
            remove(ref(db, socket.id));

        })

    })

})

