import Discord = require('discord.js');
import Command = require("./command");
import Raqbot = require("../bot");
import Firebase = require("../util/firebase");
import Util = require("../util/util");
import {feelsgoodman, rated, ratingNums, reee} from "../util/emote";


class RateCommand extends Command {

    private firebase: Firebase;

    constructor(bot: Raqbot, aliases: string[]) {
        super(bot, aliases);
        this.firebase = bot.firebase;
    }

    execute(message: Discord.Message, args: string[]) {
        if (args.length < 1) {
            message.channel.send('Please give me something to rate. Usage: ?rate <thing to rate>')
            return;
        }
        // Arguments were split by space and label removed.
        const msgToBeRated = args.join(' ');

        this.firebase.getRating(msgToBeRated).then(async rating => {

            await message.react(rated[0]); // R
            await Util.sleep(200);
            await message.react(rated[1]); // A
            await Util.sleep(200);
            await message.react(rated[2]); // T
            await Util.sleep(200);
            await message.react(rated[3]); // E
            await Util.sleep(200);
            await message.react(rated[4]); // D
            await Util.sleep(200);
            await message.react(ratingNums[rating]);
            await Util.sleep(200);
            if (rating === 5) {
                await message.react(feelsgoodman)
            } else if (rating === 1) {
                await message.react(reee)
            }
        }).catch(() => {
            message.channel.send('Something went wrong while trying to get a rating, please try again.')
        });
    }
}

export = RateCommand;