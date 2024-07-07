const Discord = require("discord.js");
const User = require('../../../../database/models/users');
const Botao = require('../../../../functions/buttonCreate');

function dailyValues(buttonName) {
    const amount = Math.floor(Math.random() * 1000) + 1;
    const value70 = Math.floor((amount * 0.7).toFixed(2));
    const value30 = Math.floor((amount * 0.3).toFixed(2));
    const message = `#e:lucyGif Mandou bem no ${buttonName}, Wow! conseguimos **${amount} cartões**, isso vai dar uma boa grana!\n> Bom, a divisão é de **70% a 30%** eu fico com ${value70} e você com **${value30}**.`;

    return { amount, value70, value30, message };
}

async function disableButtons(interaction) {
    const button = Botao([
        { label:"Metro", customId:`metro`, disabled: true, emoji:"🚇", style: 2, },
        { label:"Beco", customId:`beco`, disabled: true, emoji:"🗑", style: 2, },
        { label:"Centro", customId:`centro`, disabled: true, emoji:"🌆", style: 2, }
    ]);
    await interaction.message.edit({ components: [button] });
}

async function handleInteraction(client, interaction, buttonName) {
    const user = await User.findOne({ _id: interaction.user.id });
    const { amount, value70, value30, message } = dailyValues(buttonName);

    user.cards += value30;
    user.daily_time = Date.now();
    user.daily_progress = false;
    await user.save();

    await interaction.reply(client.FormatEmoji(message));
    await disableButtons(interaction);
}

module.exports = [
    {
        id: 'metro',
        authorOnly: true,
        run: async (client, interaction) => {
            await handleInteraction(client, interaction, 'metrô');
        }
    },
    {
        id: 'beco',
        authorOnly: true,
        run: async (client, interaction) => {
            await handleInteraction(client, interaction, 'beco');
        }
    },
    {
        id: 'centro',
        authorOnly: true,
        run: async (client, interaction) => {
            await handleInteraction(client, interaction, 'centro');
        }
    }
];
