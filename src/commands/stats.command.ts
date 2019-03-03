import * as Discord from 'discord.js';
import Raqbot from '../bot';

import Firebase from '../util/firebase';
import Command from './command';

class StatsCommand extends Command {

    private firebase: Firebase;

    constructor(bot: Raqbot, aliases: string[]) {
        super(bot, aliases);
        this.firebase = bot.firebase;
    }

    public async execute(message: Discord.Message, args: string[]) {

        let globalStats = {
            msgCount: 0,
            charCount: 0,
        }

        try {
            const fetchedStats = await this.firebase.fetchGlobalStats();

            globalStats.msgCount = fetchedStats.msgCount ? fetchedStats.msgCount : 0;
            globalStats.charCount = fetchedStats.charCount ? fetchedStats.charCount : 0;
        } catch (error) {
            message.channel.send('Could not fetch global statistics, see console for error.');
            console.log(error);
            return;
        }

        await message.channel.send('', {
            embed: new Discord.RichEmbed()
                .setTitle('Mancave-Statistics')
                .setDescription('**Global Stats:**\nMessages sent: ' +
                    globalStats.msgCount + '\nCharacters sent: ' + globalStats.charCount + '\n')
                .setURL('https://mancave-statistics.firebaseapp.com')
                .setColor('#ffc800')
                .setThumbnail('https://mancave-statistics.firebaseapp.com/favicon/mstile-310x310.png')
                .setFooter('Click link for all statistics.'),
        });
    }
}

export default StatsCommand;