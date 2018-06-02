import * as Discord from 'discord.js';
import Command from './command';
import Raqbot from '../bot';
import Firebase from '../util/firebase';
import Util from '../util/util';
import * as emoteUtil from '../util/emote';


class RateCommand extends Command {

    private firebase: Firebase;

    constructor(bot: Raqbot, aliases: string[]) {
        super(bot, aliases);
        this.firebase = bot.firebase;
    }

    async execute(message: Discord.Message, args: string[]) {
        if (args.length < 1) {
            message.channel.send('Please give me something to rate. Usage: ?rate <thing to rate>');
            return;
        }
        // Arguments were split by space and label removed.
        const msgToBeRated = args.join(' ');

        try {
            // Printing RATED
            for (const letter of emoteUtil.rated) {
                await message.react(letter);
                await Util.sleep(200);
            }

            const rating = await this.firebase.getRating(msgToBeRated);

            await message.react(emoteUtil.ratingNums[rating]);

            if (rating === 5) {
                await message.react(emoteUtil.feelsgoodman);
            } else if (rating === 0) {
                await message.react(emoteUtil.reee);
            }
        } catch (err) {
            console.log(err);
            message.channel.send('Something went wrong while trying to get a rating, please try again.');
            await message.reactions.forEach(value => value.remove());
        }

    }
}

export default RateCommand;