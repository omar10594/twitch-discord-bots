const DiscordBot = require('../lib/DiscordBot');
const {
    ISONYAN_DISCORD_TOKEN
} = require('../lib/Settings');

class IsoNyanBot extends DiscordBot {
    #eventsListener;
    #twitchClient;

    constructor({ eventsListener, twitchClient }) {
        super({ token: ISONYAN_DISCORD_TOKEN });
        this.#eventsListener = eventsListener;
        this.#twitchClient = twitchClient;
    }

    async init() {
        await this.#eventsListener.subscribeToStreamOnlineEvents('450122015', (e) => {
            const channel = this.client.channels.cache.get('923758743257235546');
            if (channel) {
                channel.send(`@here ${e.broadcasterDisplayName} esta en directo en https://twitch.tv/${e.broadcasterDisplayName}`);
            }
        });
        await this.#eventsListener.subscribeToStreamOnlineEvents('588172486', (e) => {
            const channel = this.client.channels.cache.get('923758743257235546');
            if (channel) {
                channel.send(`@here ${e.broadcasterDisplayName} esta en directo en https://twitch.tv/${e.broadcasterDisplayName}`);
            }
        });
    }

    async initCommands() {
        await super.initCommands();
        await this.addAdminCommand({
            name: 'stream',
            description: 'Notificar que un canal inicio directo',
            options: [
                {
                    name: 'canal',
                    type: 'STRING',
                    description: 'Nombre del canal de twitch',
                    required: true
                }
            ]
        }, async (interaction) => {
            await interaction.deferReply({ ephemeral: true });
            await interaction.channel.send(`@here ${interaction.options.getString('canal')} esta en directo en https://twitch.tv/${interaction.options.getString('canal')}`);
            await interaction.editReply({ content: `Se ha enviado la notificacion.`, ephemeral: true });
        });
        await this.addCommand({
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
        }, async (interaction) => {
            await interaction.deferReply({ ephemeral: true });
            const twitch_user = await this.#twitchClient.helix.users.getUserByName(interaction.options.getString('twitch_name'));
            if (twitch_user) {
                await interaction.editReply({ content: `El ID del canal ${twitch_user.displayName} es: \`${twitch_user.id}\``, ephemeral: true });
            } else {
                await interaction.editReply({ content: `No se encontro el canal ${interaction.options.getString('twitch_name')} en twitch`, ephemeral: true });
            }
        });
        await this.addCommand({
            name: 'twitch_name',
            description: 'Obtener el nombre de un canal de twitch en base al id',
            options: [
                {
                    name: 'twitch_id',
                    type: 'STRING',
                    description: 'ID del canal de twitch',
                    required: true
                }
            ]
        }, async (interaction) => {
            await interaction.deferReply({ ephemeral: true });
            const twitch_user = await this.#twitchClient.helix.users.getUserById(interaction.options.getString('twitch_id'));
            if (twitch_user) {
                await interaction.editReply({ content: `El name del canal ${twitch_user.displayName} es: \`${twitch_user.name}\``, ephemeral: true });
            } else {
                await interaction.editReply({ content: `No se encontro el canal ${interaction.options.getString('twitch_id')} en twitch`, ephemeral: true });
            }
        });
        await this.addAdminCommand({
            name: 'twitch_events',
            description: 'Eventos registrados en twitch'
        }, async (interaction) => {
            await interaction.deferReply({ ephemeral: true });
            const subscribedEvents = await this.#twitchClient.helix.eventSub.getSubscriptions();
            let subscriptions = subscribedEvents.data.map((subscribedEvent) => {
                return `\`status:\` ${subscribedEvent.status} \`type:\` ${subscribedEvent.type} \`condition:\` ${JSON.stringify(subscribedEvent.condition)} \`transport:\` ${JSON.stringify(subscribedEvent._transport)}`;
            });
            await interaction.editReply({ content: subscriptions.join('\n'), ephemeral: true });
        });
    }
}

module.exports = IsoNyanBot;
