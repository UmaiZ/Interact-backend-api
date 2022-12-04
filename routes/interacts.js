const express = require('express');
const router = express.Router();
const interactsController = require('../controllers/interact');
const auth = require("../middleware/auth");

router.get('/getinteracts', auth, interactsController.getInteract);
router.post('/likePartner/:id', auth, interactsController.likePartner);
router.post('/dislikePartner/:id', auth, interactsController.dislikePartner);
router.get('/getRooms', auth, interactsController.getRooms);
router.get('/getInteractswithInterest/:cat', auth, interactsController.getInteractwithInterest);


module.exports = router;