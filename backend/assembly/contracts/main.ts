// The entry file of your WebAssembly module.
import { Storage, generateEvent } from '@massalabs/massa-as-sdk';
import { Args } from '@massalabs/as-types';

/**
 * Increments the counter value in storage by the given amount.
 *
 * @param _args - Serialized arguments containing the value to increment the counter by.
 */
export function increment(_args: StaticArray<u8>): void {
  const argsObject = new Args(_args);

  const counterArgs: Args = new Args().add('counter');
  if (!Storage.has(counterArgs)) {
    Storage.set(counterArgs, new Args().add<u32>(0));
  }
  const counterValue: u32 = Storage.get(counterArgs).nextU32().unwrap();
  const toIncrement: u32 = argsObject
    .nextU32()
    .expect(
      'Argument value is missing or invalid',
    ); /* expect isn't working as intended */

  const newValue: u32 = add(counterValue, toIncrement);
  Storage.set(counterArgs, new Args().add<u32>(newValue));
}

/**
 * Retrieves the current value of the counter from storage and generates an event with its value as a string.
 *
 * @returns The current value of the counter as a string.
 */
export function triggerValue(_: StaticArray<u8>): u32 {
  const counterArgs: Args = new Args().add('counter');
  const counterValueRes = Storage.get(counterArgs).nextU32();

  // If the counter value is not set in storage, initialize it to 0.
  if (counterValueRes.isErr() || !Storage.has(counterArgs)) {
    Storage.set(counterArgs, new Args().add<u32>(0));
    generateEvent('0');
    return 0;
  }
  const counterValue: u32 = counterValueRes.unwrap();
  generateEvent(counterValue.toString());

  /* Returning value just for testing purpose */
  return counterValue;
}
