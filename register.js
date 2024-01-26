import { Sdk } from "@peaq-network/sdk";
import Keyring from "@polkadot/keyring";
import fs from "fs/promises";

const register = async () => {
  try {
    const seeds = JSON.parse(await fs.readFile("seeds.json", "utf8"));
    const ownerSeed = seeds.owner;
    const machineSeed = seeds.machine;

    const sdkInstance = await Sdk.createInstance({
      baseUrl: "wss://wsspc1-qa.agung.peaq.network",
      seed: ownerSeed,
    });
    const keyring = new Keyring({ type: "sr25519" });
    const pair = keyring.addFromUri(machineSeed);

    await sdkInstance.did.create(
      { name: `did:peaq:${pair.address}`, address: pair.address },
      async (result) => {
        const dispatchError = result.dispatchError;
        if (dispatchError?.isModule) {
          const decoded = sdkInstance._api.registry.findMetaError(
            dispatchError.asModule
          );
          const { docs, name, section } = decoded;

          console.log(`${section}.${name}: ${docs.join(" ")}`);
        }
        const status = result.status;
        const hash = status;
        console.log(`hash from callback: ${hash}`);
      }
    );
  } catch (error) {
    console.error(`Error creating DIDs: ${error}`);
  }
};

register();
