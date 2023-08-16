require('dotenv').config(); // initialize dotenv
import {Client, Events, GatewayIntentBits} from 'discord';
import axios from 'axios';

const client = new Client({intents: [GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});

client.once(Events.ClientReady, (c) => {
  console.log(`Logged in as ${c.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (
    message.content.length > 2 &&
    message.content.substring(0, 2) === 'h ' &&
    message.author.bot === false
  ) {
    const parsedMessage = parseMessage(
        message.author.username, message.content.substring(2),
    );
    await axios.post(`https://8zds423cx7.execute-api.us-east-1.amazonaws.com/prod/users/${parsedMessage.username}/entries`, parsedMessage);
    message.reply(
        `username: ${parsedMessage.username}, ` +
        `analysisName: ${parsedMessage.analysisName}, ` +
        `eventName: ${parsedMessage.eventName}, ` +
        `data: ${parsedMessage.data}`,
    );
  }
});

/**
 * Parses content of text into objects to log in database
 * @param {string} username The username of the person sending the message
 * @param {string} text The full text of the message sent
 * @return {Object} an object with the attributes being logged to the database
 */
function parseMessage(username, text) {
  const words = text.split(' ');

  // fill in analysis name and event name
  let analysisName = null;
  let eventName = null;

  if (words.length > 1 && words[0][0] === '@' && words[1][0] === '#') {
    const temp = words[0];
    words[0] = words[1];
    words[1] = temp;
  }

  // fill analysis name
  if (words[0][0] === '#') {
    analysisName = words[0].replace('#', '');
    words.splice(0, 1);
  }

  // fill event name
  if (words.length > 0 && words[0][0] === '@') {
    eventName = words[0].replace('@', '');
    words.splice(0, 1);
  }

  data = words.join(' ');

  return {
    timestamp: Date.now(),
    username,
    analysisName: analysisName ?? '',
    eventName: eventName ?? '',
    data: data ?? '',
  };
}

// make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); // login bot using token
