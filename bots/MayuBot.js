const DiscordBot = require('../lib/DiscordBot');
const {
    MAYU_BOT_DISCORD_TOKEN
} = require('../lib/Settings');

class MayuBot extends DiscordBot {
    #eventsListener;
    #twitchClient;
    #twitchChannel;
    #twitterChannel;

    constructor({ eventsListener, twitchClient }) {
        super({ token: MAYU_BOT_DISCORD_TOKEN });
        this.#eventsListener = eventsListener;
        this.#twitchClient = twitchClient;
    }

    async init() {
        await this.#eventsListener.subscribeToStreamOnlineEvents('731516958', (e) => {
            if (this.#twitchChannel) {
                this.#twitchChannel.send(`@here ${e.broadcasterDisplayName} is now live on https://twitch.tv/${e.broadcasterDisplayName}`);
            }
        });
    }

    initDiscordComponents() {
        this.#twitchClient.helix.users.getUserById('731516958').then(twitch_user => {
            this.client.user.setActivity(`Art`, { type: "STREAMING", url: `https://twitch.tv/${twitch_user.displayName}` });
        });
        this.#twitchChannel = this.client.channels.cache.get('898622338596220928');
        this.#twitterChannel = this.client.channels.cache.get('898622379524259881');
    }
}

module.exports = MayuBot;
