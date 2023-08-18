const axios = require('axios');

async function getData() {
  const options = {
    method: 'GET',
    url: 'https://api-nba-v1.p.rapidapi.com/games',
    params: {date: '2023-05-02'},
    headers: {
      'X-RapidAPI-Key': '04cb1b8c47msh13a859e434141b8p13dac4jsn9cb591190a00',
      'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    const games = response.data.response;

    games.forEach(game => {
      const homeTeam = game.teams.home.name;
      const awayTeam = game.teams.visitors.name;
      const startTime = new Date(game.date.start).toLocaleTimeString();
      console.log(`${awayTeam} at ${homeTeam}, ${startTime}`);
    });

  } catch (error) {
    console.error(error);
  }
}

getData();
