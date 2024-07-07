const { Schema, model } = require('mongoose');

const guildsModel = new Schema({
    _id: { type: String, required: true },
    blacklist: { type: Boolean, default: false }
});

module.exports = model('Guildas', guildsModel);
