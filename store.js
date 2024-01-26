import fs from "fs/promises";
import { generateKeyPair, makeExtrinsicCall } from "./utils.js";
import { hexToU8a, u8aToHex } from "@polkadot/util";
import { cryptoWaitReady } from "@polkadot/util-crypto";

const dummyMachineData = "test-data"

const store = async () => {
  await cryptoWaitReady();
  const seeds = JSON.parse(await fs.readFile("seeds.json", "utf8"));
  const ownerSeed = seeds.owner;
  const machineSeed = seeds.machine;

  const ownerKeypair = generateKeyPair(ownerSeed);
  const machineKeypair = generateKeyPair(machineSeed);

  // Assuming generateKeyPair returns a keypair with a sign function
  const dataHex = u8aToHex(JSON.stringify(dummyMachineData));
  const signature = u8aToHex(machineKeypair.sign(hexToU8a(dataHex)));

  const payload = {
    data: dataHex,
    signature: signature,
  };

  const payloadHex = u8aToHex(JSON.stringify(payload), 512);

  await makeExtrinsicCall(
    "peaqStorage",
    "addItem",
    [machineKeypair.address, payloadHex],
    true,
    ownerKeypair
  );
};

store();
