import { Client } from "discord.js";

class DiscordBot {
    constructor({ token }) {
        if (token) {
            this.client = this.#buildDiscordClient(token);
        }
    }

    #buildDiscordClient(token) {
        const discordClient = new Client({ disableMentions: "everyone", restTimeOffset: 0 });
        discordClient.login(token).then((_) => console.log('Logged in Discord API'));
        discordClient.on("ready", (_data) => {
            console.log(`${discordClient.user.username} ready!`);
        });
        discordClient.on("warn", console.log);
        discordClient.on("error", console.error);
        return discordClient;
    }
}

export default DiscordBot;
