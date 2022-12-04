const express = require('express');
const router = express.Router();
const eventsController = require('../controllers/events');
const auth = require("../middleware/auth");

router.post('/createevents', auth, eventsController.createEvent);
router.get('/getevents', auth, eventsController.getEvents);
router.post('/eventUserGoing/:id', auth, eventsController.eventUserGoing);
router.post('/eventUserInterested/:id', auth, eventsController.eventUserInterested);
router.get('/getEventsByUser', auth, eventsController.getEventsByUser);

module.exports = router;