const { Users } = require('../models/user')
const { Partners } = require('../models/user')
const { Rooms } = require('../models/chatroom')
const { RoomsMerge } = require('../models/multiroomschema')

var FCM = require('fcm-node');
var serverKey = 'AAAAN7C9ewI:APA91bF7cF1e8rzvy7TtITrav-L-8ajiVMPxL4Iw5IaA-wTaznpe9YH4i-_n_llqrKoORMQaJR18xxVM3E7sHj204IJqyDvw0OrUDWGZZWcd8VTelPbcpwiJ7P82wIC4Y15p_OZsFtBe'; //put your server key here
var fcm = new FCM(serverKey);

const getInteract = async (req, res) => {

    try {
        const partnerdetails = await Partners.findById(req.user.partner_id);
        const users = await Partners.find({ '_id': { $nin: [partnerdetails.partnerLikeuser, partnerdetails.partnerDisLikeuser, req.user.partner_id] } }).populate(['partners']);

        res.status(200).json({ 'success': true, 'message': 'Success', data: users })

    } catch (err) {
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }
}

const getInteractwithInterest = async (req, res) => {
    // console.log(req.params.cat)
    var finished = false;

    try {
        const partnerdetails = await Partners.findById(req.user.partner_id).populate(['partners']);

        const users = await Partners.find(
            {
                '_id': { $nin: [partnerdetails.partnerLikeuser, partnerdetails.partnerDisLikeuser, req.user.partner_id] },
            },

        ).populate(['partners']);
        var updated = [];


        users.forEach((e) => {
            for (let j = 0; j < e.partners.length; j++) {
                if (e.partners[j].userInterest.includes(req.params.cat)) {

                    updated.push(e)
                    // console.log(updated)
                }
            }
        })
        res.status(200).json({ 'success': true, 'message': 'Success', data: updated })
        // await Promise.all(updated).then(function () {
        //     res.status(200).json({ 'success': true, 'message': 'Success', data: users })
        // })




    } catch (err) {
        console.log(err)
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }
}


const getRooms = async (req, res) => {
    try {
        const chats = await Rooms.find({
            $or: [
                { partner1: { $in: req.user.partner_id } },
                { partner2: { $in: req.user.partner_id } },
            ]
        }).populate(['partner1', 'partner2', {
            'path': 'partner1',
            'populate': 'partners'
        }, {
                'path': 'partner2',
                'populate': 'partners'
            }])
        res.status(200).json({ 'success': true, 'message': 'Success', data: chats })

    } catch (err) {
        console.log(err);
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }
}
const getAllRooms = async (req, res) => {
    try {
        const chats = await Rooms.find().populate(['partner1', 'partner2', {
            'path': 'partner1',
            'populate': 'partners'
        }, {
                'path': 'partner2',
                'populate': 'partners'
            }])
        res.status(200).json({ 'success': true, 'message': 'Success', data: chats })

    } catch (err) {
        console.log(err);
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }
}


const likePartner = async (req, res) => {

    try {
        const users = await Partners.findOneAndUpdate(
            // req.user.partner_id,
            { _id: req.user.partner_id, partnerLikeuser: { $ne: req.params.id }, partnerDisLikeuser: { $ne: req.params.id } },
            {
                $push: {
                    partnerLikeuser: req.params.id
                }
            });
        if (users) {
            const exists = await Partners.find({ '_id': req.params.id, partnerLikeuser: req.user.partner_id },);
            // console.log(exists);

            if (exists.length > 0) {




                const user1 = await Users.findOne({ partnerProfile: req.user.partner_id }).populate(['partnerProfile', {
                    'path': 'partnerProfile',
                    'populate': 'partners'
                }]);
                const user2 = await Users.findOne({ partnerProfile: req.params.id }).populate(['partnerProfile', {
                    'path': 'partnerProfile',
                    'populate': 'partners'
                }]);
                // console.log(user1)
                // console.log(user2)
                const createRoom = RoomsMerge({
                    partners: [req.user.partner_id, req.params.id],
                    users: [user1.partnerProfile.partners[0]._id, user1.partnerProfile.partners[1]._id, user2.partnerProfile.partners[0]._id, user2.partnerProfile.partners[1]._id]
                })
                const creating = await createRoom.save()


                const updateuser = await Users.findByIdAndUpdate(user1.partnerProfile.partners[0]._id, {
                    $push: {
                        userChatRooms: creating._id
                    }
                }, {
                    new: true
                }).exec();
                const updateuser1 = await Users.findByIdAndUpdate(user1.partnerProfile.partners[1]._id, {
                    $push: {
                        userChatRooms: creating._id
                    }
                }, {
                    new: true
                }).exec();

                const updateuser2 = await Users.findByIdAndUpdate(user2.partnerProfile.partners[0]._id, {
                    $push: {
                        userChatRooms: creating._id
                    }
                }, {
                    new: true
                }).exec();
                const updateuser3 = await Users.findByIdAndUpdate(user2.partnerProfile.partners[1]._id, {
                    $push: {
                        userChatRooms: creating._id
                    }
                }, {
                    new: true
                }).exec();

                return res.status(200).json({ 'success': true, 'match': true, 'message': 'Success', data: users, 'room': creating })
            }
            return res.status(200).json({ 'success': true, 'match': false, 'message': 'Success', data: users })

        }
        return res.status(200).json({ 'success': false, 'message': 'User Already Liked or Disliked' })
    } catch (err) {
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }
}

const dislikePartner = async (req, res) => {

    try {
        const users = await Partners.findOneAndUpdate(
            { _id: req.user.partner_id, partnerLikeuser: { $ne: req.params.id }, partnerDisLikeuser: { $ne: req.params.id } },
            {
                $push: {
                    partnerDisLikeuser: req.params.id
                }
            });
        if (users) {
            return res.status(200).json({ 'success': true, 'message': 'Success', data: users })
        }
        return res.status(200).json({ 'success': false, 'message': 'User Already Liked or Disliked' })
    } catch (err) {
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }
}

const getMatchInteract = async (req, res) => {

    try {
        const partnerdetails = await Partners.findById(req.user.partner_id);
        console.log(partnerdetails.partnerLikeuser)
        // console.log(partnerdetails._id)

        console.log(req.user.partner_id)

        const users = await Partners.find({ 'partnerLikeuser': { $in: [partnerdetails._id], } }).populate(['partners']);
        const data = users.filter((e) => {
            console.log(partnerdetails.partnerLikeuser.includes(e._id))
            return partnerdetails.partnerLikeuser.includes(e._id)
        });
        console.log(data)

        res.status(200).json({ 'success': true, 'message': 'Success', data: data })

    } catch (err) {
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }
}



module.exports = {
    getInteract,
    likePartner,
    dislikePartner,
    getRooms,
    getAllRooms,
    getInteractwithInterest,
    getMatchInteract
};


