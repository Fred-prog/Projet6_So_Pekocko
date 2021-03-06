const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    userId: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, min: 0 },
    dislikes: { type: Number, min: 0 },
    userLiked: [String],
    userDisliked: [String],
});

module.exports = mongoose.model('Sauce', sauceSchema);