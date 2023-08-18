const plainPass = require('./mcupws.json');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const HASH_FILE = './jason.2K.hashes.txt';
const WRITE_CONSOLE = console.Console(
  fs.createWriteStream('./jason.2K.hashes.answers.txt')
);
function makeAnimation() {
  const numBars = 50;
  let chars = ['-', '\\', '|', '/'];
  let n = 0;
  return (progress, totalProg) => {
    const percent = progress / (totalProg + 1);
    const numFilledBars = Math.floor(percent * numBars);
    const numEmptyBars = numBars - numFilledBars;
    const filledBar = '█'.repeat(numFilledBars);
    const emptyBarLength = numEmptyBars > 0 ? numEmptyBars - 1 : 0;
    const emptyBar = ' '.repeat(emptyBarLength);
    const bar = `[${filledBar}${emptyBar}]`;
    process.stdout.write(`\r${bar} Cracking... ${Math.floor(percent * 100)}%`);
  };
}

function* generatePasswords(maxLength) {
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseLetters = lowercaseLetters.toUpperCase();
  const digits = '0123456789';

  const charSet = lowercaseLetters + uppercaseLetters + digits;
  function* generate(currentPassword, index) {
    if (index <= maxLength) {
      yield currentPassword;
    }
    if (index === maxLength) {
      return;
    }
    for (let char of charSet) {
      yield* generate(currentPassword + char, index + 1);
    }
  }
  yield* generate('', 0);
}

function crackPws() {
  const tick = makeAnimation();
  let encryptedHashes = fs.readFileSync(HASH_FILE, 'utf8').split(/\n|\r\n/gm);

  console.time('cracking');
  let counter = 0;
  allLoop: for (hash of encryptedHashes) {
    counter++;
    tick(counter, 2000);

    if (bcrypt.compareSync('', hash)) {
      WRITE_CONSOLE.log(`${hash}  `);
      continue allLoop;
    }
    for (let pw of generatePasswords(1)) {
      if (bcrypt.compareSync(pw, hash)) {
        //record
        //break out
        WRITE_CONSOLE.log(`${hash} ${pw}`);
        continue allLoop;
      }
    }
    for (let pw of generatePasswords(2)) {
      if (bcrypt.compareSync(pw, hash)) {
        //record
        //break out
        WRITE_CONSOLE.log(`${hash} ${pw}`);
        continue allLoop;
      }
    }
    for (let pw of plainPass) {
      if (bcrypt.compareSync(pw, hash)) {
        //record
        //break out
        WRITE_CONSOLE.log(`${hash} ${pw}`);
        continue allLoop;
      }
    }
    for (let pw of generatePasswords(3)) {
      if (bcrypt.compareSync(pw, hash)) {
        //record
        //break out
        WRITE_CONSOLE.log(`${hash} ${pw}`);
        continue allLoop;
      }
    }
  }
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  console.timeEnd('cracking');
}

crackPws();
