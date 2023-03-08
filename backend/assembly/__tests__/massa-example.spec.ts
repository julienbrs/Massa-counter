import { Args } from '@massalabs/as-types';
import { Storage, resetStorage } from '@massalabs/massa-as-sdk';
import { increment, triggerValue } from '../contracts/main';

describe('increment fonction', () => {
  beforeEach(() => {
    resetStorage();
  });

  test('Should init to 0', () => {
    const args = new Args().add<u32>(0);
    increment(args.serialize());
    const counterValue: u32 = Storage.get(new Args().add('counter')).nextU32().unwrap();
    const expectedValue: u32 = 0;
    expect(counterValue).toBe(expectedValue);
  });

  test('Should increment by 1', () => {
    const args = new Args().add<u32>(1);
    increment(args.serialize());
    const counterValue: u32 = Storage.get(new Args().add('counter')).nextU32().unwrap();
    const expectedValue: u32 = 1;
    expect(counterValue).toBe(expectedValue);
  });

  test('Should increment by 0 and not change', () => {
    const args = new Args().add<u32>(0);
    increment(args.serialize());

    const counterValue: u32 = Storage.get(new Args().add('counter')).nextU32().unwrap();

    const expectedValue: u32 = 0;
    expect(counterValue).toBe(expectedValue);
  });

  test('Should handle overflow', () => {
    const argsMAX = new Args().add<u32>(u32.MAX_VALUE);
    const args1 = new Args().add<u32>(1);
    increment(argsMAX.serialize());
    increment(args1.serialize());
    const counterValue: u32 = Storage.get(new Args().add('counter')).nextU32().unwrap();

    const expectedValue: u32 = 0;
    expect(counterValue).toBe(expectedValue);
  });

  /* Working but not for the good reason */
  test('Should crash if no argument', () => {
    expect(() => {
      increment(new Args().serialize());
    }).toThrow('Argument value is missing or invalid');
  });

  // test('Should crash if argument is not valid (negative integer)', () => {
  //   const args = new Args().add<u32>(-2);
  //   expect(() => {
  //     increment(args.serialize());
  //   }).toThrow('Argument value is missing or invalid');
  // });

  test('Should increment to 1, then 2 and equals 3', () => {
    const arg1 = new Args().add<u32>(1);
    const arg2 = new Args().add<u32>(2);

    increment(arg1.serialize());
    increment(arg2.serialize());
    const counterValue: u32 = Storage.get(new Args().add('counter')).nextU32().unwrap();

    const expectedValue: u32 = 3;
    expect(counterValue).toBe(expectedValue);
  });
});

describe('Smart contract unit tests', () => {
  beforeEach(() => {
    resetStorage();
  });

  test('Should return "0" if counter is not initialized', () => {
    const counterValue = triggerValue(new Args().serialize());
    expect(counterValue).toBe(0);
  });

  test('Should return the counter value after an increment', () => {
    const args = new Args().add<u32>(10);
    increment(args.serialize());
    const counterValue = triggerValue(new Args().serialize());
    expect(counterValue).toBe(10);

  });

  test('Should return the updated counter value after multiple increments', () => {
    const args1 = new Args().add<u32>(10);
    const args2 = new Args().add<u32>(20);
    increment(args1.serialize());
    increment(args2.serialize());
    const counterValue = triggerValue(new Args().serialize());
    expect(counterValue).toBe(30);
  });
});
