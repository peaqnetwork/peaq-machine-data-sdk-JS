import fs from 'fs/promises';
import { hexToU8a } from '@polkadot/util';
import { signatureVerify } from '@polkadot/util-crypto';
import { createStorageKeys, getStorage, makePalletQuery } from './utils.js'; // Adjust the path as necessary
import { generateKeyPair } from './utils.js'; // Adjust the path as necessary
import { CREATE_STORAGE_KEYS_ENUM } from './constants.js';

const verifyData = async (publicKey, dataHex, signatureHex) => {
    // Convert hex-encoded data and signature to Uint8Array
    const dataU8a = hexToU8a(dataHex);
    const signatureU8a = hexToU8a(signatureHex);
  
    // Verify the signature of the data
    return signatureVerify(dataU8a, signatureU8a, publicKey).isValid;
  };

const getStorage = async (itemType, address) => {
  
    const { hashed_key } = createStorageKeys([
      { value: address, type: CREATE_STORAGE_KEYS_ENUM.ADDRESS },
      { value: itemType, type: CREATE_STORAGE_KEYS_ENUM.STANDARD },
    ]);
  
    const checkIfExists = await makePalletQuery("peaqStorage", "itemStore", [
      hashed_key,
    ]);
    return checkIfExists;
  };

const verify = async () => {
  try {
    // Load seeds from seeds.json
    const seeds = JSON.parse(await fs.readFile('seeds.json', 'utf8'));
    const { machine, owner } = seeds;

    // Generate the machine keypair from the seed
    const machineKeypair = generateKeyPair(machine);
    const ownerKeypair = generateKeyPair(owner);

    // Get the stored data from the blockchain
    const itemType = `did:peaq:${machineKeypair.address}`; // Replace with the actual item type used in store.js
    const storedData = await getStorage(itemType, ownerKeypair.address);

    if (!storedData) {
      throw new Error('No data found for the given item type.');
    }

    const payload = JSON.parse(hexToU8a(storedData).toString());
    const { data: dataHex, signature: signatureHex } = payload;

    const isValid = await verifyData(machineKeypair.publicKey, dataHex, signatureHex);

    if (isValid) {
      console.log('Data is verified and the signature is valid.');
    } else {
      console.log('Failed to verify data. The signature is invalid or data has been tampered with.');
    }
  } catch (error) {
    console.error(`Error during verification: ${error.message}`);
  }
};

verify();
