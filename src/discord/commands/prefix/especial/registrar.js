const Discord = require('discord.js');
const User = require('../../../../database/models/users');

module.exports = {
  name: 'conectar',
  aliases: ['registrar', 'iniciar'],
  description: '🌹 Crie uma conexão ao servidor, para dar início à experiência.',
  category: 'especial',

  run: async (client, message) => {
    let userDB = await User.findOne({ _id: message.author.id });

    if (userDB) {
      return message.reply(client.FormatEmoji('#e:lucyLaugh Você já está conectado à experiência!'));
    }

    /* const selectMenu = new Discord.StringSelectMenuBuilder()
      .setCustomId('select-lineage')
      .setPlaceholder('🤖 - Selecione uma linhagem')
      .addOptions(
        options.lineages.map(linhagem => ({
          label: linhagem.name,
          description: linhagem.description,
          value: linhagem.name.toLowerCase()
        }))
      ); */

    /* const row = new Discord.ActionRowBuilder().addComponents(selectMenu); */

    const initialMessage = await message.reply({
      content: client.FormatEmoji(`#loading **A experiência está sendo conectada ao servidor...**`),
    });

    setTimeout(async () => {
      await initialMessage.edit({
        content: client.FormatEmoji(`#e:lucyHack ${message.author}, a conexão foi bem-sucedida! Você entrou na experiência como:\n> **\`${message.author.username}\` - Humano orgânico - 18 anos **\n-# - A expectativa de vida para os humanos é de: **120 anos.**\n> #e:lucyLaugh Faça bom proveito da sua experiência em Night City!`),
      });

      const newUser = new User({ _id: message.author.id });
      await newUser.save();
    }, 9000);
  }
};
