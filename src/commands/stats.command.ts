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

    public execute(message: Discord.Message, args: string[]) {

        this.firebase.fetchGlobalStats().then((globalStats) => {
            if (!globalStats) {
                globalStats = {};
                globalStats.msgCount = 0;
                globalStats.charCount = 0;
            }

            if (!globalStats.msgCount) {
                globalStats.msgCount = 0;
            }

            if (!globalStats.charCount) {
                globalStats.charCount = 0;
            }

            message.channel.send('', {
                embed: new Discord.RichEmbed()
                    .setTitle('Mancave-Statistics')
                    .setDescription('**Global Stats:**\nMessages sent: ' +
                        globalStats.msgCount + '\nCharacters sent: ' + globalStats.charCount + '\n')
                    .setURL('https://mancave-statistics.firebaseapp.com')
                    .setColor('#ffc800')
                    .setThumbnail('https://mancave-statistics.firebaseapp.com/favicon/mstile-310x310.png')
                    .setFooter('Click link for all statistics.'),
            });

        }, (error) => {
            // Promise rejected
            message.channel.send('Could not fetch global statistics, see console for error.');
            console.log(error);
            return;
        });
    }
}

export default StatsCommand;