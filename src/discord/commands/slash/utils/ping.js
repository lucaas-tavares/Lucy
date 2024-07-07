const Discord = require('discord.js');
const mongoose = require('mongoose');

module.exports = {
    name:'ping',
    description:'Veja o ping',
    type: Discord.ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
      
        interaction.reply(client.FormatEmoji(`🏓** | Pong!** \`${client.ws.ping} ms\`.\n #mongoDB**|** Database: \`${mongoose.connection.readyState}ms\``));
    }
}