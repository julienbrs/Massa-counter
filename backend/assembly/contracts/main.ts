// The entry file of your WebAssembly module.
import { Storage, generateEvent } from '@massalabs/massa-as-sdk';
import { Args, stringToBytes, fromBytes } from '@massalabs/as-types';

export function increment(_args: StaticArray<u8>): void {
  const argsObject = new Args(_args); // Camel or snake case ?

  const counterArgs = new Args().add('counter');
  if (!Storage.has(counterArgs)) {
    Storage.set(stringToBytes('counter'), new Args().add<u32>(0).serialize());
  }
  const counterValue: u32 = fromBytes<u32>(
    Storage.get(stringToBytes('counter')),
  );
  const toIncrement: u32 = argsObject
    .nextU32()
    .expect('Argument value is missing or invalid');
  const newValue = add(counterValue, toIncrement);

  Storage.set(
    stringToBytes('counter'),
    new Args().add<u32>(newValue).serialize(),
  );
}

export function triggerValue(): void {
  const counterArgs = new Args().add('counter');
  const counterValue: u32 = fromBytes<u32>(
    Storage.get(stringToBytes('counter')),
  );
  /* Choix d'implémentation à expliquer */
  if (!Storage.has(counterArgs)) {
    Storage.set(stringToBytes('counter'), new Args().add<u32>(0).serialize());
  }
  // else if (storeValue.isErr()) {
  //   // initialiser à 0 ou retourner une erreur ?
  // }

  generateEvent(counterValue.toString());
}
