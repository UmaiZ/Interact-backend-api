const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const auth = require("../middleware/auth");

router.post('/registeruser', userController.registerUser);
router.post('/loginuser', userController.loginUser);
router.post('/socialLogin', userController.socialLogin);

router.post('/updateimage', auth, userController.updateImage);
router.post('/updateuser', auth, userController.updateUser);

router.post('/createalbum', auth, userController.createalbum);
router.post('/pushalbum/:id', auth, userController.pushalbum);
router.post('/editalbum/:id', auth, userController.editalbum);

router.post('/sendMail', userController.sendMail);
router.post('/confirmPartner', userController.confirmPartner);
router.post('/updatePartnerName', auth, userController.updatePartnerName);
router.get('/getUserByToken', auth, userController.getUserByToken);
router.post('/updatePartnerImage', auth, userController.updatePartnerImage);


module.exports = router;