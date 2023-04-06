// I want to solve the problem of losing stupid points
// for leaving in var instead of let.
// This program will read in another file and
// print out every line that has var
console.log('loading ...');
const fs = require('fs');

const catchingVar = /(\b|\s)var /g;
const catchingMy = /\b[mM]y[A-Z]/g;
const args = process.argv.slice(2);
const testFile = args.pop();
let text = fs.readFileSync(testFile, 'utf8');
let lines = text
  .split(/\n|\r\n/gm)
  .map((line, i) => `${i + 1} ${line}`)
  .filter((line) => !/^\d+\s*$/gm.test(line));

for (let line of lines) {
  if (catchingVar.test(line)) {
    console.log(`No var ${line}`);
  }
}
for (let line of lines) {
  if (catchingMy.test(line)) {
    console.log(`No myName ${line}`);
  }
}
