const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dad-joke")
    .setDescription("Gives you a random dad joke!"),
  async execute(interaction) {
    const fetch = require("node-fetch");
    let dadJoke = " ";
    await fetch("https://icanhazdadjoke.com/", {
      headers: { Accept: "text/plain" },
    })
      .then((response) => response.text())
      .then((data) => (dadJoke = data))
      .catch((err) => console.error(err));
    await interaction.reply(dadJoke);
  },
};