const plainPass = require("./mcupws.json");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

const HASH_FILE = "./jason.2K.hashes.txt";
const encryptedHashes = fs.readFileSync(HASH_FILE, "utf8").split(/\n|\r\n/gm);

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
    startIndex: start,
    endIndex: end,
    cracked: [],
  };

  allLoop: for (let i = start; i < end; i++) {
    const hash = encryptedHashes[i];

    if (bcrypt.compareSync("", hash)) {
      results.cracked.push(`${hash}  `);
      continue allLoop;
    }
    for (let pw of generatePasswords(1)) {
      if (bcrypt.compareSync(pw, hash)) {
        results.cracked.push(`${hash} ${pw}`);
        continue allLoop;
      }
    }
    for (let pw of generatePasswords(2)) {
      if (bcrypt.compareSync(pw, hash)) {
        results.cracked.push(`${hash} ${pw}`);
        continue allLoop;
      }
    }
    for (let pw of plainPass) {
      if (bcrypt.compareSync(pw, hash)) {
        results.cracked.push(`${hash} ${pw}`);
        continue allLoop;
      }
    }
    for (let pw of generatePasswords(3)) {
      if (bcrypt.compareSync(pw, hash)) {
        results.cracked.push(`${hash} ${pw}`);
        continue allLoop;
      }
    }
  }
  return results;
}

if (cluster.isMaster) {
  const tick = makeAnimation();
  console.time(`${numCPUs} cores sync`);

  // Divide the tasks into smaller chunks
  const totTaskCount = numCPUs;
  const chunkSize = Math.ceil(encryptedHashes.length / totTaskCount);
  let startIndex = 0;
  let tasks = [];

  for (let i = 0; i < numCPUs; i++) {
    const endIndex = Math.min(startIndex + chunkSize, encryptedHashes.length);
    const workerTask = {
      startIndex,
      endIndex,
      taskId: i,
    };
    tasks.push(workerTask);
    startIndex = endIndex;
  }

  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();

    worker.send(tasks[i]);
  }
  tick(0, numCPUs);

  let tasksCompleted = 0;
  let results = [];
  let totTaskComplete = 0;

  cluster.on("message", (worker, message) => { v
    if (message.type === "result") {
      results = results.concat(message.results);
      totTaskComplete++;
    }
    if (message.type === "done") {
      tick(totTaskComplete, totTaskCount);

      if (totTaskComplete < totTaskCount) {
        tasksCompleted++;
        tasks = [];

        if (tasksCompleted === numCPUs) {
          for (let i = 0; i < numCPUs; i++) {
            const endIndex = Math.min(
              startIndex + chunkSize,
              encryptedHashes.length
            );
            const workerTask = {
              startIndex,
              endIndex,
              taskId: i,
            };
            tasks.push(workerTask);
            startIndex = endIndex;
          }
          for (const id in cluster.workers) {
            cluster.workers[id].send(tasks[id - 1]);
            tasksCompleted--;
          }
        }
      } else {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);

        sortedResults = results.sort((a, b) => a.startIndex - b.startIndex);
        const allHashes = [];
        for (const result of sortedResults) {
          for (const hash of result.cracked) {
            allHashes.push(hash);
          }
        }

        const file = fs.createWriteStream("./jason.2K.hashes.answers.txt");
        allHashes.forEach((value) => file.write(`${value}\n`));
        console.timeEnd(`${numCPUs} cores sync`);

        for (const id in cluster.workers) {
          cluster.workers[id].kill();
        }
      }
    }
  });
} else {
  process.on("message", (task) => {
    const results = crackPws(encryptedHashes, task.startIndex, task.endIndex);

    process.send({
      type: "result",
      results,
    });
  
    process.send({
      type: "done",
      workerId: cluster.worker.id,
    });
  });
}
