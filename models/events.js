const mongoose = require('mongoose');

const eventsschema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true
    },
    eventDescription: {
        type: String,
    },
    eventImage: {
        type: String,
    },
    eventDateTime: {
        type: String,
    },
    eventLat: {
        type: String,
    },
    eventLong: {
        type: String,
    },

    eventLocation: {
        type: String,
    },
    eventshowType: {
        type: Number,
        //0: Public 1: Private
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    userInterested: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        }
    ],
    userGoing: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        }
    ]

})


exports.Events = mongoose.model('events', eventsschema);
exports.eventsschema = eventsschema;