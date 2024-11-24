const Discord = require('discord.js');
const Botao = require('../../../../functions/buttonCreate');
const User = require('../../../../database/models/users');

module.exports = {
  name: "daily",
  aliases: ["batercarteira", "bater-carteira", "bater carteira"],
  description: "「Economia」Bata carteira para coletar cartões honestamente.",
  requiredDB: true,
  category: "economia",
  run: async (client, message) => {
    const userDB = await User.findOne({ _id: message.author.id });

    if (userDB.daily_time && (Date.now() - userDB.daily_time < 86400000)) {
      const nextDaily = Math.floor((userDB.daily_time + 86400000) / 1000);
      
      return message.reply({ 
        content: client.FormatEmoji(`#e:sonoZZ ${message.author}, bora descançar nós já trampou demais por hoje. Ai, eu te espero aqui amanhã no mesmo horário, ok?\n> **<t:${nextDaily}:F>**.`)
      });
    }

    if (userDB.daily_progress) {
      return message.reply({ 
        content: client.FormatEmoji(`#e:davidCP Qual é a sua? não vai escolher o local não?\n-# Se você acha que esta mensagem é um erro, aguarde 15 minutos e tente novamente.`)
      });
    }

    userDB.daily_progress = true;
    await userDB.save();

    setTimeout(async () => {
      if (userDB.daily_progress) {
        userDB.daily_progress = false;
        await userDB.save();
      }
    }, 900000);

    const button = Botao([
      { label:"Metro", customId:`metro:${message.author.id}`, emoji:"🚇", style: 2, },
      { label:"Beco", customId:`beco:${message.author.id}`, emoji:"🗑", style: 2, },
      { label:"Centro", customId:`centro:${message.author.id}`, emoji:"🌆", style: 2, }
    ]);

    message.reply({
      content: client.FormatEmoji(`#e:lucyGif E então ${message.author}, qual vai ser o lugar onde nós vai bater carteira?`), 
      components: [button]
    });
  }
}
