import * as Discord from 'discord.js';
import Firebase from '../util/firebase';

import * as crypto from 'crypto';

import util from '../util/util';

class Statistics {
    /**
     * Reference to the firebase database
     */
    private firebase: Firebase;

    constructor(firebase: Firebase) {
        this.firebase = firebase;
    }

    public evalMessage(message: Discord.Message) {
        this.updateMsgCount(message.author.username);
        this.updateCharCount(message.author.username, message.content.length);
        this.updateWordCount(message.content);
        this.updateGlobalCount(message.content.length);
    }

    public updateMsgCount(username: string) {
        this.firebase.incrementNumber(`msgCount/${username}`, 1);
    }

    public updateCharCount(username: string, messageLength: number) {
        this.firebase.incrementNumber(`charCount/${username}`, messageLength);
    }

    public updateWordCount(messageContent: string) {
        const wordList = util.filterAndSplit(messageContent);

        wordList.forEach((word: string) => {
            // Creating a hash from the word
            const id = crypto.createHash('md5').update(word).digest('hex');
            this.firebase.updateWordCount(id, word); // maybe in batch?
        });
    }

    public updateGlobalCount(messageLength: number) {
        // global message count
        this.firebase.incrementNumber('global/msgCount', 1);

        this.firebase.incrementNumber('global/charCount', messageLength);
    }
}

export default Statistics;
