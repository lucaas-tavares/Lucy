const Discord = require('discord.js')
const mongoose = require('mongoose');

module.exports = {
    name:"ping",
    aliases:["pong"],
    description:'「Util」Veja o ping',
    category: "util",
    run: async (client, message) => {
        message.reply(client.FormatEmoji(`🏓** | Pong!** \`${client.ws.ping} ms\`.\n #mongoDB**|** Database: \`${mongoose.connection.readyState}ms\``));

    }
}