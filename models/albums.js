const mongoose = require('mongoose');

const albumschema = new mongoose.Schema({
    albumName: {
        type: String,
        required: true
    },
    albumImage: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    uploads: [
        {
            url: {
                type: String,
            },
            uploadType: {
                type: Number,
                //0: Image, 1: Video
            },
        }
    ]

})

// albumschema.virtual('id').get(function () {
//     return this._id.toHexString();
// })

// albumschema.set('toJSON', {
//     virtuals: true
// });

exports.Albums = mongoose.model('albums', albumschema);
exports.albumschema = albumschema;