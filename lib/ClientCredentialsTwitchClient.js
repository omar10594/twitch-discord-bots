import { ClientCredentialsAuthProvider } from 'twitch-auth';
import { ApiClient } from 'twitch';

class ClientCredentialsTwitchClient extends ApiClient {
    constructor({ clientId, clientSecret }) {
        const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
        super({ authProvider });
    }
}

export default ClientCredentialsTwitchClient;
