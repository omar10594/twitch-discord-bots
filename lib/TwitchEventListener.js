const { ReverseProxyAdapter, EventSubListener } = require('twitch-eventsub');
const { NgrokAdapter } = require('twitch-eventsub-ngrok');
const {
    DOMAIN
} = require('./Settings');

class TwitchEventListener extends EventSubListener {
    #client;

    constructor({ client }) {
        super(client, TwitchEventListener.#buildListenerAdapter(DOMAIN), 'thisShouldBeARandomlyGeneratedFixedString');
        this.#client = client;
    }

    async resetSubscriptions() {
        return await this.#client.helix.eventSub.deleteAllSubscriptions();
    }

    static #buildListenerAdapter(domain) {
        if (domain) {
            const adapter = new ReverseProxyAdapter({ hostName: domain || "lopezlopez.com.mx", pathPrefix: 'twitch-events' });
            console.log(`Twitch event listener using SSL ${JSON.stringify(adapter)}`);
            return adapter;
        } else {
            console.log('Twitch event listener using Ngrok');
            return new NgrokAdapter();
        }
    }
}

module.exports = TwitchEventListener;
