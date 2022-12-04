const mongoose = require('mongoose');

const interestsschema = new mongoose.Schema({
    interestName: {
        type: String,
        required: true
    },
})


exports.Interests = mongoose.model('interests', interestsschema);
exports.interestsschema = interestsschema;