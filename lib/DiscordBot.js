const { Client, Intents, Permissions } = require('discord.js');
const {
    NODE_ENV,
    DISCORD_TESTING_GUILD_ID
} = require('./Settings');

class DiscordBot {
    constructor({ token }) {
        if (token) {
            this.client = this.#buildDiscordClient(token);
        }
        this.commands = [];
    }


    #buildDiscordClient(token) {
        const discordClient = new Client({ intents: [
          Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILDS
        ]});

        discordClient.login(token);
        discordClient.once("ready", async (_data) => {
            await this.resetCommands();
            await this.initCommands();
            this.initEvents();
            console.log(`${discordClient.user.username} ready!`);
        });
        discordClient.on("warn", console.log);
        discordClient.on("error", console.error);

        return discordClient;
    }

    async resetCommands() {
        if (NODE_ENV === 'development') {
            return this.client.guilds.cache.get(DISCORD_TESTING_GUILD_ID)?.commands.set([]);
        } else {
            return this.client.application.commands.set([]);
        }
    }

    async addCommand(options, handler) {
        if (NODE_ENV === 'development') {
            options.name = `${options.name}_test`;
        }
        const command = await this.createCommand(options);
        this.commands[command.id] = {
            id: command.id,
            name: command.name,
            handler: handler
        };
        return command;
    }

    async addAdminCommand(options, handler) {
        options.defaultPermission = false;
        await this.addCommand(options, handler);
        await command.permissions.add({ permissions: this.adminPermissions() });
    }

    initEvents() {
        this.client.on('interactionCreate', async (interaction) => {
            if (interaction.isCommand() && this.commands[interaction.commandId]) {
                const command = this.commands[interaction.commandId]
                console.log(`Command '${command.name}' called.`);

                await command.handler(interaction).catch((error) => {
                    const errorMessage = `${error?.toString() || 'Error'}: \`\`\`${JSON.stringify(error)}\`\`\``
                    if (interaction.deferred) {
                        interaction.editReply({ content: errorMessage, ephemeral: true });
                    } else {
                        interaction.reply({ content: errorMessage, ephemeral: true });
                    }
                });
            }
        });
    }

    async createCommand(options) {
        if (NODE_ENV === 'development') {
            return this.client.guilds.cache.get(DISCORD_TESTING_GUILD_ID)?.commands.create(options);
        } else {
            return this.client.application.commands.create(options);
        }
    }

    async initCommands() {
        await this.addCommand({
            name: 'ping',
            description: 'Ping al servidor',
        }, async (interaction) => {
            await interaction.reply({ content: `📈 Ping promedio al API: ${Math.round(interaction.client.ws.ping)} ms`, ephemeral: true });
        });
        await this.addAdminCommand({
            name: 'mensaje',
            description: 'Enviar mensaje directo a usuario como este bot',
            options: [
                {
                    name: 'usuario',
                    type: 'USER',
                    description: 'El usuario al cual enviar el mensaje',
                    required: true
                },
                {
                    name: 'mensaje',
                    type: 'STRING',
                    description: 'El mensaje a enviar al usuario proporcionado',
                    required: true
                }
            ]
        }, async (interaction) => {
            const member = interaction.options.getMember('usuario');
            if (member) {
                await interaction.deferReply({ ephemeral: true });
                await member.send(interaction.options.getString('mensaje'));
                await interaction.editReply({ content: `Mensaje enviado a <@${member.id}>`, ephemeral: true });
            } else {
                await interaction.reply({ content: 'Usuario no encontrado, ¿el usuario se encuentra en un servidor con este bot?', ephemeral: true });
            }
        });
    }

    adminPermissions() {
        const permissions = [];
        this.client.guilds.cache.each((guild) => {
            // guild.roles.cache.each((role) => {
            //     if (!role.managed && role.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            //         permissions.push({ id: role.id, type: 'ROLE', permission: true });
            //     }
            // });
            permissions.push({ id: guild.ownerId, type: 'USER', permission: true });
        });
        return permissions;
    }
}

module.exports = DiscordBot;
