import Discord = require('discord.js');
import Command = require("./command");
import Raqbot = require("../bot");
import Firebase = require("../util/firebase");
import Util = require("../util/util");
import * as emoteUtil from "../util/emote";


class RateCommand extends Command {

    private firebase: Firebase;

    constructor(bot: Raqbot, aliases: string[]) {
        super(bot, aliases);
        this.firebase = bot.firebase;
    }

    async execute(message: Discord.Message, args: string[]) {
        if (args.length < 1) {
            message.channel.send('Please give me something to rate. Usage: ?rate <thing to rate>')
            return;
        }
        // Arguments were split by space and label removed.
        const msgToBeRated = args.join(' ');

        // Printing RATED
        for(const letter of emoteUtil.rated) {
            await message.react(letter);
            await Util.sleep(200);
        }

        // Get rating
        this.firebase.getRating(msgToBeRated).then(async rating => {
            // react with rating
            await message.react(emoteUtil.ratingNums[rating]);
            await Util.sleep(200);
            if (rating === 5) {
                await message.react(emoteUtil.feelsgoodman)
            } else if (rating === 0) {
                await message.react(emoteUtil.reee)
            }
        }).catch(async () => {
            message.channel.send('Something went wrong while trying to get a rating, please try again.')
            await message.clearReactions();
        });
    }
}

export = RateCommand;