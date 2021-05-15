import { EnvPortAdapter, EventSubListener } from 'twitch-eventsub';
import { NgrokAdapter } from 'twitch-eventsub-ngrok';

class TwitchEventListener extends EventSubListener {
    #client;

    constructor({ client, domain }) {
        super(client, TwitchEventListener.#buildListenerAdapter(domain), 'thisShouldBeARandomlyGeneratedFixedString');
        this.#client = client;
    }

    async resetSubscriptions() {
        return await this.#client.helix.eventSub.deleteAllSubscriptions();
    }

    async currentSubscriptions() {
        const subscribedEvents = await this.#client.helix.eventSub.getSubscriptions();
        const subscriptions = [];
        subscribedEvents.data.forEach((subscribedEvent) => {
            subscriptions.push({
                status: subscribedEvent.status,
                type: subscribedEvent.type,
                condition: subscribedEvent.condition,
                transport: subscribedEvent._transport
            })
        });
        return subscriptions;
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

export default TwitchEventListener;
