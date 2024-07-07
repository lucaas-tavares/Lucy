const fs = require("fs");

module.exports = async (client) => {
  fs.readdirSync('./src/discord/commands/prefix').forEach(dir => {
    const commands = fs.readdirSync(`./src/discord/commands/prefix/${dir}`).filter(file => file.endsWith('.js'));

    for (const file of commands) {
      const pull = require(`../discord/commands/prefix/${dir}/${file}`);

      try {
        if (!pull.name) {
          console.log(`Não consegui carregar o comando por prefixo ${file}, a propriedade name deve existir e ser uma string.`);
          continue;
        }

        pull.category = dir;
        client.commands.set(pull.name, pull);
      } catch (err) {
        console.log(`Erro ao carregar o comando ${file}, erro: ${err}`);
        continue;
      }
    }
  });
};
