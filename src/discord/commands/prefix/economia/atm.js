const User = require('../../../../database/models/users');

module.exports = {
    name:"atm",
    aliases:["bolso"],
    description:"「Economia」Veja os itens que você ou um usuário possui em seu bolso.",
    requiredDB: true,
    category: "economia",
    run: async (client, message) => {
        let userDB;
        let author = false;

        if(message.mentions.users.first()) {
            userDB = await User.findOne({ _id: message.mentions.users.first().id });
            
        } else {
            userDB = await User.findOne({ _id: message.author.id });
            author = true;
        }
        message.reply( client.FormatEmoji(
                author ? `#e:lucyChibi Eai ${message.author}!! De uma olhada nos seus recursos abaixo:\n> - **(#krez) ${userDB.krez.toLocaleString()} krez**\n> - **(#chip) ${userDB.chip.toLocaleString()} chips**` : `#e:lucyChibi ${message.author} aqui está os recursos de ${message.mentions.users.first()}:\n> - **(#krez) ${userDB.krez.toLocaleString()} krez**\n> - **(#chip) ${userDB.chip.toLocaleString()} chips**`
            ))
    }
}