import DiscordBot from "../lib/DiscordBot.js";

class MeguminBot extends DiscordBot {
    async init() {
        this.client.on("ready", (_data) => {
            this.client.user.setActivity(`Explosioooon!!!`, { type: "LISTENING" });
        });
    }
}

export default MeguminBot;
