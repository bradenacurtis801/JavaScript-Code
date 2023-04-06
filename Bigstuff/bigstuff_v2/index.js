// download 'filesize' library in terminal
const fs = require('fs');
const filesize = require('filesize');
const { globIterateSync } = require('glob');
const chalk = require('chalk');
const args = process.argv.slice(2);

const fileArray = [];
let fileCount = 0;
let commands = {
  p: '.', //-p, --path default set to test for POC
  h: false, //-h, --help
  s: false, //-s, --sort
  m: false, //-m, --metric
  t: false, //-t, --threshold
  l: 'en', //-l --lang
};

const sortAlpha = (a, b) =>
  a.fileName.toLowerCase() === b.fileName.toLowerCase()
    ? 0
    : a.fileName.toLowerCase() < b.fileName.toLowerCase()
    ? -1
    : 1;
const sortExten = (a, b) =>
  a.fileName.split('.').pop() === b.fileName.split('.').pop()
    ? 0 || a.fileName.localeCompare(b.fileName)
    : a.fileName.split('.').pop() < b.fileName.split('.').pop()
    ? -1
    : 1;
const sortSize = (a, b) => b.size - a.size;
const sortOrder = {
  alpha: sortAlpha,
  exten: sortExten,
  size: sortSize,
};

function setGlobalFlags() {
  argList = [];
  args.forEach((arg, index, commandsArr) => {
    nextArg = commandsArr[index + 1];
    switch (arg) {
      case '-h':
      case '--help':
        if (!nextArg) commands.l = 'en';
        else if (nextArg.includes('-')) commands.l = 'en';
        else commands.l = nextArg;
        commands.h = true;
        break;
      case '-p':
      case '--path':
        if (!nextArg) commands.p = 'test';
        else if (nextArg.includes('-')) commands.p = 'test';
        else {
          commands.p = nextArg;
          argList.push(nextArg);
        }
        break;
      case '-s':
      case '--sort':
        if (nextArg === 'alpha') {
          commands.s = 'alpha';
          argList.push(nextArg);
        } else if (nextArg === 'exten') {
          commands.s = 'exten';
          argList.push(nextArg);
        } else if (nextArg === 'size') {
          commands.s = 'size';
          argList.push(nextArg);
        } else {
          console.log(
            chalk.yellow(
              `\nWARNING: Not sorted. Arg '${arg} ${nextArg}' is not accepted, use: '-s' or '--sort' followed by 'alpha' (sort alphabetically), 'exten' (sort by extention), or 'size' (sort by size) as arguments. i.e. '> -s alpha'\n`
            )
          );
        }
        break;
      case '-t':
      case '--threshold':
        if (!nextArg) commands.t = 1;
        else if (nextArg.includes('-')) commands.t = 1;
        else {
          commands.t = nextArg;
          argList.push(nextArg);
        }
        break;
      case '-m':
      case '--metric':
        commands.m = true;
        break;
      case '-b':
      case '--blocksize':
        commands.b = true;
        break;
      default:
        if (arg.includes('-')) {
          console.log(chalk.yellow(`WARNING: Arg '${arg}' is not accepted`));
        }
    }
  });
}

function callHelp(lang = 'en') {
  let helpText = fs.readFileSync('help.txt', 'utf8');
  if (lang == 'es') helpText = fs.readFileSync('help_es.txt', 'utf8');
  console.log(`\n${helpText}\n`);
  return;
}

function getColor(size) {
  if (size >= 1000000) {
    return 'red';
  } else if (size >= 100000) {
    return 'yellow';
  } else {
    return 'green';
  }
}

function globPath(path = '.') {
  const tick = makeAnimation();
  for (const file of globIterateSync(path + '/**/*')) {
    try {
      tick();
      let size = fs.statSync(file).size;
      fileCount += 1;
      if (size < commands.threshold) continue;

      if (file.includes('.')) {
        fileObj = {
          fileName: file,
          size: size,
        };
        fileArray.push(fileObj);
      }
    } catch {
      continue;
    }
  }
}

function makeAnimation() {
  let chars = ['⠤', '⠦', '⠆', '⠃', '⠋', '⠉', '⠙', '⠘', '⠰', '⠴'];
  let n = 0;
  return () => {
    if (n % 2131)
      process.stdout.write(`\r${chars[n % chars.length]} Loading...`);
    n++;
  };
}

function printFiles() {
  if (commands.s) fileArray.sort(sortOrder[commands.s]);
  for (const file of fileArray) {
    const fileSizeColor = getColor(file.size);
    if (commands.m) fileSizeString = filesize(file.size);
    else {
      fileSizeString = `${file.size.toLocaleString()} Bytes`;
    }

    console.log(
      `${chalk[fileSizeColor](fileSizeString)} ${chalk.grey(
        '-->'
      )} ${chalk.blue(file.fileName)}`
    );
  }
}

function main() {
  setGlobalFlags();
  console.log('commands', commands);
  globPath(commands.p);

  if (commands.h) {
    callHelp(commands.l);
    return;
  }

  if (fileCount < 1) {
    console.log(
      chalk.red(
        `Error: Could not find files, please check file path or glob pattern.  use: -p 'path'`
      )
    );
    return;
  }
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  printFiles();
}
main();
