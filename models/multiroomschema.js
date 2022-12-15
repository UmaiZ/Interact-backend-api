const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
    partners: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'partners',
            required: true
        },
    ],
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
    ]
})


exports.RoomsMerge = mongoose.model('roomsmerge', chatRoomSchema);
exports.chatRoomSchema = chatRoomSchema;