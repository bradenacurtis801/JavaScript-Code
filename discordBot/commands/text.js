
const { SlashCommandBuilder } = require("discord.js");
require("dotenv").config(); //to start process from .env file
const twilioClient = require("twilio")(process.env.SID, process.env.AUTH_TOKEN);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("text")
    .setDescription("Send a text message")
    .addStringOption((option) =>
      option
        .setName("to")
        .setDescription("The phone number to send the message to")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("body")
        .setDescription("The message to send")
        .setRequired(true)
    ),
  async execute(interaction) {
    const to = interaction.options.getString("to");
    const body = interaction.options.getString("body");

    twilioClient.messages
      .create({
        body: body,
        from: "+18556011402",
        to: to,
      })
      .then((message) => {
        console.log(message.sid);
        interaction.reply(`Message sent to ${to}`);
      })
      .catch((err) => {
        console.error(err);
        interaction.reply(`Failed to send message to ${to}`);
      });
  },
};