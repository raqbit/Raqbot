import * as Discord from 'discord.js';
import Raqbot from '../bot';

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
    public execute(message: Discord.Message, args: string[]) { }
}

export default Command;
