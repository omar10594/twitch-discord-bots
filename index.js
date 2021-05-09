import NagatoroSanBot from './bots/NagatoroSanBot.js';
import Webapp from './lib/Webapp.js';

const nagatoroSanBot = new NagatoroSanBot();
// const webapp = new Webapp();

function channelStartedStreamMessage(e) {
    return `El canal ${e.broadcasterDisplayName} ha empezado stream en https://twitch.tv/${e.broadcasterDisplayName}`;
}

await nagatoroSanBot.initListener();

await nagatoroSanBot.listenChannelEvents('142110121', '353337058271690755', 'StreamOnline', channelStartedStreamMessage);
await nagatoroSanBot.listenChannelEvents('227353789', '353337058271690755', 'StreamOnline', channelStartedStreamMessage);
await nagatoroSanBot.listenChannelEvents('462742579', '353337058271690755', 'StreamOnline', channelStartedStreamMessage);
await nagatoroSanBot.listenChannelEvents('511200875', '353337058271690755', 'StreamOnline', channelStartedStreamMessage);
await nagatoroSanBot.listenChannelEvents('450122015', '364170048677609475', 'StreamOnline', (e) => {
    return 'Asi que haces stream senpai :smirk:'
});
await nagatoroSanBot.listenChannelEvents('167553789', '353337058271690755', 'ChannelUpdate', (e) => {
    return 'Asi que actualizaste la informacion de tu stream senpai :smirk:'
});

await nagatoroSanBot.listen();

// webapp.addRoute('/nagatoro-san/subscriptions', async () => {
//     return {
//         message: 'OK',
//         subscriptions: await nagatoroSanBot.currentSubscriptions()
//     }
// });

