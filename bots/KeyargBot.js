const DiscordBot = require('../lib/DiscordBot');
const {
    KEYARG_DISCORD_TOKEN
} = require('../lib/Settings');

class KeyargBot extends DiscordBot {
    constructor() {
        super({ token: KEYARG_DISCORD_TOKEN });
    }

    initDiscordComponents() {
        this.client.user.setActivity(`osu!`, {type: "PLAYING"});
    }

    async init() {
    }
}

module.exports = KeyargBot;
