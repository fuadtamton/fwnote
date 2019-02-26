const mongoose = require('mongoose');

const Notes = mongoose.model('Notes', {
    title: {
        type: String,
        required: true,
        minlength: 1
    },
    note: {
        type: String,
        required: true,
        minlength: 1
    },
    createdAt: {
        type: Number
    },
    creator_Id: {
        required: true,
        type: mongoose.Schema.Types.ObjectId
    }
})

module.exports = { Notes }