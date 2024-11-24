const { Client, Collection } = require('discord.js');
const { FormatEmoji } = require('../functions/FormatEmoji/index');
const logger = require('../functions/logger')
const colorize = require('strcolorize');
const fs = require('fs');

module.exports = class Lucy extends Client {
    constructor(options) {
        super({ intents: options.intents });

        this.developers = options.developers;
        this.token = options.token;
        this.prefix = options.prefix;
        this.FormatEmoji = FormatEmoji;

        this.commands = new Collection();
        this.prefixCommands = new Collection();
        this.components = new Collection();
        this.cooldowns = new Collection();

        this.logSummary = [];
    }

    async setup() {
        try {
            this.loadSlashCommands();
            this.loadPrefixCommands();
            this.setupEvents();
            this.HandlerComponents();

            await super.login(this.token);

            this.displaySummary();
            console.log(colorize(`#bold magenta[${this.user.username}] já está sob o luar 🌙⭐`));
        } catch (error) {
            console.error('Erro ao conectar o cliente:', error);
        }
    }

    loadSlashCommands() {
        const commandCount = { success: 0, failed: 0 };
        fs.readdirSync("./src/discord/commands/slash").forEach((directory) => {
            const commandFiles = fs
                .readdirSync(`./src/discord/commands/slash/${directory}/`)
                .filter((cmdFile) => cmdFile.endsWith(".js"));

            commandFiles.forEach((file) => {
                const command = require(`../discord/commands/slash/${directory}/${file}`);
                if (!command) {
                    commandCount.failed++;
                    return;
                }

                this.commands.set(command.name, command);
                commandCount.success++;
            });
        });

        this.logSummary.push(
            `- Slash Commands: ${commandCount.success} loaded, ${commandCount.failed} failed`
        );
    }

    loadPrefixCommands() {
        const commandCount = { success: 0, failed: 0 };
        fs.readdirSync("./src/discord/commands/prefix").forEach((directory) => {
            const commandFiles = fs
                .readdirSync(`./src/discord/commands/prefix/${directory}/`)
                .filter((cmdFile) => cmdFile.endsWith(".js"));

            commandFiles.forEach((file) => {
                const command = require(`../discord/commands/prefix/${directory}/${file}`);
                if (!command) {
                    commandCount.failed++;
                    return;
                }

                this.prefixCommands.set(command.name, command);
                commandCount.success++;
            });
        });

        this.logSummary.push(
            `- Prefix Commands: ${commandCount.success} loaded, ${commandCount.failed} failed`
        );
    }

    setupEvents() {
        const eventCount = { success: 0, failed: 0 };
        fs.readdirSync("./src/discord/events").forEach((files) => {
            const events = require(`../discord/events/${files}`);
            if (!events.type) {
                eventCount.failed++;
                return;
            }

            if (events.once) {
                this.once(events.type, (...args) => events.run(this, ...args));
            } else {
                this.on(events.type, (...args) => events.run(this, ...args));
            }
            eventCount.success++;
        });

        this.logSummary.push(
            `- Events: ${eventCount.success} loaded, ${eventCount.failed} failed`
        );
    }

    HandlerComponents() {
        const componentCount = { success: 0, failed: 0 };
        fs.readdirSync('./src/discord/components/prefix').forEach(directory => {
            const componentFiles = fs
                .readdirSync(`./src/discord/components/prefix/${directory}/`)
                .filter(cmpFile => cmpFile.endsWith(".js"));
    
            componentFiles.forEach(file => {
                const component = require(`../discord/components/prefix/${directory}/${file}`);
                if (!component) {
                    componentCount.failed++;
                    return;
                }
                if (Array.isArray(component)) {
                    component.forEach(cmp => this.components.set(cmp.id, cmp));
                } else {
                    this.components.set(component.id, component);
                }
                componentCount.success++;
            });
        });
    
        this.logSummary.push(
            `- Components: ${componentCount.success} loaded, ${componentCount.failed} failed`
        );
    }

    displaySummary() {
        console.log(colorize('#cyan[--- Application Summary ---]', false));
        this.logSummary.forEach((log) => console.log(colorize(`#green[success] ${log}`)));
        console.log(colorize('#cyan[--------------------------------]', false));
    }
};
