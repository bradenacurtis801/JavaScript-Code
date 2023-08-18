const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inspiration")
    .setDescription("Gives you a random inspirational quote"),
  async execute(interaction) {
    const fetch = require("node-fetch");
    let quote = " ";
    await fetch("https://zenquotes.io/api/random", {
      headers: { Accept: "application/json" },
    })
      .then((response) => response.json())
      .then((data) => (quote = data[0].q))
      .catch((err) => console.error(err));
    await interaction.reply(quote);
  },
};