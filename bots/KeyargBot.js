const DiscordBot = require('../lib/DiscordBot');
const {
    KEYARG_DISCORD_TOKEN
} = require('../lib/Settings');

class KeyargBot extends DiscordBot {
    constructor() {
        super({ token: KEYARG_DISCORD_TOKEN });
    }

    async init() {
        this.client.on("ready", (_data) => {
            this.client.user.setActivity(`osu!`, {type: "PLAYING"});
        });
    }
}

module.exports = KeyargBot;
