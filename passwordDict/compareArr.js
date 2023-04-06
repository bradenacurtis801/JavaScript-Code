const readline = require("readline");
const fs = require("fs");

async function compareJSONFiles(filePath1, filePath2) {
  const arr1 = JSON.parse(fs.readFileSync(filePath1));
  const arr2 = JSON.parse(fs.readFileSync(filePath2));
  const shorterLength = Math.min(arr1.length, arr2.length);

  const differences = [];

  for (let i = 0; i < shorterLength; i++) {
    if (arr1[i] !== arr2[i]) {
      differences.push({ index: i + 2, value1: arr1[i], value2: arr2[i] });
    }
    if (differences.length === 10 || i === shorterLength - 1) {
      await new Promise((resolve) => {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        rl.question(
          `Press enter to show the next 10 differences (or q to quit): `,
          (answer) => {
            rl.close();
            if (answer.toLowerCase() === "q") {
              process.exit();
            } else {
              console.log(differences);
              differences.length = 0;
              resolve();
            }
          }
        );
      });
    }
  }
}

compareJSONFiles("mcupws.json", "../jasonsArr.json");