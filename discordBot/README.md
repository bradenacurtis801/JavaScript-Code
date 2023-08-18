This program creates a discord server with a few command features provided to users in the discord server. 

- To start this server, first user must clone this repo. once the repo is cloned, open the directory in a bash terminal, run 'npm install' to upload all the relevant libraries, 
  then type the command 'node .\index.js' to run the server.
- If you want to add more features i.e. commands, then create your commands in the /commands folder. 
  Once you've done that, run 'node .\deploy-commands.js' in the terminal to update the discord server followed by running the command 'node .\index.js'
  for more info about adding commands, visit discords website via https://discordjs.guide/slash-commands/response-methods.html

Here are some commands you can use:

/command args - description
/help - displays this help information
/lorem type amount - generates random lorem ipsum text
/recipe - suggests a random recipe
/dadjoke - tells a random dad joke
/chuck - tells a random Chuck Norris joke
/die password - kills the bot
/text phone-num message - sends a text message to a phone number
/sendmail to subject body - sends an email
/translate text lang-code - translates text to a given language
/weather city state - gives a local weather forecast
/inspiration - gives inspirational quote
/nba - gives start time of nba games under specified date, and does current date if no date specified
