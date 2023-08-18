const bcrypt = require("bcryptjs");
const fs = require("fs");
const _ = require("lodash");

// Define the set of characters to use for password generation
const alphaNum =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// Define the salt value for bcrypt hashing
const salt = 4;

function getRandChars(numChars) {
  let i = 0;
  let word = "";
  while (i < numChars) {
    const index = _.random(61);
    word += alphaNum[index];
    i++;
  }
  return word;
}

function main() {
  console.time(`with salt value of ${salt}`);

  // Load a list of words from an external file
  const words = require("./mcupws.json");

  // Generate 1000 random passwords using the list of words and hash them
  const randomPasswords = new Array(1000).fill("").map(() => {
    const index = _.random(words.length);
    return words[index];
  });
  const hashedPasswords = randomPasswords.map((password) =>
    bcrypt.hashSync(password, salt)
  );

  // Generate 500 empty hashes, 390 one-character hashes, 100 two-character hashes, and 10 three-character hashes
  const emptyHashes = new Array(500).fill("").map(() => bcrypt.hashSync("", 4));
  const oneCharHashes = new Array(390).fill("").map(() => {
    const randChar = getRandChars(1);
    return bcrypt.hashSync(randChar, salt);
  });
  const twoCharHashes = new Array(100).fill("").map(() => {
    const randChars = getRandChars(2);
    return bcrypt.hashSync(randChars, salt);
  });
  const threeCharHashes = new Array(10).fill("").map(() => {
    const randChars = getRandChars(3);
    return bcrypt.hashSync(randChars, salt);
  });

  // Concatenate all the generated hashes and shuffle them randomly
  const allHashes = hashedPasswords.concat(
    emptyHashes,
    oneCharHashes,
    twoCharHashes,
    threeCharHashes
  );
  const shuffledHashes = _.shuffle(allHashes);

  // Write the shuffled hashes to a file and log a success message
  fs.writeFileSync("2K.hashes.txt", shuffledHashes.join("\n"));
  console.log("Hashes saved to 2K.hashes.txt");

  // End timing the program
  console.timeEnd(`with salt value of ${salt}`);
}

// Call the main function to run the program
main();
