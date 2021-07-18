const { ClientCredentialsAuthProvider } = require('twitch-auth');
const { ApiClient } = require('twitch');
const {
    TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET
} = require('./Settings');

class ClientCredentialsTwitchClient extends ApiClient {
    constructor() {
        const authProvider = new ClientCredentialsAuthProvider(TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET);
        super({ authProvider });
    }
}

module.exports = ClientCredentialsTwitchClient;
