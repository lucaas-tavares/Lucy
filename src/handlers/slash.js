const fs = require("fs");

module.exports = async (client) => {
  const SlashsArray = [];

  fs.readdir(`./src/discord/commands/slash`, (error, folder) => {
    if (error) {
      console.error(`Erro ao ler o diretório: ${error.message}`);
      return;
    }

    folder.forEach(subfolder => {
      fs.readdir(`./src/discord/commands/slash/${subfolder}/`, (error, files) => {
        if (error) {
          console.error(`Erro ao ler o subdiretório ${subfolder}: ${error.message}`);
          return;
        }

        files.forEach(file => {
          if (!file?.endsWith('.js')) return;

          const command = require(`../discord/commands/slash/${subfolder}/${file}`);
          if (!command?.name) return;

          client.commands.set(command.name, command);
          SlashsArray.push(command);
        });
      });
    });
  });

  client.on("ready", async () => {
    client.application.commands.set(SlashsArray)
  });
};

