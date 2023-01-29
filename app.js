const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const express = require("express")
const cors = require("cors")
const http = require('http');
const app = express()

const server = http.createServer(app);

const { Server } = require("socket.io");


const io = new Server(server);
const { Rooms } = require('./models/chatroom')


const port = 3000
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

require('dotenv/config')
const api = process.env.API_URL
const userRoutes = require('./routes/user')
const interestRoutes = require('./routes/interestandlifestyle')
const eventsRoutes = require('./routes/events')
const interactRoutes = require('./routes/interacts')


app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

app.use(`${api}`, userRoutes);
app.use(`${api}`, interestRoutes);
app.use(`${api}`, eventsRoutes);
app.use(`${api}`, interactRoutes);
app.get('/', (req, res) => {
    res.send(`Server is running`)
});
// io.on('connection', (socket) => {
//     console.log('a user connected');
//     socket.on('getRoomChats', async (msg) => {
//         const getroomchat = await Rooms.findById(msg.roomid);
//         io.emit('messagerecieved', getroomchat.chats);
//     });

//     socket.on('sendMessage', async (msg) => {
//         // console.log(msg);
//         const sendMessagetoRoom = await Rooms.findByIdAndUpdate(msg.roomid, {
//             $push: {
//                 chats: {
//                     "message": msg.message,
//                     "messagetype": msg.messagetype,
//                     "lastSeen": msg.lastSeen,
//                     "partner": msg.partner,
//                 }
//             }
//         }, {
//             new: true
//         }).populate(['partner1', 'partner2', {
//             'path': 'partner1',
//             'populate': 'partners'
//         }, {
//                 'path': 'partner2',
//                 'populate': 'partners'
//             },
//             {
//                 'path': 'chats',
//                 'populate': 'partner'
//             }])
//         io.emit('messagerecieved', sendMessagetoRoom);
//     });

// });

mongoose.connect(process.env.COLLECTION, {
    dbName: 'interact-dev'
})
    .then(() => {
        console.log("database connected");
    })
    .catch(() => {
        console.log("database not connected");
    })


const PORT = process.env.PORT || 3000;

// server.listen(PORT, () => {
//     console.log(`App listening on port ${PORT}!`);
// });

app.listen(PORT, () => { console.log(`App listening on port ${PORT}!`); });
