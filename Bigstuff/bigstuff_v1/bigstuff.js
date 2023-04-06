const fs = require('fs');
const filesize = require('filesize');
const WRITE_TO_CONSOLE = console.Console(
  fs.createWriteStream('./bigstuff.txt')
); //writes console output to a text file named 'bigstuff.txt'
const args = process.argv.slice(2);

let commands = {
  p: 'test', //-p, --path default set to test for POC
  h: false, //-h, --help
  s: false, //-s, --sort
  m: false, //-m, --metric
  t: false, //-t, --threshold
  b: false, //-b, -blocksize
};

const sortAlpha = (a, b) =>
  a.name.toLowerCase() === b.name.toLowerCase()
    ? 0
    : a.name.toLowerCase() < b.name.toLowerCase()
    ? -1
    : 1;
const sortExten = (a, b) =>
  a.name.split('.').pop() === b.name.split('.').pop()
    ? 0 || a.name.localeCompare(b.name)
    : a.name.split('.').pop() < b.name.split('.').pop()
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
        }
        if (nextArg === 'exten') {
          commands.s = 'exten';
          argList.push(nextArg);
        }
        if (nextArg === 'size') {
          commands.s = 'size';
          argList.push(nextArg);
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
        if (!argList.includes(arg)) {
          throw `'${arg}' is invalid syntax!`;
        }
    }
  });
}

function walkDirTree(dirPath) {
  const dirName = dirPath.split('/').pop();
  let parentDir = {
    name: `${dirName}`,
    size: 0,
    children: [],
  };
  dirPath += '/';
  const names = fs.readdirSync(dirPath);
  for (let name of names) {
    const stat = fs.statSync(`${dirPath}${name}`);
    if (stat.isDirectory()) {
      let subdir = walkDirTree(`${dirPath}${name}`);
      parentDir.children.push(subdir);
    } else if (stat.isFile()) {
      let size = stat.size;
      if (commands.b) {
        size = 4096 * Math.ceil(size / 4096);
      }
      let file = { name, size };
      parentDir.children.push(file);
    }
  }
  return parentDir;
}

function getDirSizes(dir) {
  for (let child of dir.children) {
    if (child.children) getDirSizes(child);
    dir.size += child.size;
  }
}

function printTree(parent) {
  if (commands.s) {
    parent.children.sort(sortOrder[commands.s]);
  }
  if (commands.t) if (parent.size < commands.t) return;
  if (commands.m) parent.size = filesize(parent.size);

  WRITE_TO_CONSOLE.group(`${parent.name}   ${parent.size.toLocaleString()}`);
  console.group(`${parent.name}   ${parent.size.toLocaleString()}`);
  //if child is isDirectory
  for (let child of parent.children) {
    if (child.children) printTree(child);
    //else //child is file
    else {
      if (commands.m) child.size = filesize(child.size);
      child.size = child.size.toLocaleString();
      if (commands.t) {
        if (child.size >= commands.t) {
          WRITE_TO_CONSOLE.log(child);
          console.log(child);
        }
      } else {
        WRITE_TO_CONSOLE.log(child);
        console.log(child);
      }
    }
  }
  WRITE_TO_CONSOLE.groupEnd();
  console.groupEnd();
}

function main() {
  setGlobalFlags();
  if (commands.h) {
    let text = fs.readFileSync('help.txt', 'utf8');
    console.log(`\n${text}\n`);
    return;
  }
  const tree = walkDirTree(commands.p);
  getDirSizes(tree);
  printTree(tree);
}
main();
