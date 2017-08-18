import linkifyIt = require('linkify-it');
const linkify = linkifyIt();

class Util {
    static filterAndSplit(string: string) {
        const detectLinks = linkify.match(string);

        // Stripping all links
        if (detectLinks) {
            for (let i = 0; i < detectLinks.length; i++) {
                string = string.replace(detectLinks[i].raw, '');
            }
        }

        // Replace anything that can't be a js opbject
        // TODO: Kind of obsolete because of new code
        string = string
            .replace(/[.,\/\\#!\?$%\^&\*;:"{}=\-_`~()]/g, '')
            .replace(/<@.{0,32}>/, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/'.*'/g, '$1').toLowerCase();
        const wordList = string.split(' ');

        return wordList;
    }
}

export = Util;