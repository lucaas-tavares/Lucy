const Discord = require('discord.js');
const Botao = require('../../../../functions/buttonCreate');

module.exports = {
    name: "shop",
    aliases: ["loja", "submundo", "sm"],
    description: "「Economia」Venda e compre itens aqui.",
    authorOnly: true,
    category: "economia",
    run: async (client, message) => {
        const embed = new Discord.EmbedBuilder()
            .setDescription(client.FormatEmoji(`## #e:market Submundo\n#e:seller **Vendedor:** ${message.author}, Bem-vindo às profundezas de Night City, meu amigo.\n-# - Sinta-se à vontade para explorar o Submundo, mas não se esqueça: aqui, tudo tem um preço, e eu não sou do tipo que faz favor.\n> - *Utilize o botão abaixo para acessar os itens*`))
            .setColor('#2b2d31');

        const button = Botao([
            { label: 'Visualizar seções', customId: `shop-categories:${message.author.id}`, style: 2 }
        ]);

        const msg = await message.reply({ embeds: [embed], components: [button] });

        client.activeShopMessage = msg;
    }
};
