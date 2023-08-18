const { SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("die")
    .setDescription("Shuts down the server.")
    .addStringOption((option) =>
      option
        .setName("password")
        .setDescription("The password required to shut down the server.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const password = interaction.options.getString("password");

    if (password !== process.env.PASSWORD) {
      return interaction.reply("The password you entered was incorrect!");
    }

    await interaction.reply("Goodbye for now!");

    process.exit();
  },
};