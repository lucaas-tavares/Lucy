module["exports"] = {
    type: 'interactionCreate',
    run: async (client, interaction) => {
  
        if (interaction.isButton()) {
            const args = (interaction.customId.match(/\[([^\]]*)\]/) || [, ''])[1].split(',').map(param => param.trim());
        
            const Button = args.length > 0 ? client.components.get(args[0]) : client.components.get(interaction.customId);
            if (!Button || (Button.authorOnly && interaction.user.id !== args[1]))
                return interaction.deferUpdate();
        
            args.shift()
            if (Button) Button.run(client, interaction, args);
        }        

    }
}