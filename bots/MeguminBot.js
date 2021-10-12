const DiscordBot = require('../lib/DiscordBot');
const {
    MEGUMIN_DISCORD_TOKEN
} = require('../lib/Settings');

class MeguminBot extends DiscordBot {
    constructor() {
        super({ token: MEGUMIN_DISCORD_TOKEN });
    }

    initDiscordComponents() {
        this.client.user.setActivity(`Explosioooon!!!`, { type: "LISTENING" });
    }

    async init() {
    }
}

module.exports = MeguminBot;
