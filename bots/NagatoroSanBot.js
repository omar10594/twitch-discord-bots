const DiscordBot = require('../lib/DiscordBot');
const {
    NAGATORO_SAN_DISCORD_TOKEN,
    NAGATORO_SAN_DISCORD_STALK,
} = require('../lib/Settings');

class NagatoroSanBot extends DiscordBot {
    #eventsListener;
    #userIdToStalk;

    constructor({ eventsListener }) {
        super({ token: NAGATORO_SAN_DISCORD_TOKEN });
        this.#eventsListener = eventsListener;
        this.#userIdToStalk = NAGATORO_SAN_DISCORD_STALK;
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
                        await discordUser.send('senpai', {
                            files: [{
                                attachment: 'files/nagatoro.gif'
                            }]
                        });
                        await newState.channel.join();
                        clearTimeout(leaveTimer);
                        leaveTimer = setTimeout(function() {
                            if (newState.channel) {
                                newState.channel.leave();
                            }
                        }, 20 * 1000);

                    } else if (oldState.channel) {
                        await oldState.channel.leave();
                    }
                }
            });
        }
    }
}

module.exports = NagatoroSanBot;
