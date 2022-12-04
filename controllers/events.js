const { Events } = require('../models/events');

var mongoose = require('mongoose')
const multer = require('multer')
const auth = require("../middleware/auth");

const FILE_TYPE_MAP_image = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = new Error('invalid image type');
        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },

    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP_image[file.mimetype];
        cb(null, `${Date.now()}.${extension}-${fileName}`);
    }
})

const uploadOptions = multer({ storage: storage });


const createEvent = async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');
    const eventImage = file.filename;

    const basePath = `https://${req.get('host')}/public/uploads/`;

    const saveEvent = Events({
        eventName: req.body.eventName,
        eventDescription: req.body.eventDescription,
        eventDateTime: req.body.eventDateTime,
        eventLat: req.body.eventLat,
        eventLong: req.body.eventLong,
        eventLocation: req.body.eventLocation,
        eventshowType: req.body.eventshowType,
        eventImage: `${basePath}${eventImage}`,
        user: req.user.user_id,
    })
    try {
        const save = await saveEvent.save();
        res.status(200).json({ 'success': true, 'message': 'Event saved successfully', data: saveEvent })

    } catch (err) {
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }
}

const eventUserGoing = async (req, res) => {
    try {

        const events = await Events.findById(req.params.id);
        if (!events) {
            return res.status(200).json({
                success: false,
                message: 'Event not found',
            });
        }

        const updateuserGoinginEvent = await Events.findOneAndUpdate(
            { _id: req.params.id, userGoing: { $ne: req.user.user_id } },
            {
                $push: {
                    userGoing: req.user.user_id,
                },
            },
            {
                new: true,
            }
        );
        if (updateuserGoinginEvent) {
            return res.status(200).json({
                success: true,
                message: 'User added successfully',
                data: updateuserGoinginEvent,
            });
        }
        res.status(200).json({
            success: false,
            message: 'User is already in this event',
            data: updateuserGoinginEvent,
        });

    } catch (err) { }
};

const eventUserInterested = async (req, res) => {
    try {
        const events = await Events.findById(req.params.id);
        if (!events) {
            return res.status(200).json({
                success: false,
                message: 'Event not found',
            });
        }
        const updateuserGoinginEvent = await Events.findOneAndUpdate(
            { _id: req.params.id, userInterested: { $ne: req.user.user_id } },
            {
                $push: {
                    userInterested: req.user.user_id,
                },
            },
            {
                new: true,
            }
        );
        if (updateuserGoinginEvent) {
            return res.status(200).json({
                success: true,
                message: 'User added successfully',
                data: updateuserGoinginEvent,
            });
        }
        res.status(200).json({
            success: false,
            message: 'User is already in this event',
            data: updateuserGoinginEvent,
        });

    } catch (err) { }
};


const getEvents = async (req, res) => {

    try {
        const events = await Events.find().populate(['user']);
        res.status(200).json({ 'success': true, 'message': 'Success', data: events })

    } catch (err) {
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }
}

const getEventsByUser = async (req, res) => {

    try {
        const events = await Events.find({ user: req.user.user_id });
        res.status(200).json({ 'success': true, 'message': 'Success', data: events })

    } catch (err) {
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }
}
module.exports = {
    getEvents,
    eventUserGoing,
    eventUserInterested,
    getEventsByUser,
    createEvent: [uploadOptions.single('image'), createEvent]
};
