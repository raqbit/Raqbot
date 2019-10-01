import * as Discord from 'discord.js';

import CommandManager from './commands/command.manager';
import Statistics from './features/statistics';
import Firebase from './util/firebase';
import Util from './util/util';

const Settings = Util.loadJSONFile('../../settings.json');

const firebaseKey =  Util.loadJSONFile('../../priv/serviceAccountKey.json');

class Raqbot {

    /**
     * Firebase instance for interacting with the database
     */
    public firebase: Firebase;

    /**
     * Statistics instance that keeps track of statistics
     */
    public statistics: Statistics;

    /**
     * Discord.js client instance
     */
    private client: Discord.Client;

    /**
     * CommandManager instance for running commands
     */
    private cmdManager: CommandManager;

    constructor() {
        this.client = new Discord.Client();
        this.firebase = new Firebase(firebaseKey, Settings.dbURL, Settings.functionsURL);
        this.statistics = new Statistics(this.firebase);
        this.cmdManager = new CommandManager(this);

        // Setting up events
        this.client.on('ready', () => this.onBotReady());
        this.client.on('message', (message: Discord.Message) => this.onMessage(message));

        if (Settings.dev.enabled) {
            console.log('Running in dev mode.');
        } else {
            console.log('Running in normal mode.');
        }
    }

    /**
     * Logs the bot in using the auth key
     * @param key - Discord authentication key
     */
    public login(key: string): Promise<string> {
        return this.client.login(key);
    }

    /**
     * Makes the bot logout & stops discord.js
     */
    public logout() {
        // noinspection JSIgnoredPromiseFromCall
        this.client.destroy();
    }

    /**
     * Is called when the bot receives a message
     * @param {Message} message - Message event
     */
    public onMessage(message: Discord.Message) {

        // Only channel input
        if (message.channel.type !== "text") {
            return;
        }

        // Don't wanna log bot output
        if (message.author.bot) {
            return;
        }

        // Dev-mode checks
        if (Settings.dev.enabled) {
            if ((message.channel as Discord.TextChannel).name !== Settings.dev.channel) {
                return;
            }
        } else {
            if ((message.channel as Discord.TextChannel).name === Settings.dev.channel) {
                return;
            }
        }

        // Checking for commands
        if (message.content.charAt(0) === Settings.cmdPrefix) {
            this.cmdManager.evalCommand(message);
            return;
        }

        this.statistics.evalMessage(message);
    }

    private onBotReady() {
        // noinspection JSIgnoredPromiseFromCall
        this.client.user.setPresence({afk: false, status: "online", game: {name: "Spying on the Mancave"}});
    }
}

export default Raqbot;
