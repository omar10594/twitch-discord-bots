import Settings from './lib/Settings.js';
import ClientCredentialsTwitchClient from './lib/ClientCredentialsTwitchClient.js';
import TwitchEventListener from './lib/TwitchEventListener.js';
import NagatoroSanBot from './bots/NagatoroSanBot.js';
import KeyargBot from "./bots/KeyargBot.js";
import IsoNyanBot from "./bots/IsoNyanBot.js";
import MeguminBot from "./bots/MeguminBot.js";

const twitchClient = new ClientCredentialsTwitchClient({
    clientId: Settings.TWITCH_CLIENT_ID,
    clientSecret: Settings.TWITCH_CLIENT_SECRET
});
const twitchEventListener = new TwitchEventListener({
    client: twitchClient,
    domain: Settings.DOMAIN
});
const nagatoroSanBot = new NagatoroSanBot({
    token: Settings.NAGATORO_SAN_DISCORD_TOKEN,
    eventsListener: twitchEventListener,
    userIdToStalk: Settings.NAGATORO_SAN_DISCORD_STALK
});
const keyargBot = new KeyargBot({
    token: Settings.KEYARG_DISCORD_TOKEN
});
const isoNyanBot = new IsoNyanBot({
    token: Settings.ISONYAN_DISCORD_TOKEN,
    eventsListener: twitchEventListener
});
const meguminBot = new MeguminBot({
    token: Settings.MEGUMIN_DISCORD_TOKEN
});

twitchEventListener.resetSubscriptions();

await meguminBot.init();
await nagatoroSanBot.init();
await keyargBot.init();
await isoNyanBot.init();

twitchEventListener.listen();
