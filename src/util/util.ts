import * as fs from 'fs';
import * as linkifyIt from 'linkify-it';
import * as path from 'path';

const linkify = linkifyIt();

class Util {
    public static filterAndSplit(message: string) {
        const matches = linkify.match(message);

        // Stripping all links
        if (matches) {
            for (const match of matches) {
                message = message.replace(match.raw, '');
            }
        }

        // Replace anything that can't be a js object
        // TODO: Kind of obsolete because of new code
        message = message
            .replace(/[.,\/\\#!\?$%\^&\*;:"{}=\-_`~()]/g, '')
            .replace(/<@.{0,32}>/, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/'.*'/g, '$1').toLowerCase();
        return message.split(' ');
    }

    public static async sleep(amount: number) {
        return new Promise(((resolve) => {
            setTimeout(() => {
                resolve();
            }, amount);
        }));
    }

    public static loadJSONFile(filePath: string) {
        return JSON.parse(fs.readFileSync(path.join(__dirname, filePath), 'utf8'));
    }
}

export default Util;
