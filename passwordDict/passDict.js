const puppeteer = require("puppeteer");
const fs = require("fs");

const OUTPUT_FILE = "./mcupws.json";
const tick = makeAnimation();
let pwArr = [];

function makeAnimation() {
  const numBars = 50;
  return (currPage, totalPages) => {
    const percent = currPage / (totalPages + 1);
    const numFilledBars = Math.floor(percent * numBars);
    const numEmptyBars = numBars - numFilledBars;
    const filledBar = "█".repeat(numFilledBars);
    const emptyBarLength = numEmptyBars > 0 ? numEmptyBars - 1 : 0;
    const emptyBar = " ".repeat(emptyBarLength);
    const bar = `[${filledBar}${emptyBar}]`;
    process.stdout.write(`\r${bar} Scraping... ${Math.floor(percent * 100)}%`);
  };
}

(async () => {
  let lastEntry = null;
  try {
    const data = await fs.promises.readFile(OUTPUT_FILE, "utf-8");
    pwArr = JSON.parse(data);
    let pwArrLen = pwArr.length;
    lastEntry = pwArrLen > 0 ? pwArrLen : null;
    if (pwArrLen == 9993) {
      console.log(`\n${OUTPUT_FILE} already up to date.`);
      console.log(
        `Delete ${OUTPUT_FILE} and try again if you'd like to overwrite.\n`
      );
      return;
    }
    console.log(`\nResuming scraping from entry #: ${lastEntry}\n`);
  } catch (err) {
    process.stdout.write(`\rScraping...`);
  }

  tick(1, 100);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const baseUrl = "https://www.passwordrandom.com/most-popular-passwords";

  let currPage = 1;
  if (lastEntry) {
    currPage = Math.floor(lastEntry / 100) + 1;
    if (lastEntry % 100 === 0) currPage--;
  }

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  for (; currPage <= 100; currPage++) {
    tick(currPage, 100);
    await page.goto(`${baseUrl}/page/${currPage}`);
    const result = await page.evaluate((currPage) => {
      const rows = document.querySelectorAll("#cntContent_lstMain tr");
      return Array.from(rows, (row) => {
        const columns = row.querySelectorAll("td");
        if (columns.length === 8) {
          const password = columns[1].innerText;
          if (/^[a-zA-Z0-9]+$/.test(password)) {
            return password
          }
        }
      }).filter(Boolean); // Remove any undefined elements from the array
    }, currPage); // pass currPage as an argument to page.evaluate());
    for (let currPw = 0; currPw <= 100; currPw++) {
        if (result[currPw]) {
          if (
            lastEntry === null ||
            Number(result[currPw]) > Number(lastEntry)
          ) {
            pwArr.push(result[currPw])
          }
        }
      }

    await fs.promises.writeFile(
      OUTPUT_FILE,
      JSON.stringify(pwArr, null, 2),
      "utf-8"
    );
  }

  await browser.close();
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  console.log(`Scrape complete, ${OUTPUT_FILE} updated\n`);
})();
