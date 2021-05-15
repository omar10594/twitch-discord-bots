import DiscordBot from "../lib/DiscordBot.js";

class KeyargBot extends DiscordBot {
    async init() {
        this.client.on("ready", (_data) => {
            this.client.user.setActivity(`Gears 5`, {type: "PLAYING"}).then((_) => console.log('Bot status assigned'));
        });
    }
}

export default KeyargBot;
