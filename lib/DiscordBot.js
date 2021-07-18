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
            this.initCommands();
        });
        discordClient.on("warn", console.log);
        discordClient.on("error", console.error);
        return discordClient;
    }

    addCommand({ name, description, options = null, defaultPermission = null }, handler) {
        this.client.on('interaction', async (interaction) => {
            // If the interaction isn't a slash command, return
            if (!interaction.isCommand()) return;

            // Check if it is the correct command
            if (interaction.commandName === name) {
                const params = {}
                console.log(`Command '${name}' called with params:`);
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
        if (NODE_ENV === 'development') {
            name = `guild_${name}`;
        }
        const commandSettings = { name, description, options, defaultPermission };
        if (NODE_ENV === 'development') {
            this.client.guilds.cache.get(DISCORD_TESTING_GUILD_ID)?.commands.create(commandSettings);
        } else {
            this.client.application.commands.create(commandSettings);
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
