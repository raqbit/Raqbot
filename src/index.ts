// Key used for authentication with Discord
const discordKey = require('../priv/discordKey.json');

// Main bot class
import Raqbot = require('./bot');

console.log('Creating Raqbot...');
const bot = new Raqbot();

console.log('Logging in...')
bot.login(discordKey.key)
  .then(() => {
    console.log('Succesfully logged in!')
  })
  .catch((error) => {
    console.log('Something went wrong while logging in.')
    console.log(error);
  });