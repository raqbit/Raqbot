import Discord = require('discord.js');
import Raqbot = require('../bot');

abstract class Command {

    /**
     * Contains all labels for the command
     */
    public aliases: string[];

    constructor(bot: Raqbot, aliases: string[]) {
        this.aliases = aliases;
    }

    /**
     * Executes the command
     * @param message - Message event that caused command to execute
     * @param args  - Passed command argruments without label
     */
    execute(message: Discord.Message, args: string[]) { }
}

export = Command;