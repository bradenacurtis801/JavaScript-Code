const { SlashCommandBuilder } = require("discord.js");
const weather = require("weather-js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Gives you a local weather blurb!")
    .addStringOption((option) =>
      option
        .setName("city")
        .setDescription("The name of the city")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("state")
        .setDescription("The two-letter state code")
        .setRequired(true)
    ),
  async execute(interaction) {
    const city = interaction.options.getString("city");
    const state = interaction.options.getString("state");
    const searchQuery = `${city}, ${state}`;

    let message = "";
    await weather.find(
      { search: searchQuery, degreeType: "F" },
      (err, result) => {
        if (err) {
          console.log(err);
          interaction.reply(
            "An error occurred while fetching the weather information."
          );
          return;
        }

        if (!result || result.length === 0) {
          interaction.reply(`No weather information found for ${searchQuery}.`);
          return;
        }

        // Options:
        // search:     location name or zipcode
        // degreeType: F or C

        result = weather.find(
          { search: searchQuery, degreeType: "F" },
          function (err, result) {
            if (err) console.log(err);
            else {
              const todayForecast = result[0].forecast[1]; // Get the forecast for today
              const currentWeather = result[0].current;

              const message = `Today's weather in ${result[0].location.name}, (${result[0].location.lat}, ${result[0].location.long}) is ${currentWeather.skytext}. The temperature is ${currentWeather.temperature} degrees ${result[0].location.degreetype}. The high for today is ${todayForecast.high} and the low is ${todayForecast.low}.`;

              interaction.reply(message);
            }
          }
        );
      }
    );
  },
};
