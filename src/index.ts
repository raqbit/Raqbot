// Main bot class
import Raqbot from './bot';
import Util from './util/util';

// Key used for authentication with Discord
const discordKey = Util.loadJSONFile('../../priv/discordKey.json');

console.log('Creating Raqbot...');
const bot = new Raqbot();

console.log('Logging in...');
bot.login(discordKey.key)
    .then(() => {
        console.log('Succesfully logged in!');
    })
    .catch((error: Error) => {
        console.log('Something went wrong while logging in.');
        console.log(error);
    });
