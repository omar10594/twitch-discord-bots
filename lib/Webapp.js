import Settings from '../lib/Settings.js';
import express from 'express';
import { ClientCredentialsAuthProvider } from "twitch-auth";
import { ApiClient as TwitchClient } from "twitch";

class Webapp {
    constructor() {
        this._app = express()
        this._app.listen(Settings.PORT);
        this._twitchClient = this.#buildTwitchClient();
        this.#addBaseRoutes()
    }

    addRoute(path, responseCallback) {
        this._app.get(path, async (req, res) => {
            console.log(`Requested ${path}`)
            try {
                const response = await responseCallback(req, res);
                res.send(response);
            } catch (e) {
                console.log(e)
                res.status(503).send();
            }
        });
    }

    #addBaseRoutes() {
        this.addRoute('/', async () => {
            return {
                uptime: process.uptime(),
                message: 'OK',
                timestamp: Date.now()
            };
        });
        this.addRoute('/twitch-channels/:channelName', async (req, res) => {
            const twitchUser = await this._twitchClient.helix.users.getUserByName(req.params.channelName);
            return {
                name: twitchUser.name,
                id: twitchUser.id
            };
        })
    }

    #buildTwitchClient() {
        const authProvider = new ClientCredentialsAuthProvider(Settings.WEBAPP_TWITCH_CLIENT_ID, Settings.WEBAPP_TWITCH_CLIENT_SECRET);
        return new TwitchClient({ authProvider });
    }
}

export default Webapp;