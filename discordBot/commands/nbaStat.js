const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nba')
    .setDescription('Get NBA games for a specific date or today.')
    .addStringOption(option => 
      option.setName('date')
      .setDescription('The date of the games in YYYY-MM-DD format.')
      .setRequired(false)),
  async execute(interaction) {
    const date = interaction.options.getString('date') || new Date().toISOString().slice(0, 10);

    const options = {
      method: 'GET',
      url: 'https://api-nba-v1.p.rapidapi.com/games',
      params: { date },
      headers: {
        'X-RapidAPI-Key': '04cb1b8c47msh13a859e434141b8p13dac4jsn9cb591190a00',
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      const games = response.data.response;

      if (games.length === 0) {
        return interaction.reply(`No NBA games found for ${date}`);
      }

      const gameList = games.map(game => {
        const homeTeam = game.teams.home.name;
        const awayTeam = game.teams.visitors.name;
        const startTime = new Date(game.date.start).toLocaleTimeString();
        return `${awayTeam} at ${homeTeam}, ${startTime}`;
      });

      const replyMessage = `NBA games for ${date}:\n${gameList.join('\n')}`;
      return interaction.reply(replyMessage);
    } catch (error) {
      console.error(error);
      return interaction.reply('An error occurred while fetching NBA games.');
    }
  },
};
