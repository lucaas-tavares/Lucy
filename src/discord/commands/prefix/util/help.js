const Discord = require('discord.js');
const { optionsPanel, labels } = require('../../../../functions/labels-help');

module.exports = {
    name: "ajuda",
    aliases: ["help", "comandos", "commands"],
    description: "「Util」Veja a lista de comandos que a Lucy possui.",
    category: "util",
    run: async (client, message) => {
        const clientIcon = client.user.avatarURL();
        
        let embed = new Discord.EmbedBuilder()
            .setAuthor({ iconURL: clientIcon, name: "Lucy Help!"})
            .setDescription(client.FormatEmoji(`#lucyGif Eai ${message.author}? Para explorar os meus comandos, basta selecionar uma categoria na barra suspensa que está logo abaixo!\n\nLembre-se, não utilize os meus comandos de forma inadequada.\n-# - Caso veja alguém utilizando meus comandos de forma inadequada, reporte imediatamente!`))
            .setFooter({text: `ID: ${message.author.id} | Nome: ${message.author.username}`, iconURL: message.author.avatarURL()})
            .setThumbnail(clientIcon)
            .setColor("#e27cd7");

        const menu = optionsPanel("Menu", "Selecione para voltar a embed inicial", "painel", "🏠");
        const economia = optionsPanel("Economia", "Informações sobre os krez e chips.", "economia", "🌙");
        const especial = optionsPanel("Especial", "Informações sobre comandos especiais", "especial", "⭐");
        const util = optionsPanel("Útil", "Veja os comandos úteis", "util", "🔨");

        const date = Date.now();
        const dashboard = new Discord.ActionRowBuilder().addComponents(
            new Discord.StringSelectMenuBuilder()
                .setPlaceholder("Selecione uma categoria")
                .setCustomId(`menu:${message.author.id}:${date}`)
                .addOptions([menu, economia, especial, util])
        );

        message.reply({embeds: [embed], components: [dashboard], allowedMentions: { repliedUser: false }});
    }
};
