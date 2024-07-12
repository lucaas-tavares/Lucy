module.exports = [{
    id:'register-view',
    authorOnly: true,
    run: async (client, interaction) => {
        interaction.reply({content: client.FormatEmoji(`#e:lucyLaugh Aqui estão as **3 coisas** que você ganhou:\n> - #krez **1.000 krez**\n> - #chip **100 chips**\n> - #lucynaGif **1 beijo na bochecha**`), ephemeral: true})
    }
}]