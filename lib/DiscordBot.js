const { Client, Intents } = require('discord.js');
const {
    NODE_ENV,
    DISCORD_TESTING_GUILD_ID
} = require('./Settings');

class DiscordBot {
    constructor({ token }) {
        if (token) {
            this.client = this.#buildDiscordClient(token);
        }
    }

    #buildDiscordClient(token) {
        const discordClient = new Client({ intents: Intents.ALL });
        discordClient.login(token);
        discordClient.once("ready", (_data) => {
            console.log(`${discordClient.user.username} ready!`);
            if (NODE_ENV === 'development') {
                this.client.guilds.cache.get(DISCORD_TESTING_GUILD_ID)?.commands.set([]);
            }
            this.initCommands();
        });
        discordClient.on("warn", console.log);
        discordClient.on("error", console.error);
        return discordClient;
    }

    async addCommand(options, handler) {
        if (NODE_ENV === 'development') {
            options.name = `${options.name}_test`;
        }
        const command = await this.createCommand(options)
        this.client.on('interaction', async (interaction) => {
            if (this.isCommand(interaction, command)) {
                const params = {}
                console.log(`Command '${command.name}' called with params:`);
                interaction.options.forEach((option) => {
                    params[option.name] = option;
                    console.log(`\t${option.name}: ${option.value}`);
                });

                await handler(interaction, params).catch((reason) => {
                    if (interaction.deferred) {
                        interaction.editReply(JSON.stringify(reason));
                    } else {
                        interaction.reply(JSON.stringify(reason));
                    }
                });
            }
        });
    }

    isCommand(interaction, command) {
        return interaction.isCommand() && interaction.commandID === command.id;
    }

    async createCommand(options) {
        if (NODE_ENV === 'development') {
            return this.client.guilds.cache.get(DISCORD_TESTING_GUILD_ID)?.commands.create(options);
        } else {
            return this.client.application.commands.create(options);
        }
    }

    initCommands() {
        this.addCommand({
            name: 'ping',
            description: 'Ping al servidor'
        }, async (interaction) => {
            interaction.reply(`📈 Ping promedio al API: ${Math.round(interaction.client.ws.ping)} ms`).catch(console.error);
        });
        this.addCommand({
            name: 'message',
            description: 'Enviar mensaje directo a usuario como este bot',
            options: [
                {
                    name: 'id',
                    type: 'STRING',
                    description: 'El id del usuario al cual enviar el mensaje',
                    required: true
                },
                {
                    name: 'message',
                    type: 'STRING',
                    description: 'El mensaje a enviar al usuario proporcionado',
                    required: true
                }
            ]
        }, async (interaction, params) => {
            if (interaction.user && interaction.user.id === '353337058271690755') {
                const member = this.client.users.cache.get(params.id.value);
                if (member) {
                    member.send(params.message.value);
                    interaction.reply(`Mensaje enviado a <@${params.id.value}>`);
                } else {
                    interaction.reply('Usuario no encontrado, ¿el usuario se encuentra en un servidor con este bot?');
                }
            } else {
                interaction.reply(`Solamente <@353337058271690755> puede utilizar este comando`);
            }
        });
    }
}

module.exports = DiscordBot;
