const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Gives info about commands!"),
  async execute(interaction) {
    const helpText = fs.readFileSync("./textFiles/help.txt", "utf8");
    await interaction.reply(`\n${helpText}\n\n`);
  },
};
