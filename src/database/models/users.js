const { Schema, model } = require('mongoose');

const usersModel = new Schema({
    _id: { type: String, required: true },
    blacklist: {
        baned: { type: Boolean, default: false },
        reason: { type: String, default: "não especificado." }
    },
    profile: {
        badges: { type: [String], default: [] },
        reputation: { type: Number, default: 0 },
        aboutme: { type: String, default: 'Lucy é a melhor bot' },
        banner: { type: String, default: 'https://imgur.com/OvyBty3.png' }
    },
    player: {
        age: { type: Number, default: 18 },
        expectancy: { type: Number, default: 120 },
        lastUpdated: { type: Date, default: Date.now },
        hp: { type: Number, default: 100 },
        energy: { type: Number, default: 70 },
        strength: { type: Number, default: 5 },
        defense: { type: Number, default: 0 },
        intelligence: { type: Number, default: 0 },
        class: { type: String, default: "Humano Orgânico" },
        xp: { type: Number, default: 0 },
        level: { type: Number, default: 0 },
        inventory: [
            {
                name: { type: String, required: true },
                quantity: { type: Number, default: 1 },
                description: { type: String, default: '' }
            }
        ]
    },
    equipment_status: {
        weapon: {
            name: { type: String, default: null },
            damage: { type: Number, default: 0 }
        },
    },
    chip: { type: Number, default: 0 },
    krez: { type: Number, default: 0 },
    vip: { type: Date, default: null },
    daily_time: { type: Number, default: 0 },
    daily_progress: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model('Membros', usersModel);
