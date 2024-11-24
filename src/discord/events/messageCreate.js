
const Discord = require('discord.js')
const MESSAGE = require('../../constants/message.json');
const userDB = require('../../database/models/users');

const { permissions } = require('../../constants/permissions.json');
const { FormatEmoji } = require('../../functions/FormatEmoji');

module["exports"] = {
    type: 'messageCreate',
    run: async (client, message) => {
        if (message.author.bot) return;
        if (message.content.replace('!', '').startsWith(`<@${client.user?.id}>`)) {

            const buttons = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setLabel('Servidor de Suporte')
                    .setStyle(Discord.ButtonStyle.Link)
                    .setEmoji('🌙')
                    .setURL('https://discord.gg/YDX38W37gG')
            )

            return message.reply({ content: client.FormatEmoji(`#e:lucyGif Eai ${message.author}? eu sou a **${client.user.username}**, e estou aqui para te ajudar, ok? Bom, você pode ver os meus comandos utilizando \`${client.prefix}ajuda\`\n> - #lucynaGif Se quiser me conhecer melhor, recomendo apertar nesse botão abaixo.`), components: [buttons] })
        }

        if (!message.content.startsWith(client.prefix) || !message.guild) return;


        const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
        const cmdName = args.shift().toLowerCase();
        const command = client.prefixCommands.get(cmdName) || client.prefixCommands.find(als => als.aliases?.includes(cmdName));

        if (!command) { message.channel.send(client.FormatEmoji(`#e:clientError ${message.author}, Foi mal ai, mas eu não tenho esse comando, recomendo que você utilize **${client.prefix}ajuda**.`)); return; };
        if (command.DevOnly && !client.developers.includes(message.author.id)) {
            message.reply(client.FormatEmoji(`#e:clientError Foi mal ai, mas esse comando não é pra qualquer um usar.`));
            return;
        }

        // if (!client.developers.includes(message.author.id)) return message.channel.send(client.FormatEmoji("#e:clientErro Desculpa, estou recebendo reparos por agora. Volte em uma outra hora."))

        const mentions = message.mentions.users;
        const userCache = client.users.cache;
        const mentioned = userCache.get(args[0]) || userCache.find(user => user.username === args[0]) || mentions.first();
        const _userDB = await userDB.findById(message.author.id);
        const mentionedDB = await userDB.findById(mentioned?.id);
        const mentionArgs = !!mentions ? true : !!mentioned ? true : false;
        const isDeveloper = client.developers.includes(message.author.id);
        const messageBl = mentionedDB?.blacklist["baned"] ? MESSAGE.MESSAGES.BLACKLIST.MENTION : MESSAGE.MESSAGES.BLACKLIST.AUTHOR;

        if ((_userDB?.blacklist["baned"] && command.name !== "suporte-bl" && command.name !== "rblack-list") ||
            (mentionedDB?.blacklist["baned"] && mentionArgs)) {
            if (!isDeveloper || (isDeveloper && command.name !== "rblack-list")) {
                let errorMessage;
                if (mentionArgs) {
                    if (mentionedDB?.blacklist["baned"]) {
                        errorMessage = messageBl
                            .replace("[autor]", message.author)
                            .replace("[mention]", mentioned.username)
                            .replace("[reason]", mentionedDB?.blacklist["reason"]);
                    } else {
                        errorMessage = messageBl
                            .replace("[autor]", message.author)
                            .replace("[mention]", "usuário mencionado")
                            .replace("[reason]", _userDB?.blacklist["reason"]);
                    }
                } else {
                    errorMessage = messageBl
                        .replace("[autor]", message.author)
                        .replace("[mention]", "usuário mencionado")
                        .replace("[reason]", _userDB?.blacklist["reason"]);
                }

                return message.reply(FormatEmoji(errorMessage));
            }
        }

        if (cmdName === 'registrar') {
            try {
                command.run(client, message, args);
            } catch (error) {
                console.error('Ai, tentei executar o comando, mas um errinho apareceu aqui:', error);
            }
            return;
        }

        const authorDB = await userDB.findById(message.author.id);

        if (!authorDB && command.requiredDB) {
            const messageRegisterAuthor = MESSAGE.MESSAGES.VERIFY.AUTHOR
                .replace(/\[autor\]/g, message.author.username)
                .replace(/\[comando\]/g, `${client.prefix}registrar`);
            return message.reply(client.FormatEmoji(messageRegisterAuthor));
        }


        if (message.mentions.users.size > 0) {
            const mentioned = message.mentions.users.first();
            const mentionedDB = await userDB.findById(mentioned.id);

            if (!mentionedDB && command.requiredDB) {
                const messageRegisterUser = MESSAGE.MESSAGES.VERIFY.MENTION
                    .replace(/\[autor\]/g, message.author)
                    .replace(/\[mencao\]/g, mentioned)
                return message.reply(client.FormatEmoji(messageRegisterUser));
            }
        }

        const PermissionTranslator = (input) => {
            return input.map(permission => `${permissions[permission]} ` || input).join(', ');
        };

        if (command.UserPermission && !message.member.permissions.has(command.UserPermission || []))
            return message.channel.send(FormatEmoji(MESSAGE.MESSAGES.PERMISSION.AUTHOR.replace(/\[name\]|\[PERMISSION\]/g, (matched) => { return matched === "[autor]" ? message.author : PermissionTranslator(command.UserPermission) })));

        if (command.ClientPermission && !message.guild.members.cache.get(client.user.id).permissions.has(command.ClientPermission || []))
            return message.channel.send(FormatEmoji(MESSAGE.MESSAGES.PERMISSION.CLIENT.replace(/\[name\]|\[PERMISSION\]/g, (matched) => { return matched === "[autor]" ? message.author : PermissionTranslator(command.ClientPermission) })));

        const cooldownKey = `${message.author.id}-${command.name}`;
        const miliseconds = client.cooldowns.get(cooldownKey) / 1000;

        if (!client.developers.includes(message.author.id)) {
            if (client.cooldowns.has(cooldownKey)) {
                return message.channel.send(
                    FormatEmoji(
                        MESSAGE.MESSAGES.COOLDOWN.replace(/\[autor\]|\[cooldown\]/g, (matched) => {
                            return matched === "[autor]" ? message.author : Math.trunc(miliseconds);
                        })
                    )
                );
            }

            client.cooldowns.set(cooldownKey, Date.now() + 7000);
            setTimeout(() => {
                client.cooldowns.delete(cooldownKey);
            }, 7000);
        }

        const userDb = await userDB.findById(message.author.id);
        try {
            command.run(client, message, args, userDb);
        } catch (error) {
            console.error('Erro ao executar o comando:', error);
        }


        /*    const prefix = client.prefix;
           if (message.content.startsWith(prefix)) {
           const args = message.content.slice(prefix.length).trim().split(/ +/g);
           let command = args.shift().toLowerCase();
       
           const commandObject = client.prefixCommands.get(command) || client.prefixCommands.find(cmd => cmd.aliases?.includes(command));
           if (commandObject) {
               command = commandObject.name;
           }
       
           const { name: serverName, memberCount } = message.guild;
           const guild = message.guild;
           const owner = await guild.fetchOwner();
           const ownerUsername = owner.user.username;
       
           const logChannel = client.channels.cache.get('1205971779558834176');
       
           const embed = new Discord.EmbedBuilder()
               .setAuthor({name: message.author.username, iconURL: message.author.avatarURL({ format: 'png', dynamic: true, size: 2048 })})
               .setDescription(`\n> - **\`🔮\` › Dimensão:** \`${serverName}\`\n> - **\`🐉\` › Dono:** \`${ownerUsername}\`\n> - **\`⭐\` › Aventureiros:** \`${memberCount}\``)
               .setColor('#97989a');
       
           await logChannel.send({content:`Comando usado: **\`${command}\`** < **\`${args.join(' ')}\`** >`, embeds: [embed]});
        
       }   */
    }
}