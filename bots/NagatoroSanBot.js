const DiscordBot = require('../lib/DiscordBot');
const { createReadStream } = require('fs');
const {
    joinVoiceChannel,
    VoiceConnectionStatus,
    createAudioPlayer,
    createAudioResource,
    StreamType,
    AudioPlayerStatus
} = require('@discordjs/voice');
const {
    NAGATORO_SAN_DISCORD_TOKEN,
    NAGATORO_SAN_DISCORD_STALK,
} = require('../lib/Settings');

class NagatoroSanBot extends DiscordBot {
    #eventsListener;
    #userIdToStalk;
    #audioPlayer;

    constructor({ eventsListener }) {
        super({ token: NAGATORO_SAN_DISCORD_TOKEN });
        this.#eventsListener = eventsListener;
        this.#userIdToStalk = NAGATORO_SAN_DISCORD_STALK;
    }

    async init() {
        await this.#initTwitchEvents();
    }

    async listenChannelEvents(twitchUserId, discordUserId, event, messageCallback) {
        await this.#eventsListener[`subscribeTo${event}Events`](twitchUserId, async (e) => {
            const discordUser = await this.client.users.fetch(discordUserId);
            const message = messageCallback(e);
            console.log(`Event ${event} for channel ${e.broadcasterDisplayName} was fired and the message "${message}" was send to ${discordUser.name} discord user`)
            discordUser.send(message);
        });

        console.log(`Added ${event} event listener for channel ${twitchUserId} to notify user ${discordUserId}`);
    }

    async #initTwitchEvents() {
        let channelStartedStreamMessage = (e) => {
            return `El canal ${e.broadcasterDisplayName} ha empezado stream en https://twitch.tv/${e.broadcasterDisplayName}`;
        }

        await this.listenChannelEvents('227353789', '353337058271690755', 'StreamOnline', channelStartedStreamMessage);
        await this.listenChannelEvents('462742579', '353337058271690755', 'StreamOnline', channelStartedStreamMessage);
        await this.listenChannelEvents('557278386', '353337058271690755', 'StreamOnline', channelStartedStreamMessage);
    }

    // initDiscordComponents() {
    //     this.#audioPlayer = createAudioPlayer();
    // }

    // async joinChannel(channel) {
    //     let leaveTimer = null;
    //     const connection = joinVoiceChannel({
    //         channelId: channel.id,
    //         guildId: channel.guild.id,
    //         adapterCreator: channel.guild.voiceAdapterCreator
    //     });
    //     clearTimeout(leaveTimer);
    //     return connection.on(VoiceConnectionStatus.Ready, () => {
    //         this.#audioPlayer.play(createAudioResource(__dirname + 'FILE'));
    //         connection.subscribe(this.#audioPlayer);
    //         leaveTimer = setTimeout(() => {
    //             this.#audioPlayer.stop();
    //             connection.destroy();
    //         }, 20 * 1000);
    //     });
    // }
    //
    // async initCommands() {
    //     await super.initCommands();
    //     await this.addAdminCommand({
    //         name: 'unirse',
    //         description: 'Unirse a un canal de voz',
    //         options: [
    //             {
    //                 name: 'canal',
    //                 type: 'CHANNEL',
    //                 description: 'Canal al que se debe unir',
    //                 required: true
    //             }
    //         ]
    //     }, async (interaction) => {
    //         await interaction.deferReply({ ephemeral: true });
    //         await this.joinChannel(interaction.options.getChannel('canal'))
    //         await interaction.editReply({ content: `Se ha unido al canal.`, ephemeral: true });
    //     });
    // }
}

module.exports = NagatoroSanBot;
