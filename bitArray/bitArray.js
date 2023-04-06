const os = require('os');

const bitMask = [
  0b00000001, 0b00000010, 0b00000100, 0b00001000, 0b00010000, 0b00100000,
  0b01000000, 0b10000000,
];

function isPosInt(x) {
  return Number.isInteger(x) && x > 0;
}

function bitArray(bitSize) {
  if (!isPosInt(bitSize)) {
    console.error('A bitArray can only be created with a positive integer.');
    const osType = os.type();
    if (osType === 'Darwin' || osType === 'Linux') process.exit(33);
    else if (osType === 'Windows_NT') process.exit(13);
    else process.exit(1);
  }

  const byteSize = Math.ceil(bitSize / 8);
  const bytes = new Uint8Array(byteSize); // automatically 0 filled

  return {
    set: (i) => (bytes[Math.floor(i / 8)] |= bitMask[i % 8]),
    clear: (i) => (bytes[Math.floor(i / 8)] &= ~bitMask[i % 8]),
    get: (i) => (bytes[Math.floor(i / 8)] & bitMask[i % 8] ? 1 : 0),
    flip: (i) => (bytes[Math.floor(i / 8)] ^= bitMask[i % 8]),
  };
}

module.exports = bitArray