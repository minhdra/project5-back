const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
        max: 255
    },
    backgroundImage: {
        type: String,
        require: true,
    },
    contentLink: {
        type: String,
        require: true,
    },
    redirectTo: {
        type: String,
        require: true,
    },
    active: {
        type: Boolean,
        required: true,
        default: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('slides', slideSchema);