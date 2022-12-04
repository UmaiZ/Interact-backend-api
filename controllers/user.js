var bcrypt = require("bcryptjs");
const { Users } = require('../models/user')
const { Albums } = require('../models/albums')
const { Partners } = require('../models/user')
var jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

var mongoose = require('mongoose')
const multer = require('multer')
var FCM = require('fcm-node');
var serverKey = 'AAAAN7C9ewI:APA91bF7cF1e8rzvy7TtITrav-L-8ajiVMPxL4Iw5IaA-wTaznpe9YH4i-_n_llqrKoORMQaJR18xxVM3E7sHj204IJqyDvw0OrUDWGZZWcd8VTelPbcpwiJ7P82wIC4Y15p_OZsFtBe'; //put your server key here
var fcm = new FCM(serverKey);


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


const registerUser = async (req, res) => {
    const usercheck = await Users.findOne({ userEmail: req.body.userEmail }).exec();
    if (usercheck) {
        if (usercheck.userSocialToken) {
            return res.status(200).json({ message: "user logged in as social", success: false })

        }
        return res.status(400).json({
            success: false,
            message: "User already exists."
        })
    }
    const user = Users({
        userEmail: req.body.userEmail,
        userPassword: bcrypt.hashSync(req.body.userPassword, 8),
    })

    const token = jwt.sign(
        { user_id: user._id, partner_id: user.partnerProfile },
        process.env.TOKEN_KEY,
        {
            expiresIn: "7d",
        }
    );
    // save user token
    user.userToken = token;

    try {
        const usersave = await user.save();
        res.status(200).json({ success: true, data: usersave, message: 'User saved successfully' })

    } catch (err) {
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }
}

const socialLogin = async (req, res) => {
    const usercheck = await Users.findOne({ userSocialToken: req.body.userSocialToken }).exec();


    if (usercheck) {
        const token = jwt.sign(
            { user_id: usercheck._id, partner_id: usercheck.partnerProfile ? usercheck.partnerProfile._id : "" },
            process.env.TOKEN_KEY,
            {
                expiresIn: "7d",
            }
        );
        usercheck.userToken = token;

        return res.status(200).json({ message: "user login successfully", data: usercheck, success: true })
    }

    const user = new Users({
        userName: req.body.userName,
        userEmail: req.body.userEmail,
        userSocialToken: req.body.userSocialToken,

        // userType: 1,
        userLoginType: req.body.userLoginType,
    });
    try {
        const userr = await user.save();
        const token = jwt.sign(
            { user_id: user._id, partner_id: user.partnerProfile ? user.partnerProfile._id : "" },
            process.env.TOKEN_KEY,
            {
                expiresIn: "7d",
            }
        );
        user.userToken = token;

        res.status(200).json({ success: true, data: userr, message: "user created success" })
    } catch (err) {
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }

}
const loginUser = async (req, res) => {
    const user = await Users.findOne({ userEmail: req.body.userEmail }).populate(['userAlbums', 'partnerProfile', {
        'path': 'partnerProfile',
        'populate': 'partners'
    }

    ]);
    if (!user) {
        return res.status(200).json({ message: "user not found", success: false })

    }
    if (user.userSocialToken) {
        return res.status(200).json({ message: "user logged in as social", success: false })

    }
    if (user && bcrypt.compareSync(req.body.userPassword, user.userPassword)) {
        const token = jwt.sign(
            { user_id: user._id, partner_id: user.partnerProfile ? user.partnerProfile._id : "" },
            process.env.TOKEN_KEY,
            {
                expiresIn: "7d",
            }
        );
        user.userToken = token;

        return res.status(200).json({ message: "login successfully", data: user, success: true })
    }
    return res.status(400).json({ message: "login failed", success: false })
};

const getUserByToken = async (req, res) => {

    const user = await Users.findById(req.user.user_id).populate(['userAlbums', 'partnerProfile', {
        'path': 'partnerProfile',
        'populate': 'partners'
    }

    ]);
    if (!user) {
        return res.status(200).json({ message: "user not found", success: false })

    }

    return res.status(200).json({ message: "success", success: true, data: user })
};
const updateUser = async (req, res) => {
    try {
        const updateUser = await Users.findByIdAndUpdate(req.user.user_id, {
            userName: req.body.userName,
            userGender: req.body.userGender,
            userGenderShow: req.body.userGenderShow,
            userAboutme: req.body.userAboutme,
            userInterest: req.body.userInterest,
            userLifeStyleItems: req.body.userLifeStyleItems,
            userLon: req.body.userLon,
            userLat: req.body.userLat,
            userLocationPrivacy: req.body.userLocationPrivacy,
            userCountry: req.body.userCountry,
            userCity: req.body.userCity,
            userNotificationToken: req.body.userNotificationToken,
            userLastOnline: req.body.userLastOnline,
            userDeviceType: req.body.userDeviceType,
            userDOB: req.body.userDOB,
            userPartner: req.body.userPartner,
            userNumber: req.body.userNumber,
            isNewUser: req.body.isNewUser
        }, {
            new: true
        }).populate(['userAlbums', 'partnerProfile', {
            'path': 'partnerProfile',
            'populate': 'partners'
        }

        ]);
        return res.status(200).json({ success: true, data: updateUser })

    } catch (err) {
        console.log(err);
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }
};

const updateImage = async (req, res) => {

    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');
    const userImage = file.filename;

    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;




    try {
        const updateUser = await Users.findByIdAndUpdate(req.user.user_id, {
            userImage: `${basePath}${userImage}`,
        }, {
            new: true
        });
        // console.log(updateUser);

        return res.status(200).json({ success: true, data: updateUser })
    } catch (err) {
        console.log(err);
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }
};


const createalbum = async (req, res) => {

    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');
    const userImage = file.filename;

    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    try {
        const album = Albums({
            albumName: req.body.albumName,
            user: req.user.user_id,
            albumImage: `${basePath}${userImage}`,
        })
        const albumsave = await album.save();

        // console.log(albumsave._id);

        const updateUser = await Users.findByIdAndUpdate(req.user.user_id, {
            $push: {
                userAlbums: albumsave._id
            }
        }, {
            new: true
        });

        return res.status(200).json({ success: true, data: albumsave })

    } catch (err) {
        console.log(err);
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }

}

const pushalbum = async (req, res) => {

    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');
    const userImage = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    try {

        const updateAlbum = await Albums.findByIdAndUpdate(req.params.id, {
            $push: {
                uploads: [{
                    url: `${basePath}${userImage}`,
                    uploadType: req.body.uploadType,
                }],
            }
        }, {
            new: true
        });

        const updateUser = await Users.findByIdAndUpdate(req.user.user_id, {
            $push: {
                userAlbums: updateAlbum._id
            }
        }, {
            new: true
        });

        return res.status(200).json({ success: true, data: updateAlbum })

    } catch (err) {
        console.log(err);
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }

}


const editalbum = async (req, res) => {

    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');
    const albumImage = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    try {

        const updateAlbum = await Albums.findByIdAndUpdate(req.params.id, {
            albumName: req.body.albumName,
            albumImage: `${basePath}${albumImage}`,

        }, {
            new: true
        });

        return res.status(200).json({ success: true, data: updateAlbum })

    } catch (err) {
        console.log(err);
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }

}

const sendMail = async (req, res) => {
    try {
        // var transporter = nodemailer.createTransport(smtpTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: 'umaizdevemailer@gmail.com',
        //         pass: 'zhirofvcdhobpjsh'
        //     }
        // }));
        var transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service: "gmail",
            secure: false,
            port: 465,
            auth: {
                user: "umaizdevemailer@gmail.com",
                pass: "zhirofvcdhobpjsh"
            }
        });


        var mailOptions = {
            from: 'umaizdevemailer@gmail.com',
            to: req.body.email,
            subject: 'Sending Email using Node.js',
            html: `<h5>Your link is ${req.body.link}</h5>`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                // console.log(error);
            } else {
                return res.status(200).json({ message: "link sended to your email address", success: true })
            }
        });
    }
    catch (err) {
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }
}

const confirmPartner = async (req, res) => {

    try {
        const user = await Users.findOne({ userEmail: req.body.userEmail }).exec();
        const user2 = await Users.findById(req.body.userid).exec();
        // console.log(user);
        const partner = Partners({
            partners: [req.body.userid, user._id],
            partnerName: `${user.userName} and ${user2.userName}`
        })

        const savepartner = await partner.save();
        // console.log(savepartner);
        let saveuser = await Users.findByIdAndUpdate(req.body.userid, {
            partnerProfile: savepartner._id
        }, { new: true });

        let saveuser2 = await Users.findByIdAndUpdate(user._id, {
            partnerProfile: savepartner._id
        }, { new: true }).populate(['userAlbums', 'partnerProfile', {
            'path': 'partnerProfile',
            'populate': 'partners'
        }

        ]);

        if (saveuser2) {
            var message = {
                to: user2.userNotificationToken,
                notification: {
                    title: 'Partner Confirmed',
                    body: 'Partner Confirmed',
                },
                data: {
                    nottype: 'confirmation_partner',
                },
            };
            fcm.send(message, function (err, response) {
                if (err) {
                    console.log(err);
                    console.log("Something has gone wrong!");
                    return res.status(200).json({
                        success: true,
                        message: "save user",
                        data: saveuser2,
                        notificationresponse: err
                    })
                } else {
                    console.log("Successfully sent with response: ", response);
                    return res.status(200).json({
                        success: true,
                        message: "save user",
                        data: saveuser2,
                        notificationresponse: response
                    })
                }
            });


        }
    } catch (err) {
        console.log(err);
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }
}

const updatePartnerName = async (req, res) => {

    try {
        const updatePartnerInfo = await Partners.findByIdAndUpdate(req.user.partner_id, {
            partnerName: req.body.partnername
        }, {
            new: true
        })
        return res.status(200).json({ message: "profile updated", success: true, data: updatePartnerInfo })

    } catch (err) {
        console.log(err);
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }

}

const updatePartnerImage = async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).send('No image in the request');
    const albumImage = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;


    try {
        const updatePartnerInfo = await Partners.findByIdAndUpdate(req.user.partner_id, {
            partnerImage: `${basePath}${albumImage}`,
        }, {
            new: true
        })
        return res.status(200).json({ message: "profile updated", success: true, data: updatePartnerInfo })

    } catch (err) {
        console.log(err);
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }

}


module.exports = {
    socialLogin,
    registerUser, loginUser, updateUser, sendMail, confirmPartner, updatePartnerName, getUserByToken,
    updatePartnerImage: [uploadOptions.single('image'), updatePartnerImage],

    updateImage: [uploadOptions.single('image'), updateImage],
    createalbum: [uploadOptions.single('image'), createalbum],
    pushalbum: [uploadOptions.single('image'), pushalbum],
    editalbum: [uploadOptions.single('image'), editalbum]
};
