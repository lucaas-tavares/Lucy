const Discord = require('discord.js');
const { labels } = require('../../../../functions/labels-help');

module.exports = [
    {
        id: 'menu', 
        authorOnly: true, 
        run: async (client, interaction, args) => {
            const selectedCategory = interaction.values[0];

            let embed = new Discord.EmbedBuilder()
                .setAuthor({ name: "Lucy Help!", iconURL: client.user.avatarURL() })
                .setFooter({ text: `ID: ${interaction.user.id} | Nome: ${interaction.user.username}`, iconURL: interaction.user.avatarURL() })
                .setThumbnail(client.user.avatarURL())
                .setColor("#e27cd7");

            if (selectedCategory === 'painel') {
                embed.setDescription(client.FormatEmoji(`#lucyGif Eai ${interaction.user}? Para explorar os meus comandos, basta selecionar uma categoria na barra suspensa que está logo abaixo!\n\nLembre-se, não utilize os meus comandos de forma inadequada.\n-# - Caso veja alguém utilizando meus comandos de forma inadequada, reporte imediatamente!`));
            } else {
                const commands = client.prefixCommands.filter(cmd => cmd.category === selectedCategory);
                const description = commands.map(cmd => client.prefix + cmd.name).join(' | ');
                embed.setDescription(`### Comandos da categoria: ${labels[selectedCategory]}\n\`\`\`${description}\`\`\``);
            }

            await interaction.update({embeds: [embed]});
        }
    }
];
