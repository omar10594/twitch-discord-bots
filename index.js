require('dotenv').config()

const ClientCredentialsTwitchClient = require('./lib/ClientCredentialsTwitchClient');
const TwitchEventListener = require('./lib/TwitchEventListener')
const {
  NagatoroSanBot,
  IsoNyanBot,
} = require('./bots');
const { generateDependencyReport } = require('@discordjs/voice');

const twitchClient = new ClientCredentialsTwitchClient();
const twitchEventListener = new TwitchEventListener({ client: twitchClient });
const nagatoroSanBot = new NagatoroSanBot({ eventsListener: twitchEventListener });
const isoNyanBot = new IsoNyanBot({ eventsListener: twitchEventListener, twitchClient: twitchClient });

(async () => {
  console.log(generateDependencyReport());

  await twitchEventListener.resetSubscriptions();

  await nagatoroSanBot.init();
  await isoNyanBot.init();

  await twitchEventListener.listen();
})();
