import Settings from '../lib/Settings.js';
import { ClientCredentialsAuthProvider } from 'twitch-auth';
import { Client as DiscordClient } from "discord.js";
import { ApiClient as TwitchClient } from 'twitch';
import { DirectConnectionAdapter, EventSubListener } from 'twitch-eventsub';
import { NgrokAdapter } from 'twitch-eventsub-ngrok';

class NagatoroSanBot {
    constructor() {
        this._twitchClient = this.#buildTwitchClient();
        this._twitchEventListener = this.#buildTwitchEventListener();
        this._discordClient = this.#buildDiscordClient();
    }

    async initListener() {
        await this._twitchClient.helix.eventSub.deleteAllSubscriptions();
    }

    async listen() {
        await this._twitchEventListener.listen();
    }

    async listenChannelEvents(twitchUserId, discordUserId, event, messageCallback) {
        const discordUser = await this._discordClient.users.fetch(discordUserId);

        await this._twitchEventListener[`subscribeTo${event}Events`](twitchUserId, (e) => {
            const message = messageCallback(e);
            console.log(`Event ${event} for channel ${e.broadcasterDisplayName} was fired and the message "${message}" was send to ${discordUser.name} discord user`)
            discordUser.send(message);
        });

        console.log(`Added ${event} event listener for channel ${twitchUserId} to notify user ${discordUserId}`);
    }

    async currentSubscriptions() {
        const subscribedEvents = await this._twitchClient.helix.eventSub.getSubscriptions();
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

    #buildTwitchClient() {
        const authProvider = new ClientCredentialsAuthProvider(Settings.NAGATORO_SAN_TWITCH_CLIENT_ID, Settings.NAGATORO_SAN_TWITCH_CLIENT_SECRET);
        return new TwitchClient({ authProvider });
    }

    #buildTwitchEventListener() {
        return new EventSubListener(this._twitchClient, this.#twitchEventListenerAdapter(), 'thisShouldBeARandomlyGeneratedFixedString');
    }

    #twitchEventListenerAdapter() {
        if (Settings.SSL_CERT && Settings.SSL_KEY && Settings.SSL_HOSTNAME) {
            console.log('Twitch event listener using SSL');
            return new DirectConnectionAdapter({
              hostName: Settings.SSL_HOSTNAME,
              sslCert: {
                key: Settings.SSL_KEY,
                cert: Settings.SSL_CERT
              }
            });
        } else {
            console.log('Twitch event listener using Ngrok');
            return new NgrokAdapter();
        }
    }

    #buildDiscordClient() {
        const discordClient = new DiscordClient({ disableMentions: "everyone", restTimeOffset: 0 });
        discordClient.login(Settings.NAGATORO_SAN_DISCORD_TOKEN).then((_) => console.log('Logged in Discord API'));
        discordClient.on("ready", (_data) => {
            console.log(`${discordClient.user.username} ready!`);
            discordClient.user.setActivity(`a senpai `, {type: "WATCHING"}).then((_) => console.log('Bot status assigned'));
        });
        discordClient.on("warn", console.log);
        discordClient.on("error", console.error);
        return discordClient;
    }
}

export default NagatoroSanBot;
