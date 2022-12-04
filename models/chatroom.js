const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
    partner1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'partners',
        required: true
    },
    partner2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'partners',
        required: true
    },
    chats:
        [
            {
                "message": {
                    type: String
                },
                "messagetype": {
                    type: Number,
                    //0: Text 1: Image 2: Video 3:Audio
                },
                "lastSeen": {
                    type: Boolean
                },
                "time": {
                    type: Date,
                    default: Date.now
                },
                "partner": {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'partners',
                    required: true
                },
            }

        ]
})


exports.Rooms = mongoose.model('rooms', chatRoomSchema);
exports.chatRoomSchema = chatRoomSchema;