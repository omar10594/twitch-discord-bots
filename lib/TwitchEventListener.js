const { EnvPortAdapter, EventSubListener } = require('twitch-eventsub');
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
            console.log('Twitch event listener using SSL');
            return new EnvPortAdapter({ hostName: domain })
        } else {
            console.log('Twitch event listener using Ngrok');
            return new NgrokAdapter();
        }
    }
}

module.exports = TwitchEventListener;
