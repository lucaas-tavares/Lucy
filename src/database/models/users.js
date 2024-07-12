const { Schema, model } = require('mongoose');

const usersModel = new Schema({
    _id: { type: String, required: true },
    blacklist: {
        baned: { type: Boolean, default: false },
        reason: { type: String, default: "não especificado."}
    },
    badges: { type: [String], default: [] },
    
    honor: { type: Number, default: 0 },
    aboutme: { type: String, default: 'Lucy é a melhor bot' },
    banner: { type: String, default: 'https://imgur.com/OvyBty3.png' },
    vip: { type: Boolean, default: false },
    vipExpires: { type: Date, default: null },
    
    chip: { type: Number, default: 100 },
    krez: { type: Number, default: 1000 },
    daily_time: { type: Number, default: 0 },
    daily_progress: { type: Boolean, default: false },

    votes: { type: Number, default: 0 },
    time_vote: { type: Number, default: 0 },
});

module["exports"] = model('Membros', usersModel);
