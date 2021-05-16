import { Client, Intents } from "discord.js";

class DiscordBot {
    constructor({ token }) {
        if (token) {
            this.client = this.#buildDiscordClient(token);
        }
    }

    #buildDiscordClient(token) {
        const discordClient = new Client({ intents: Intents.ALL });
        discordClient.login(token).then((_) => console.log('Logged in Discord API'));
        discordClient.once("ready", (_data) => {
            console.log(`${discordClient.user.username} ready!`);
            this.#initBasicCommands();
        });
        discordClient.on("warn", console.log);
        discordClient.on("error", console.error);
        return discordClient;
    }

    #addCommand({ name, description, options = null, defaultPermission = null }, handler) {
        this.client.on('interaction', interaction => {
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

                handler(interaction, params);
            }
        });
        this.client.application.commands.create({ name, description, options, defaultPermission });
    }

    #initBasicCommands() {
        this.#addCommand({
            name: 'ping',
            description: 'Ping al servidor'
        }, (interaction) => {
            interaction.reply(`📈 Ping promedio al API: ${Math.round(interaction.client.ws.ping)} ms`).catch(console.error);
        });
        this.#addCommand({
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
        }, (interaction, params) => {
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

export default DiscordBot;