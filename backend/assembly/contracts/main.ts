// The entry file of your WebAssembly module.
import { Storage, generateEvent } from '@massalabs/massa-as-sdk';
import { Args, stringToBytes, fromBytes } from '@massalabs/as-types';

/**
 * Increments the counter value in storage by the given amount.
 *
 * @param _args - Serialized arguments containing the value to increment the counter by.
 */
export function increment(_args: StaticArray<u8>): void {
  const argsObject = new Args(_args);

  const counterArgs = new Args().add('counter');
  if (!Storage.has(counterArgs)) {
    Storage.set(counterArgs, new Args().add<u32>(0));
  }
  const counterValue: u32 = fromBytes<u32>(
    Storage.get(stringToBytes('counter')),
  );

  const toIncrement: u32 = argsObject
    .nextU32()
    .expect(
      'Argument value is missing or invalid',
    ); /* expect isn't working as intended */

  const newValue = add(counterValue, toIncrement);

  Storage.set(
    stringToBytes('counter'),
    new Args().add<u32>(newValue).serialize(),
  );
}

/**
 * Retrieves the current value of the counter from storage and generates an event with its value as a string.
 *
 * @returns The current value of the counter as a string.
 */
export function triggerValue(): string {
  const counterArgs = new Args().add('counter');
  const counterValue: u32 = fromBytes<u32>(
    Storage.get(stringToBytes('counter')),
  );
  // If the counter value is not set in storage, initialize it to 0.
  if (!Storage.has(counterArgs)) {
    Storage.set(counterArgs, new Args().add<u32>(0));
  }
  const message: string = counterValue.toString();
  generateEvent(message);
  return message;
}
