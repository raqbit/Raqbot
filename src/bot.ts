import Discord = require('discord.js');

import CommandManager = require('./commands/command.manager');
import Firebase = require('./util/firebase');
import Statistics = require('./features/statistics');

const firebaseKey = require('../priv/serviceAccountKey.json');
const settings = require('../settings.json');

class Raqbot {

    /**
     * Discord.js client instance
     */
    private client: Discord.Client;

    /**
     * CommandManager instance for running commands
     */
    private cmdManager: CommandManager;

    /**
     * Firebase instance for interacting with the database
     */
    public firebase: Firebase;

    /**
     * Statistics instance that keeps track of statistics
     */
    public statistics: Statistics;

    constructor() {
        this.client = new Discord.Client();
        this.firebase = new Firebase(firebaseKey, settings.dbURL);
        this.statistics = new Statistics(this.firebase);
        this.cmdManager = new CommandManager(this);

        // Setting up events
        this.client.on('message', (message: Discord.Message) => this.onMessage(message));
    }

    /**
     * Logs the bot in using the auth key
     * @param key - Discord authentication key
     */
    login(key: string): Promise<string> {
        return this.client.login(key);
    }

    /**
     * Makes the bot logout & stops discord.js
     */
    logout() {
        this.client.destroy();
    }

    /**
     * Is called when the bot receives a message
     * @param {Message} message - Message event
     */
    onMessage(message: Discord.Message) {

        // Extra type check needed for typescript
        if (message.author.bot ||
            (!settings.dev.enabled &&
                message.channel instanceof Discord.GuildChannel
                && message.channel.name === settings.dev.channel)) {
            return;
        }

        // Checking for commands
        if (message.content.charAt(0) === settings.cmdPrefix) {
            this.cmdManager.evalCommand(message);
            return;
        }

        this.statistics.evalMessage(message);
    }
}

export = Raqbot;