const express = require('express');
const router = express.Router();
const interestController = require('../controllers/interest&lifestyle');

router.post('/createinterest', interestController.createInterest);
router.get('/getinterest', interestController.getInterest);

router.post('/createlifestyle', interestController.createLifeStyleCategory);
router.get('/getlifestyle', interestController.getLifeStyle);
router.post('/createlifestyleitems/:id', interestController.createLifeStyleCategoryItems);


module.exports = router;