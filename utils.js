import Keyring from "@polkadot/keyring";
import { CREATE_STORAGE_KEYS_ENUM, NETWORKS } from "./constants.js";
import { u8aConcat, u8aToU8a } from "@polkadot/util";
import { blake2AsHex, decodeAddress } from "@polkadot/util-crypto";
import { ApiPromise, WsProvider } from "@polkadot/api";

export const generateKeyPair = (mnemonic) => {
  const keyring = new Keyring({ type: "sr25519" });
  const pair = keyring.addFromUri(mnemonic);
  return pair;
};

export const makePalletQuery = async (palletName, storeName, args) => {
  try {
    await cryptoWaitReady();
    const api = await getNetworkApi(NETWORKS.AGUNG.ws);
    const data = await api.query[palletName][storeName](...args);
    return data.toHuman();
  } catch (error) {
    console.error(`Error ${makePalletQuery.name} - `, error);
    return error;
  }
};

export const createStorageKeys = (args) => {
  // decode address to byte array
  const keysByteArray = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i].type === CREATE_STORAGE_KEYS_ENUM.ADDRESS) {
      const decoded_address = decodeAddress(args[i].value, false, 42);
      keysByteArray.push(decoded_address);
    }
    if (args[i].type === CREATE_STORAGE_KEYS_ENUM.STANDARD) {
      const hash_name = u8aToU8a(args[i].value);
      keysByteArray.push(hash_name);
    }
  }
  const key = u8aConcat(...keysByteArray);
  // encode the key using blake2b
  const hashed_key = blake2AsHex(key, 256);
  return { hashed_key };
};

export const makeExtrinsicCall = async (
    palletName,
    extrinsicName,
    args,
    shouldSignSend = true,
    keyPair,
    callback,
  ) => {
    try {
      const api = await getNetworkApi(NETWORKS.AGUNG);
      const extrinsic = api.tx[palletName][extrinsicName](...args);
      if (!shouldSignSend) {
        return extrinsic;
      }
      const nonce = await api.rpc.system.accountNextIndex(keyPair.address);
      return await extrinsic.signAndSend(keyPair, { nonce }, (response) => {
        const { dispatchError, status } = response;
        if (callback) callback(response, extrinsic);
        if (dispatchError) {
          if (dispatchError.isModule) {
            const decoded = api.registry.findMetaError(dispatchError.asModule);
            const { docs, name, section } = decoded;
  
            console.log(`${section}.${name}: ${docs.join(' ')}`);
          } else {
            console.log(dispatchError.toString());
            throw `${dispatchError.toString()}`;
          }
        }
        // console.log('Status', status);
      });
    } catch (error) {
      console.log('=======error===ownerCall====', error);
      throw error;
    }
};

export const getNetworkApi = async (network) => {
    try {
      const api = new ApiPromise({
        provider: new WsProvider(network.ws),
      });
      await api.isReadyOrError;
      return api;
    } catch (error) {
      console.error("getNetworkApi error", error);
      throw error;
    }
  };
