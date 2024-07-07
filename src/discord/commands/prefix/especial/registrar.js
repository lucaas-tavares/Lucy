const Discord = require("discord.js");
const User = require('../../../../database/models/users');
const Botao = require('../../../../functions/buttonCreate');

module.exports = {
  name: "registrar",
  description: "🌹 Atravesse o portal para utilizar meus comandos.",
  category: "special",

  run: async (client, message, args) => {
    let userData = await User.findOne({ _id: message.author.id });

    if (userData) {
      return message.reply(client.FormatEmoji('#e:clientError **O que foi?** você realmente acha que pode se registrar denovo? ksksks fof@.'));
    }

    const button = Botao([
      { label:"Ver itens", emoji:"👀", customId:`[button, ${message.author.id}]`, style: 2, }
    ])
    const initialMessage = await message.reply({ content: client.FormatEmoji(`#e:davidCP ${message.author}, estou computando suas informações.\n> - 😥 Isso exige muito de mim, então, pode demorar um pouco, até lá é melhor você aguenta o coração ai...`) });

    setTimeout(async () => {
      await initialMessage.edit(client.FormatEmoji("**#loading A experiência está sendo conectada ao servidor**. Estamos quase lá, não desista agora!"));
    }, 9000);

    setTimeout(async () => {
      await initialMessage.edit({
        content: client.FormatEmoji(`#e:lucyChibi ${message.author}, tudo pronto desse lado! Aqui, pode levar essas **3 coisas**.\n> - #catBlush Ei, faça bom uso dos meus comandos e desfrute ao máximo da experiência.`),
        components: [button]
      });

      user = new User({ _id: message.author.id });
      await user.save();
    }, 15000);
  }
}
