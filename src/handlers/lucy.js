const { Client, Collection } = require('discord.js');
const { FormatEmoji } = require('../functions/FormatEmoji/index');
const colorize = require('strcolorize');
const Table = require('cli-table3');
const fs = require('fs');

module.exports = class Lucy extends Client {
    constructor(options) {
        super({
            intents: options.intents
        });

        this.developers = options.developers;
        this.token = options.token;
        this.prefix = options.prefix;
        this.FormatEmoji = FormatEmoji;

        this.commands = new Collection();
        this.prefixCommands = new Collection();
        this.components = new Collection();
        this.cooldowns = new Collection();
    }

    async setup() {
        try {
            this.loadSlashCommands();
            this.loadPrefixCommands();
            this.setupEvents();
            this.HandlerComponents();
            await super.login(this.token);
            console.log(colorize(`#bold magenta[${this.user.username}] já está sob o luar 🌙⭐`));
        } catch (error) {
            console.error('Ocorreu um erro durante a conexão com o cliente:', error);
        }
    }
    
    loadSlashCommands() {
        const table = new Table({ 
          head: [
            colorize('#red [comandos]'),
            colorize('#blue [status]')
          ]
        });
    
        fs.readdirSync("./src/discord/commands/slash").forEach((directory) => {
          const commandFiles = fs
            .readdirSync(`./src/discord/commands/slash/${directory}/`)
            .filter((cmdFile) => cmdFile.endsWith(".js"));
    
          commandFiles.forEach((file) => {
            const command = require(`../discord/commands/slash/${directory}/${file}`);
            if (!command) return;
    
            this.commands.set(command.name, command);
    
            table.push([
              command.name,
              colorize("#green [sucesso]")
            ]);
          });
        });
    
        console.log(table.toString());
      }

      loadPrefixCommands() {
        const table = new Table({ 
          head: [
            colorize('#red [comandos]'),
            colorize('#blue [status]')
          ]
        });
    
        fs.readdirSync("./src/discord/commands/prefix").forEach((directory) => {
          const commandFiles = fs
            .readdirSync(`./src/discord/commands/prefix/${directory}/`)
            .filter((cmdFile) => cmdFile.endsWith(".js"));
    
          commandFiles.forEach((file) => {
            const command = require(`../discord/commands/prefix/${directory}/${file}`);
            if (!command) return;
    
            this.prefixCommands.set(command.name, command);
    
            table.push([
              command.name,
              colorize("#green [sucesso]")
            ]);
          });
        });
    
        console.log(table.toString());
      }

      setupEvents() {
        const table = new Table({ 
          head: [
            colorize('#cyan [eventos]', false),
            colorize('#blue [status]', false)
          ]
        });
    
        fs.readdirSync("./src/discord/events").forEach((files) => {
          const events = require(`../discord/events/${files}`);
          if (!events.type) return;
    
          if (events.once) {
            super.once(events.type, (...args) => {
              events.run(this, ...args);
            });
          } else {
            super.on(events.type, (...args) => {
              events.run(this, ...args);
            });
          }
          table.push([
            events.type,
            colorize("#green [sucesso]")
          ]);
        });
    
        console.log(table.toString());
      }

      HandlerComponents() {
        const table = new Table({ 
          head: [
          colorize('#cyan bold [componentes]', false),
          colorize('#blue [status]', false)
        ]
      });
    
        fs.readdirSync('./src/discord/components/prefix').forEach(directory => {
            const componentFile = fs.readdirSync(`./src/discord/components/prefix/${directory}/`).filter(cmpFile => cmpFile.endsWith(".js"));
    
            componentFile.forEach(file => {
                const components = require(`../discord/components/prefix/${directory}/${file}`);
                if (!components) return;
    
                if (!components || !Array.isArray(components)) return;
    
                components.forEach(component => {
                this.components.set(component.id, component);
                table.push([
                  component.id,
                  colorize("#green [sucesso]")
                ])
                });
            });
        });
        console.log(table.toString())
      }
    };
    