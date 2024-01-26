
## Overview

This utility library provides a set of functions for ensuring machine data verification. It includes functionalities such as generating key pairs from mnemonics, making pallet queries, creating storage keys, making extrinsic calls, and retrieving network API instances.

## Features

- **generateKeyPair:** Generate a key pair from a mnemonic.
- **makePalletQuery:** Query data from a specific pallet.
- **createStorageKeys:** Create storage keys for interacting with the blockchain.
- **makeExtrinsicCall:** Send extrinsic calls to the blockchain.
- **getNetworkApi:** Retrieve an instance of the network API.

## Installation

To use this library, ensure that you have Node.js installed on your system. Then, install the library using npm:

```bash
npm install @polkadot/api @polkadot/keyring @polkadot/util @polkadot/util-crypto
```
### Generating a Key Pair

To generate a key pair from a mnemonic, use the `generateKeyPair` function. This function takes a mnemonic string as input and returns a key pair object.

```javascript
import { generateKeyPair } from 'path-to-this-library';

const mnemonic = 'your mnemonic here';
const keyPair = generateKeyPair(mnemonic);
```
Ensure that the mnemonic you provide is secure and kept private. The generated key pair can be used for various operations within the Polkadot network.

### Making a Pallet Query

To query data from a specific pallet, use the `makePalletQuery` function. Provide the pallet name, store name, and arguments for the query.

```javascript
import { makePalletQuery, NETWORKS } from 'path-to-this-library';

const palletName = 'palletName';
const storeName = 'storeName';
const args = ['arg1', 'arg2'];

makePalletQuery(palletName, storeName, args)
  .then(data => console.log(data))
  .catch(error => console.error(error));
```
### Creating Storage Keys

To create storage keys for interacting with the blockchain, use the `createStorageKeys` function. This function processes an array of arguments to generate keys, handling different types like addresses and standard values.

```javascript
import { createStorageKeys, CREATE_STORAGE_KEYS_ENUM } from 'path-to-this-library';

const args = [
  { type: CREATE_STORAGE_KEYS_ENUM.ADDRESS, value: '5DyV... (address)' },
  // ... other arguments
];

const storageKeys = createStorageKeys(args);
```
This function is crucial for operations requiring specific key formats, such as querying blockchain data or interacting with smart contracts. Ensure that you provide the correct types and values in the arguments to generate the appropriate keys.

### Making an Extrinsic Call

To send extrinsic calls to the Polkadot blockchain, use the `makeExtrinsicCall` function. This function facilitates the process of creating, signing, and sending extrinsic calls, with optional handling for callback responses.

```javascript
import { makeExtrinsicCall, NETWORKS } from 'path-to-this-library';

const palletName = 'palletName';
const extrinsicName = 'extrinsicName';
const args = ['arg1', 'arg2'];
const shouldSignSend = true;
const keyPair = { /* keyPair object */ };
const callback = (response, extrinsic) => { /* callback function */ };

makeExtrinsicCall(palletName, extrinsicName, args, shouldSignSend, keyPair, callback)
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

### Retrieving Network API Instance

To connect to a specific Polkadot network and retrieve an API instance, use the `getNetworkApi` function. This function creates an instance of the Polkadot API connected to the specified network, essential for performing network-specific operations.

```javascript
import { getNetworkApi, NETWORKS } from 'path-to-this-library';

getNetworkApi(NETWORKS.AGUNG)
  .then(api => console.log(api))
  .catch(error => console.error(error));
```

This function is critical for all operations requiring interaction with the Polkadot blockchain. Make sure to select the correct network from the NETWORKS constant. Handling the asynchronous nature of this function is essential for effective blockchain communication.
