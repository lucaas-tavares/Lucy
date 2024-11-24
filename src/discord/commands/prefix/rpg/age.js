const Discord = require('discord.js');
const User = require('../../../../database/models/users');
const logger = require('../../../../functions/logger')

async function updateAge(userId) {
    try {
        const userDB = await User.findById(userId);

        const lastUpdated = userDB.player.lastUpdated;
        const now = Date.now();
        const weekInMs = 7 * 24 * 60 * 60 * 1000;

        if (now - lastUpdated >= weekInMs) {
            userDB.player.age += 1;
            userDB.player.lastUpdated = now;

            await userDB.save();

            logger.warn(`O usuário ${userId} teve sua idade alterada para ${userDB.player.age} anos.`);
        }
    } catch (err) {
        logger.error('Erro ao atualizar a idade:', err);
    }
}

module.exports = {
    name: 'idade',
    aliases: ['age'],
    description:"「RPG」Veja à sua idade e classe atual.",
    requiredDB: true,
    category: "economia",
    run: async (client, message, args) => {
        const userId = message.author.id;
        await updateAge(userId);
        
        const userDB = await User.findById(userId);

        message.channel.send({ content: client.FormatEmoji(`#e:lucySmoke **Lucy:** __1 semana real equivale a 1 ano em Night City.__\n- Você é um **\`[ ${userDB.player.class} ]\`**, à sua idade é **${userDB.player.age} anos.**\n-# A expectativa de vida para um ${userDB.player.class} é de **${userDB.player.expectancy} anos**.`)});
    }
};
