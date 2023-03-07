import { stringToBytes, fromBytes, Args, toBytes } from '@massalabs/as-types';
import { Storage } from '@massalabs/massa-as-sdk';
import { increment, triggerValue } from '../contracts/main';

describe('increment fonction', () => {
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
    const arg2 = new Args().add<u32>(2);

    const startCounterValue: u32 = fromBytes<u32>(
      Storage.get(stringToBytes('counter')));
    expect(startCounterValue).toBe(1);

    increment(arg2.serialize());
    const counterValue: u32 = fromBytes<u32>(
      Storage.get(stringToBytes('counter')));
    const expectedValue: u32 = 3;
    expect(counterValue).toBe(3);
  });
});

