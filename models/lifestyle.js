const mongoose = require('mongoose');

const lifestyleschema = new mongoose.Schema({
    lifeStyleCatName: {
        type: String,
        required: true
    },
    lifeStyleItems: [],
})



// lifestyleschema.virtual('id').get(function () {
//     return this._id.toHexString();
// })

// lifestyleschema.set('toJSON', {
//     virtuals: true
// });

exports.LifeStyle = mongoose.model('lifestyles', lifestyleschema);
exports.lifestyleschema = lifestyleschema;