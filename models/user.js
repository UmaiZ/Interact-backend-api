const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    userName: {
        type: String,
        default: ""
    },
    userEmail: {
        type: String,
        require: true
    },
    userSocialToken: {
        type: String,
    },
    userNumber: {
        type: String,
        require: true
    },
    userPassword: {
        type: String,
        require: true
    },
    userToken: {
        type: String,
    },
    userGender: {
        type: Number,
        //0: Male, 1: Female 
    },
    userLoginType: {
        type: Number,
        //0: Email, 1: Social, 2: Apple 
    },
    userGenderShow: {
        type: Boolean,
        default: false
    },
    isNewUser: {
        type: Boolean,
        default: true
    },
    userImage: {
        type: String,
        default: ""
    },
    userAboutme: {
        type: String,
        default: ""
    },
    userCountry: {
        type: String,
        default: ""
    },
    userCity: {
        type: String,
        default: ""
    },
    userLifeStyleItems: [
        {
            type: String
        }
    ],
    userInterest: [
        {
            type: String,
        }
    ],
    userAlbums: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'albums'
        }
    ],
    userLon: {
        type: String,
        default: ""
    },
    userLat: {
        type: String,
        default: ""
    },
    userLocationPrivacy: {
        type: Boolean,
        default: true

    },

    partnerProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'partners'
    },
    userNotificationToken: {
        type: String,
        default: ""
    },
    userLastOnline: {
        type: String,
        default: ""

    },
    userDeviceType: {
        type: Number,
        // required: true,
        // 0) Android 1) iOS 
    },
    userCreatedOn: {
        type: Date,
        default: Date.now
    },
    userDOB: {
        type: String,
        default: ""
    },

})


const partnerProfileSchema = new mongoose.Schema({
    partners: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    partnerName: {
        type: String,
    },
    partnerImage: {
        type: String,
    },

    partnerLikeuser: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'partners'
        }
    ],
    partnerDisLikeuser: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'partners'
        }
    ],
})

// userschema.virtual('id').get(function () {
//     return this._id.toHexString();
// })

// userschema.set('toJSON', {
//     virtuals: true
// });

exports.Users = mongoose.model('users', userschema);
exports.Partners = mongoose.model('partners', partnerProfileSchema);

exports.userschema = userschema;
exports.partnerProfileSchema = partnerProfileSchema;