// The entry file of your WebAssembly module.
import { Storage, generateEvent } from '@massalabs/massa-as-sdk';
import { Args, stringToBytes, fromBytes } from '@massalabs/as-types';

export function increment(_args: StaticArray<u8>): void {
  const argsObject = new Args(_args); // Camel or snake case ?

  const counterArgs = new Args().add('counter');
  if (!Storage.has(counterArgs)) {
    Storage.set(counterArgs, new Args().add<u32>(0));
  }
  const counterValue: u32 = fromBytes<u32>(
    Storage.get(stringToBytes('counter')),
  );

  const toIncrement: u32 = argsObject
    .nextU32()
    .expect('Argument value is missing or invalid');  /* expect isn't working as intended */

  const newValue = add(counterValue, toIncrement);

  Storage.set(
    stringToBytes('counter'),
    new Args().add<u32>(newValue).serialize(),
  );
}

export function triggerValue(): string {
  const counterArgs = new Args().add('counter');
  const counterValue: u32 = fromBytes<u32>(
    Storage.get(stringToBytes('counter')),
  );
  /* Choix d'implémentation à expliquer, ainsi que le isError pas utilisé */
  if (!Storage.has(counterArgs)) {
    Storage.set(counterArgs, new Args().add<u32>(0));
  }
  const message: string = counterValue.toString();
  generateEvent(message);
  return message;
}
