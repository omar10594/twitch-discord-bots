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
    #ganbareSenpaiResource;
    #audioPlayer;

    constructor({ eventsListener }) {
        super({ token: NAGATORO_SAN_DISCORD_TOKEN });
        this.#eventsListener = eventsListener;
        this.#userIdToStalk = NAGATORO_SAN_DISCORD_STALK;
        this.#ganbareSenpaiResource = createAudioResource('files/audios/full_nagatoro_ganbare_ganbare_senpai.ogg');
        this.#audioPlayer = createAudioPlayer();
    }

    async init() {
        await this.#initDiscordEvents();
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

        await this.listenChannelEvents('142110121', '353337058271690755', 'StreamOnline', channelStartedStreamMessage);
        await this.listenChannelEvents('227353789', '353337058271690755', 'StreamOnline', channelStartedStreamMessage);
        await this.listenChannelEvents('462742579', '353337058271690755', 'StreamOnline', channelStartedStreamMessage);
        await this.listenChannelEvents('511200875', '353337058271690755', 'StreamOnline', channelStartedStreamMessage);
        await this.listenChannelEvents('167553789', '353337058271690755', 'ChannelUpdate', (e) => {
            return 'Asi que actualizaste la informacion de tu stream senpai :smirk:'
        });
    }

    async #initDiscordEvents() {
        this.client.on("ready", (_data) => {
            this.client.user.setActivity(`a senpai `, {type: "WATCHING"});
        });
        if (this.#userIdToStalk) {
            let leaveTimer = null;
            this.client.on('voiceStateUpdate', async (oldState, newState) => {
                const discordUser = await this.client.users.fetch(this.#userIdToStalk);
                if (newState.id === this.#userIdToStalk) {
                    if (newState.channel) {
                        await discordUser.send({
                            content: 'senpai',
                            files: [{
                                attachment: 'files/nagatoro.gif'
                            }]
                        });
                        await this.joinChannel(newState.channel)
                    } else if (oldState.channel) {
                        await oldState.disconnect();
                    }
                }
            });
        }
    }

    async joinChannel(channel) {
        let leaveTimer = null;
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });
        connection.subscribe(this.#audioPlayer);
        clearTimeout(leaveTimer);
        return connection.on(VoiceConnectionStatus.Ready, () => {
            this.#audioPlayer.play(this.#ganbareSenpaiResource);
            leaveTimer = setTimeout(() => {
                this.#audioPlayer.stop();
                connection.destroy();
            }, 20 * 1000);
        });
    }

    async initCommands() {
        await super.initCommands();
        await this.addAdminCommand({
            name: 'unirse',
            description: 'Unirse a un canal de voz',
            options: [
                {
                    name: 'canal',
                    type: 'CHANNEL',
                    description: 'Canal al que se debe unir',
                    required: true
                }
            ]
        }, async (interaction) => {
            await interaction.deferReply({ ephemeral: true });
            await this.joinChannel(interaction.options.getChannel('canal'))
            await interaction.editReply({ content: `Se ha unido al canal.`, ephemeral: true });
        });
    }
}

module.exports = NagatoroSanBot;
