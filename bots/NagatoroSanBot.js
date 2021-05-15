import DiscordBot from "../lib/DiscordBot.js";

class NagatoroSanBot extends DiscordBot {
    #eventsListener;
    #userIdToStalk;

    constructor({ token, eventsListener, userIdToStalk }) {
        super({ token });
        this.#eventsListener = eventsListener;
        this.#userIdToStalk = userIdToStalk;
    }

    async init() {
        await this.#initDiscordEvents();
        await this.#initTwitchEvents();
    }

    async listenChannelEvents(twitchUserId, discordUserId, event, messageCallback) {
        const discordUser = await this.client.users.fetch(discordUserId);

        await this.#eventsListener[`subscribeTo${event}Events`](twitchUserId, (e) => {
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
        await this.listenChannelEvents('450122015', '364170048677609475', 'StreamOnline', (e) => {
            return 'Asi que haces stream senpai :smirk:'
        });
        await this.listenChannelEvents('167553789', '353337058271690755', 'ChannelUpdate', (e) => {
            return 'Asi que actualizaste la informacion de tu stream senpai :smirk:'
        });
    }

    async #initDiscordEvents() {
        this.client.on("ready", (_data) => {
            this.client.user.setActivity(`a senpai `, {type: "WATCHING"}).then((_) => console.log('Bot status assigned'));
        });
        if (this.#userIdToStalk) {
            let leaveTimer = null;
            this.client.on('voiceStateUpdate', async (oldState, newState) => {
                const discordUser = await this.client.users.fetch(this.#userIdToStalk);
                if (newState.id == this.#userIdToStalk) {
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

export default NagatoroSanBot;
