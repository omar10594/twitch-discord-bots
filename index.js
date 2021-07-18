require('dotenv').config()

const ClientCredentialsTwitchClient = require('./lib/ClientCredentialsTwitchClient');
const TwitchEventListener = require('./lib/TwitchEventListener')
const {
  NagatoroSanBot,
  KeyargBot,
  IsoNyanBot,
  MeguminBot
} = require('./bots');

const twitchClient = new ClientCredentialsTwitchClient();
const twitchEventListener = new TwitchEventListener({ client: twitchClient });
const nagatoroSanBot = new NagatoroSanBot({ eventsListener: twitchEventListener });
const isoNyanBot = new IsoNyanBot({ eventsListener: twitchEventListener, twitchClient: twitchClient });
const meguminBot = new MeguminBot();
const keyargBot = new KeyargBot();

(async () => {
  await twitchEventListener.resetSubscriptions();

  await meguminBot.init();
  await nagatoroSanBot.init();
  await keyargBot.init();
  await isoNyanBot.init();

  await twitchEventListener.listen();
})();
