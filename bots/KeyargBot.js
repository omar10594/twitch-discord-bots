import DiscordBot from "../lib/DiscordBot.js";

class KeyargBot extends DiscordBot {
    async init() {
        this.client.on("ready", (_data) => {
            this.client.user.setActivity(`osu!`, {type: "PLAYING"});
        });
    }
}

export default KeyargBot;
