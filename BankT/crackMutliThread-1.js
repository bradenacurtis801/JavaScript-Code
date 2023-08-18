const fs = require("fs");
const bcrypt = require("bcryptjs");
const plainPass = require("./mcupws.json");
const numCPUs = require("os").cpus().length;
const { Worker, isMainThread, parentPort } = require("worker_threads");

HASH_FILE = "./jason.2k.hashes.txt";
const encryptedHashes = fs.readFileSync(HASH_FILE, "utf8").split(/\n|\r\n/gm);
let counter = 0;
const tick = makeAnimation();

function makeAnimation() {
  const numBars = 50;
  let chars = ["-", "\\", "|", "/"];
  let n = 0;
  return (progress, totalProg) => {
    const percent = progress / (totalProg + 1);
    const numFilledBars = Math.floor(percent * numBars);
    const numEmptyBars = numBars - numFilledBars;
    const filledBar = "█".repeat(numFilledBars);
    const emptyBarLength = numEmptyBars > 0 ? numEmptyBars - 1 : 0;
    const emptyBar = " ".repeat(emptyBarLength);
    const bar = `[${filledBar}${emptyBar}]`;
    process.stdout.write(`\r${bar} Cracking... ${Math.floor(percent * 100)}%`);
  };
}

function* generatePasswords(maxLength) {
  const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseLetters = lowercaseLetters.toUpperCase();
  const digits = "0123456789";

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
  yield* generate("", 0);
}

function crackPws(encryptedHashes, start, end) {
  let results = {
    start: start,
    end: end,
    cracked: [],
  };
  allLoop: for (let i = start; i < end; i++) {
    const hash = encryptedHashes[i];
    tick(counter, 2000);

    if (bcrypt.compareSync("", hash)) {
      results.cracked.push(`${hash}  `);
      //   callback to main thread and call tick(counter,2000)
      parentPort.postMessage({ cracked: true, hash: hash });
      continue allLoop;
    }
    for (let pw of generatePasswords(1)) {
      if (bcrypt.compareSync(pw, hash)) {
        results.cracked.push(`${hash} ${pw}`);
        //   callback to main thread and call tick(counter,2000)
        parentPort.postMessage({ cracked: true, hash: hash });
        continue allLoop;
      }
    }
    for (let pw of generatePasswords(2)) {
      if (bcrypt.compareSync(pw, hash)) {
        results.cracked.push(`${hash} ${pw}`);
        //   callback to main thread and call tick(counter,2000)
        parentPort.postMessage({ cracked: true, hash: hash });
        continue allLoop;
      }
    }
    for (let pw of plainPass) {
      if (bcrypt.compareSync(pw, hash)) {
        results.cracked.push(`${hash} ${pw}`);
        //   callback to main thread and call tick(counter,2000)
        parentPort.postMessage({ cracked: true, hash: hash });
        continue allLoop;
      }
    }
    for (let pw of generatePasswords(3)) {
      if (bcrypt.compareSync(pw, hash)) {
        results.cracked.push(`${hash} ${pw}`);
        //   callback to main thread and call tick(counter,2000)
        parentPort.postMessage({ cracked: true, hash: hash });
        continue allLoop;
      }
    }
  }
  return results;
}

if (isMainThread) {
  console.time(`${numCPUs} cores sync`);
  qty = encryptedHashes.length;
  totTask = 20;
  const splitQty = qty / numCPUs;
  let totResults = [];
  for (let i = 0; i < numCPUs; i++) {
    const worker = new Worker(__filename);
    let msg = {
      id: i,
      start: Math.floor(i * splitQty),
      end: Math.floor(i * splitQty + splitQty),
    };
    worker.postMessage(msg);
    worker.on("message", ({ type, results }) => {
      if (type === "result") {
        totResults.push(results);
        totTask--;
      }
      if (counter != qty + 1) {
        counter++;
        tick(counter, qty);
      }
      if (totTask === 0) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        let sortedResults = totResults.sort((a, b) => a.start - b.start);
        // Write results to output file
        const allHashes = [];
        for (const result of sortedResults) {
          for (const hash of result.cracked) {
            allHashes.push(hash);
          }
        }
        const file = fs.createWriteStream("./jason.2K.hashes.answers.txt");
        allHashes.forEach((value) => file.write(`${value}\n`));
        console.timeEnd(`${numCPUs} cores sync`);
      }
    });
  }
} else {
  // Worker
  parentPort.on("message", ({ id, start, end }) => {
    // object destructuring the parameter
    // console.log(`Worker ${id}: I have work to do from ${start} to ${end}`);
    const results = crackPws(encryptedHashes, start, end);
    // Sometime later ...
    parentPort.postMessage({
      message: `Worker ${id} all done with my ${end - start + 1} things`,
      type: "result",
      results,
    });

    process.exit();
  });
}
