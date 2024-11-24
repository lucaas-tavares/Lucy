module.exports = {
    type: 'interactionCreate',
    run: async (client, interaction) => {
        if (interaction.message.createdTimestamp < (client.readyTimestamp || 0)) {
            return interaction.reply({ content: client.FormatEmoji(`#e:lucyStaring Os dados dessa interação foram perdidos.`), ephemeral: true });
        }
        
        if (interaction.isButton()) {
            const args = interaction.customId.split(':');
            const action = args[0];
            const Button = client.components.get(action);

            if (!Button || (Button.authorOnly && interaction.user.id !== args[1])) {
                return interaction.deferUpdate();
            }

            args.shift();
            if (Button) Button.run(client, interaction, args);
        } else if (interaction.isStringSelectMenu()) {
            const args = interaction.customId.split(':');
            const action = args[0];
            const SelectMenu = client.components.get(action);

            if (!SelectMenu) {
                return interaction.reply({ content: "Este menu de seleção não é válido.", ephemeral: true });
            }

            SelectMenu.run(client, interaction, args.slice(1), interaction.values);
        }
    }
};