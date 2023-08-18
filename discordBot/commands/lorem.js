const { SlashCommandBuilder } = require("discord.js");
const LoremIpsum = require("lorem-ipsum").LoremIpsum;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lorem")
    .setDescription("Generates random lorem ipsum text.")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Output length")
        .setRequired(true)
        .addChoices(
          { name: "Words", value: "words" },
          { name: "Sentences", value: "sentences" },
          { name: "Paragraphs", value: "paragraphs" }
        )
    )
    .addIntegerOption((option) =>
      option
        .setName("length")
        .setDescription(
          "The number of words, sentences, or paragraphs to generate."
        )
        .setRequired(true)
    ),
    
  async execute(interaction) {
    const type = interaction.options.getString("type");
    const length = interaction.options.getInteger("length");
    const lorem = new LoremIpsum({
      sentencesPerParagraph: {
        max: 8,
        min: 4,
      },
      wordsPerSentence: {
        max: 16,
        min: 4,
      },
    });

    let loremText = "";
    switch (type) {
      case "words":
        loremText = lorem.generateWords(length);
        break;
      case "sentences":
        loremText = lorem.generateSentences(length);
        break;
      case "paragraphs":
        loremText = lorem.generateParagraphs(length);
        break;
      default:
        await interaction.reply("Invalid type specified.");
        return;
    }

    await interaction.reply(loremText.trim());
  },
};