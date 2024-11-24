const Discord = require('discord.js');
const User = require('../../../../database/models/users');
const Botao = require('../../../../functions/buttonCreate');
const shopItens = require('../../../../constants/shopItens.json');

const updateInventory = (inventory, itemKey, itemData, quantity = 1) => {
    const item = inventory.find(i => i.id === itemKey);
    item ? (item.quantity += quantity) : inventory.push({ id: itemKey, ...itemData, quantity });
};

const createSelectionMenu = (id, placeholder, options) => {
    if (options.length === 0) return null;

    return new Discord.ActionRowBuilder().addComponents(
        new Discord.StringSelectMenuBuilder()
            .setCustomId(id)
            .setPlaceholder(placeholder)
            .addOptions(options)
    );
};

const getCategoriesMenu = () => {
    const options = Object.entries(shopItens.categories).map(([key, category]) => ({
        label: category.name,
        description: `Explore os itens de ${category.name}.`,
        value: key
    }));
    return createSelectionMenu('shop-category-select', 'Selecione uma categoria', options);
};

const getItemsMenu = (categoryKey) => {
    const category = shopItens.categories[categoryKey];
    if (!category) return null;

    const options = Object.entries(category.items).slice(0, 25).map(([key, item]) => ({
        label: item.name,
        description: item.description,
        value: key
    }));
    return createSelectionMenu(`shop-item-select:${categoryKey}`, 'Escolha um item', options);
};

const getSellItemsMenu = (categoryKey) => {
    const category = shopItens.categories[categoryKey];
    if (!category) return null;

    const options = Object.entries(category.items).slice(0, 25).map(([key, item]) => ({
        label: item.name,
        description: item.description,
        value: key
    }));
    return createSelectionMenu('sell-item-select', 'Escolha um item para vender', options);
};

const handlePurchase = async (client, interaction, userDB, itemKey, categoryKey, item) => {
    const confirmationMessage = await interaction.reply({
        content: client.FormatEmoji(
            `#e:seller **Vendedor:** Você está prestes a comprar **${item.name}** por **${item.price.toLocaleString()} krez**.\nDescrição: ${item.description}\nDeseja confirmar a compra?`
        ),
        components: [
            Botao([
                {label: 'Confirmar', customId: `confirm-purchase:${interaction.user.id}:${itemKey}`, style: 3},
                {label: 'Cancelar', customId: `cancel-purchase:${interaction.user.id}:${itemKey}`, style: 4}
            ])
        ],
        ephemeral: true
    });

    const filter = i =>
        ['confirm-purchase', 'cancel-purchase'].includes(i.customId) && i.user.id === interaction.user.id;

    try {
        const confirmation = await confirmationMessage.awaitMessageComponent({ filter, time: 30000 });

        if (confirmation.customId === 'confirm-purchase') {
            if (userDB.krez < item.price) {
                return confirmation.update({
                    content: client.FormatEmoji(
                        `#e:seller **Vendedor:** Ei, você precisa de mais **${(item.price - userDB.krez).toLocaleString()} krez** para comprar isso!`
                    ),
                    components: []
                });
            }

            userDB.krez -= item.price;
            updateInventory(userDB.player.inventory, itemKey, item);
            await userDB.save();

            return confirmation.update({
                content: client.FormatEmoji(
                    `#e:seller **Vendedor:** Você adquiriu **${item.name}** por **${item.price.toLocaleString()} krez**. Volte sempre!`
                ),
                components: []
            });
        } else if (confirmation.customId === 'cancel-purchase') {
            return confirmation.update({
                content: client.FormatEmoji(
                    `#e:seller **Vendedor:** Compra cancelada. Volte sempre!`
                ),
                components: []
            });
        }
    } catch (error) {
        return interaction.editReply({
            content: client.FormatEmoji(
                `#e:seller **Vendedor:** Você demorou demais para confirmar. Compra cancelada.`
            ),
            components: []
        });
    }
};


const handleSell = async (client, interaction, args, values) => {
    const itemId = values[0];
    const userDB = await User.findOne({ _id: interaction.user.id });

    const userItem = userDB.player.inventory.find(i => Object.keys(shopItens.categories['category-currency'].items).includes(itemId) && shopItens.categories['category-currency'].items[itemId].name === i.name);

    if (!userItem || userItem.quantity <= 0) {
        return interaction.reply({
            content: client.FormatEmoji(`#e:seller **Vendedor:** Você não possui este item ou ele está sem estoque.`),
            ephemeral: true
        });
    }

    await interaction.update({
        content: client.FormatEmoji(`#e:seller **Vendedor:** Quantos **${userItem.name}** você deseja vender?\n-# Insira o valor abaixo:`),
        components: []
    });

    const filter = response => response.author.id === interaction.user.id && !isNaN(response.content) && parseInt(response.content, 10) > 0;
    try {
        const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 120000, errors: ['time'] });
        const quantity = parseInt(collected.first().content, 10);

        if (quantity > userItem.quantity) {
            return interaction.followUp({
                content: client.FormatEmoji(`#e:lucyLaugh **Lucy:** Você não tem **${quantity} ${userItem.name}** para vender.`),
                ephemeral: true
            });
        }

        const krezReceived = quantity * shopItens.categories['category-currency'].items[itemId].price;
        userItem.quantity -= quantity;
        userDB.krez += krezReceived;

        if (userItem.quantity === 0) {
            userDB.player.inventory = userDB.player.inventory.filter(i => i.name !== userItem.name);
        }

        await userDB.save();

        return interaction.followUp({
            content: client.FormatEmoji(`#e:seller **Vendedor:** Aqui está seus **(#krez) ${krezReceived.toLocaleString()} krez**, agora me passa para cá os **${quantity} ${userItem.name} chips**.`)
        });
    } catch (error) {
        return interaction.followUp({
            content: client.FormatEmoji('#e:seller **Vendedor:** Você demorou demais. Negócio cancelado.'),
            ephemeral: true
        });
    }
};

module.exports = [
    {
        id: 'shop-categories',
        authorOnly: true,
        run: async (client, interaction) => {
            const rowCategories = getCategoriesMenu();

            if (client.activeShopMessage) {
                await client.activeShopMessage.edit({
                    content: client.FormatEmoji(`#e:seller **Vendedor:** Escolha uma seção para explorar itens ou vender.`),
                    components: [rowCategories],
                    embeds: []
                });

                await interaction.deferUpdate();
            } else {
                return interaction.reply({ content: 'Houve um erro, use o comando novamente.', ephemeral: true });
            }
        }
    },
    {
        id: 'shop-category-select',
        authorOnly: true,
        run: async (client, interaction, args, values) => {
            const selectedCategory = values[0];
            const category = shopItens.categories[selectedCategory];

            if (!category) {
                return interaction.reply({ content: 'Categoria inválida.', ephemeral: true });
            }

            let components;
            if (selectedCategory === 'category-currency') {
                const sellItemsMenu = getSellItemsMenu(selectedCategory);

                if (!sellItemsMenu) {
                    return interaction.reply({ content: 'Você não tem itens para vender.', ephemeral: true });
                }

                components = [sellItemsMenu, getCategoriesMenu()];
            } else {
                const rowItems = getItemsMenu(selectedCategory);
                components = [rowItems, getCategoriesMenu()];
            }

            if (client.activeShopMessage) {
                await client.activeShopMessage.edit({
                    content: client.FormatEmoji(`#e:seller **Vendedor:** Seção de **${category.name}**.\n> ${category.message}\n> Escolha um item ou volte para outra categoria:`),
                    components: components
                });

                await interaction.deferUpdate();
            } else {
                return interaction.reply({ content: 'Houve um erro, execute o comando novamente.', ephemeral: true });
            }
        }
    },
    {
        id: 'shop-item-select',
        authorOnly: true,
        run: async (client, interaction, args, values) => {
            const categoryKey = args[0];
            const itemKey = values[0];
            const category = shopItens.categories[categoryKey];
            const item = category?.items[itemKey];

            if (!item) {
                return interaction.reply({ content: 'Item inválido.', ephemeral: true });
            }

            const userDB = await User.findOne({ _id: interaction.user.id });
            await handlePurchase(client, interaction, userDB, itemKey, categoryKey, item);
        }
    },
    {
        id: 'sell-item-select',
        authorOnly: true,
        run: async (client, interaction, args, values) => {
            await handleSell(client, interaction, args, values);
        }
    },
    {
        id: 'confirm-purchase',
        authorOnly: true,
        run: async (client, interaction, args) => {
            const [userId, itemKey] = args; // Atualização: inclui itemKey
            if (interaction.user.id !== userId) {
                return interaction.reply({ content: 'Você não pode confirmar esta compra.', ephemeral: true });
            }
    
            const userDB = await User.findOne({ _id: interaction.user.id });
            const item = Object.values(shopItens.categories)
                .flatMap(category => Object.entries(category.items))
                .find(([key]) => key === itemKey)?.[1];
    
            if (!item) {
                return interaction.reply({ content: 'Item inválido.', ephemeral: true });
            }
    
            if (userDB.krez < item.price) {
                return interaction.update({
                    content: client.FormatEmoji(
                        `#e:seller **Vendedor:** Você não tem **${(item.price - userDB.krez).toLocaleString()} krez** suficientes para essa compra!`
                    ),
                    components: []
                });
            }
    
            userDB.krez -= item.price;
            updateInventory(userDB.player.inventory, itemKey, item);
            await userDB.save();
    
            return interaction.update({
                content: client.FormatEmoji(
                    `#e:seller **Vendedor:** Parabéns! Você comprou **${item.name}** por **${item.price.toLocaleString()} krez**.`
                ),
                components: []
            });
        }
    },
    {
        id: 'cancel-purchase',
        authorOnly: true,
        run: async (client, interaction, args) => {
            const [userId, itemKey] = args;
            if (interaction.user.id !== userId) {
                return interaction.reply({ content: 'Você não pode cancelar esta compra.', ephemeral: true });
            }

            return interaction.update({
                content: client.FormatEmoji(
                    `#e:seller **Vendedor:** Compra cancelada. Volte sempre que quiser!`
                ),
                components: []
            });
        }
    }
];
