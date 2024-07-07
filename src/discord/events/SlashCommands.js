  const Discord = require('discord.js')
  module["exports"] = {
    type: 'interactionCreate',
    run: async (client, interaction) => {
        if(interaction.type === Discord.InteractionType.ApplicationCommand){

            const cmd = client.commands.get(interaction.commandName);
      
            if (!cmd) return interaction.reply(`Error`);
      
            interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);
      
            cmd.run(client, interaction)
      
         }
       
    }}