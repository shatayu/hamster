require('dotenv').config(); //initialize dotenv
const { Client, Events, GatewayIntentBits, SlashCommandBuilder } = require('discord.js'); //import discord.js

const SEND_MESSAGE_READ_MESSAGE_ADD_REACTION_INTENT_CODE = 67648;
const SERVER_ID = "1137837925216817245";

const client = new Client({intents: SEND_MESSAGE_READ_MESSAGE_ADD_REACTION_INTENT_CODE});

client.once(Events.ClientReady, c => {
    console.log(`Logged in as ${c.user.tag}`);

    const ping = new SlashCommandBuilder()
        .setName('h')
        .setDescription('Send a command to Hamster.')
        .addStringOption(option => option
            .setName('text')
            .setDescription('The text to pass to Hamster, e.g. #analysis_name @event_name test.')
            .setRequired(true)
        );

    client.application.commands.create(ping, SERVER_ID);
})

client.on(Events.InteractionCreate, interaction => {
    if (!interaction.isChatInputCommand()) {
        console.log(interaction);
        return;
    }

    if (interaction.commandName === 'h') {
        const parsedInteraction = parseInteraction(interaction);
        console.log(parsedInteraction);
        interaction.reply(`username: ${parsedInteraction.username}, analysisName: ${parsedInteraction.analysisName}, eventName: ${parsedInteraction.eventName}, data: ${parsedInteraction.data}`);
    }
})

function parseInteraction(interaction) {
    const text = interaction.options.getString('text');
    const words = text.split(' ');

    // fill in analysis name and event name
    let analysisName = null;
    let eventName = null;

    // fill analysis name
    if (words[0].includes('#', '')) {
        analysisName = words[0].replace('#', '');
        words.splice(0, 1);
    }

    // fill event name
    if (words.length > 0 && words[0].includes('@')) {
        eventName = words[0].replace('@', '');
        words.splice(0, 1);
    }

    data = words.join(' ');
    if (data.length === 0) {
        data = null;
    }

    return {
        timestamp: Date.now(),
        username: interaction.user.username,
        analysisName,
        eventName,
        data
    }
} 

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token