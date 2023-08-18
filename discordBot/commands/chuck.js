const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("chuck")
    .setDescription("Gives you a random chuck norris fact!"),
  async execute(interaction) {
    const fetch = require("node-fetch");
    let chuckFact = " ";
    await fetch("https://api.chucknorris.io/jokes/random")
      .then((response) => response.json())
      .then((data) => (chuckFact = data.value))
      .catch((err) => console.error(err));
    await interaction.reply(chuckFact);
  },
};