import { stringToBytes, fromBytes, Args, toBytes } from '@massalabs/as-types';
import { Storage, resetStorage } from '@massalabs/massa-as-sdk';
import { increment, triggerValue } from '../contracts/main';

describe('increment fonction', () => {
  beforeEach(() => {
    resetStorage();
  });

  test("Should init to 0", () => {
    const args = new Args().add<u32>(0);
    increment(args.serialize());
    const counterValue: u32 = fromBytes<u32>(
      Storage.get(stringToBytes('counter')));
    const expectedValue: u32 = 0;
    expect(counterValue).toBe(expectedValue);
  });

  test("Should increment by 1", () => {
    const args = new Args().add<u32>(1);
    increment(args.serialize());
    const counterValue: u32 = fromBytes<u32>(
      Storage.get(stringToBytes('counter')));
    const expectedValue: u32 = 1;
    expect(counterValue).toBe(expectedValue);
  });

  test("Should increment to 1, then 2 and equals 3", () => {
    const arg1 = new Args().add<u32>(1);
    const arg2 = new Args().add<u32>(2);

    increment(arg1.serialize());
    increment(arg2.serialize());
    const counterValue: u32 = fromBytes<u32>(
      Storage.get(stringToBytes('counter')));
    const expectedValue: u32 = 3;
    expect(counterValue).toBe(expectedValue);
  });
});

describe('Smart contract unit tests', () => {
  beforeEach(() => {
    resetStorage();
  });

  test("Increment and then trigger value in an event", () => {
    resetStorage();
    const args = new Args().add<u32>(10);
    increment(args.serialize());
    const counterValue: u32 = fromBytes<u32>(
      Storage.get(stringToBytes('counter')));
    expect(counterValue).toBe(10);
    expect(triggerValue()).toBe("10");
  });

  test("trigger value in an event at init", () => {
    expect(triggerValue()).toBe("0");
  });

});