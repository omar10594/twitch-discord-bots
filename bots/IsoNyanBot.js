import DiscordBot from "../lib/DiscordBot.js";

class IsoNyanBot extends DiscordBot {
    #eventsListener;

    constructor({ token, eventsListener }) {
        super({ token });
        this.#eventsListener = eventsListener;
    }

    async init() {
        await this.#eventsListener.subscribeToStreamOnlineEvents('450122015', async (e) => {
            const channel = await this.client.channels.fetch('607668188703883304');
            console.log(`Event StreamOnline for channel ${e.broadcasterDisplayName} was fired and the discord channel 607668188703883304 will be notified`);
            channel.send(`@here Tu waifu preferida is0nyan-chan esta en directo en https://twitch.tv/${e.broadcasterDisplayName}`)
        });
    }
}

export default IsoNyanBot;
