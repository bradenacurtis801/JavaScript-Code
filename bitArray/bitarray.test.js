const bitArray = require("./bitArray");

const bits = bitArray(32);

describe('test', () => {

describe("set", () => {
  it("Should write 1 to the given bit", () => {
    expect(bits.get(1)).toBe(0);
    bits.set(0);
    expect(bits.get(0)).toBe(1);
    expect(bits.get(0)).toBe(0);
    bits.set(3);
    expect(bits.get(3)).toBe(1);
    expect(bits.get(7)).toBe(0);
    bits.set(7);
    expect(bits.get(7)).toBe(1);
    expect(bits.get(8)).toBe(0);
    bits.set(8);
    expect(bits.get(8)).toBe(1);
    expect(bits.get(24)).toBe(0);
    bits.set(24);
    expect(bits.get(24)).toBe(1);
    expect(bits.get(30)).toBe(0);
    bits.set(30);
    expect(bits.get(30)).toBe(1);
    expect(bits.get(1)).toBe(0);
    bits.set(1);
    expect(bits.get(1)).toBe(1);
  });
});
describe("clear", () => {
  it("should clear the bit at the given index to 0", () => {
    bits.set(0);
    bits.set(3);
    bits.set(7);
    bits.set(8);
    bits.set(24);
    bits.set(30);
    bits.set(1);
    bits.clear(1);
    expect(bits.get(1)).toBe(0);
    bits.clear(3);
    expect(bits.get(3)).toBe(0);
    bits.clear(24);
    expect(bits.get(24)).toBe(0);
    bits.clear(0);
    expect(bits.get(0)).toBe(0);
  });
});
describe("get", () => {
  it("should return 0 or 1 based on whether the bit at the given index is 0 or 1", () => {
    bits.set(0);
    expect(bits.get(0)).toBe(1);
    bits.set(3);
    expect(bits.get(3)).toBe(1);
    bits.set(7);
    expect(bits.get(7)).toBe(1);
    bits.set(8);
    expect(bits.get(8)).toBe(1);
    bits.set(24);
    expect(bits.get(24)).toBe(1);
    bits.set(30);
    expect(bits.get(30)).toBe(1);
    bits.set(1);
    expect(bits.get(1)).toBe(1);
    bits.clear(1);
    expect(bits.get(1)).toBe(0);
    bits.clear(3);
    expect(bits.get(3)).toBe(0);
    bits.clear(24);
    expect(bits.get(24)).toBe(0);
    bits.clear(0);
    expect(bits.get(0)).toBe(0);
  });
});
describe("flip", () => {
  it("should flip the bit at the given index from 0 to 1, or from 1 to 0", () => {
    const bits = bitArray(32);
    bits.set(0);
    bits.set(3);
    bits.set(7);
    bits.set(8);
    bits.set(24);
    bits.set(30);
    bits.set(1);
    bits.flip(3);
    expect(bits.get(3)).toBe(0);
    bits.flip(9);
    expect(bits.get(9)).toBe(1);
    bits.flip(30);
    expect(bits.get(30)).toBe(0);
    bits.flip(2);
    expect(bits.get(2)).toBe(1);
  });
});
})
