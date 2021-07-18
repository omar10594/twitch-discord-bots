const DiscordBot = require('../lib/DiscordBot');
const {
    MEGUMIN_DISCORD_TOKEN
} = require('../lib/Settings');

class MeguminBot extends DiscordBot {
    constructor() {
        super({ token: MEGUMIN_DISCORD_TOKEN });
    }

    async init() {
        this.client.on("ready", (_data) => {
            this.client.user.setActivity(`Explosioooon!!!`, { type: "LISTENING" });
        });
    }
}

module.exports = MeguminBot;
