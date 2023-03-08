import { Address, call, callerHasWriteAccess } from '@massalabs/massa-as-sdk';
import { Args } from '@massalabs/as-types';

/**
 * This function is meant to be called only one time: when the contract is deployed.
 */
export function constructor(binaryArgs: StaticArray<u8>): StaticArray<u8> {
  // This line is important. It ensure that this function can't be called in the future.
  // If you remove this check someone could call your constructor function and reset your SC.
  if (!callerHasWriteAccess()) {
    return [];
  }
  main(binaryArgs);
  return [];
}

/**
 * @param binaryArgs - The address of the counter contract encoded with `Args`
 * @returns empty array
 */
export function main(binaryArgs: StaticArray<u8>): StaticArray<u8> {
  const args = new Args(binaryArgs);
  const address = new Address(
    args.nextString().expect('Address argument is missing or invalid'),
  );

  // Initialize the counter to 0
  call(address, 'increment', new Args().add<u32>(0), 1_000_000_000);
  return [];
}
