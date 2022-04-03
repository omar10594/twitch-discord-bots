require('dotenv').config()

const ClientCredentialsTwitchClient = require('./lib/ClientCredentialsTwitchClient');
const TwitchEventListener = require('./lib/TwitchEventListener')
const {
  NagatoroSanBot,
} = require('./bots');
const { generateDependencyReport } = require('@discordjs/voice');

const twitchClient = new ClientCredentialsTwitchClient();
const twitchEventListener = new TwitchEventListener({ client: twitchClient });
const nagatoroSanBot = new NagatoroSanBot({ eventsListener: twitchEventListener });

(async () => {
  console.log(generateDependencyReport());

  await twitchEventListener.resetSubscriptions();

  await nagatoroSanBot.init();

  await twitchEventListener.listen();
})();
