import DiscordBot from "../lib/DiscordBot.js";

class IsoNyanBot extends DiscordBot {
    #eventsListener;
    #twitchClient;

    constructor({ token, eventsListener, twitchClient }) {
        super({ token });
        this.#eventsListener = eventsListener;
        this.#twitchClient = twitchClient;
    }

    async init() {
        await this.#eventsListener.subscribeToStreamOnlineEvents('450122015', (e) => {
            this.notifyChannelOnline(e.broadcasterDisplayName, '607668188703883304');
        });
        await this.#eventsListener.subscribeToStreamOnlineEvents('588172486', (e) => {
            this.notifyChannelOnline(e.broadcasterDisplayName, '607668188703883304');
        });
    }

    initCommands() {
        super.initCommands();
        this.addCommand({
            name: 'notify_stream',
            description: 'Notificar que un canal inicio directo',
            options: [
                {
                    name: 'twitch_name',
                    type: 'STRING',
                    description: 'Nombre del canal de twitch',
                    required: true
                },
                {
                    name: 'channel_id',
                    type: 'STRING',
                    description: 'El id del canal donde notificar',
                    required: true
                }
            ]
        }, async (interaction, params) => {
            if (interaction.user && interaction.user.id === '353337058271690755') {
                this.notifyChannelOnline(params.twitch_name.value, params.channel_id.value)
                interaction.reply(`Se ha enviado la notificacion.`);
            } else {
                interaction.reply(`Solamente <@353337058271690755> puede utilizar este comando`);
            }
        });
        this.addCommand({
            name: 'twitch_id',
            description: 'Obtener el id de un canal de twitch en base al nombre',
            options: [
                {
                    name: 'twitch_name',
                    type: 'STRING',
                    description: 'Nombre del canal de twitch',
                    required: true
                }
            ]
        }, async (interaction, params) => {
            await interaction.defer();
            const twitch_user = await this.#twitchClient.helix.users.getUserByName(params.twitch_name.value);
            if (twitch_user) {
                interaction.reply(`El ID del canal ${twitch_user.display_name} es: ${twitch_user.id}`);
            } else {
                interaction.reply(`No se encontro el canal ${params.twitch_name.value} en twitch`);
            }
        });
    }

    notifyChannelOnline(twitchName, discordChannel) {
        console.log(`Notification for online channel ${twitchName} was fired and the discord channel ${discordChannel} will be notified`);
        const channel = this.client.channels.cache.get(discordChannel);
        if (channel) {
            channel.send(`@here ${twitchName} esta en directo en https://twitch.tv/${twitchName}`);
        } else {
            console.error(`Notification error for channel ${twitchName}: channel ${discordChannel} not in cache`);
        }
    }
}

export default IsoNyanBot;
