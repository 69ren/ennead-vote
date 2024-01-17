import { ethers } from "ethers";
import { Booster__factory } from "../types/ethers-contracts/factories/Booster__factory";

import { resolve } from "path";
import { config as dotenvConfig } from "dotenv";

dotenvConfig({ path: resolve(__dirname, "../.env") });

async function main() {
  const provider = new ethers.JsonRpcProvider("https://arbitrum.llamarpc.com");
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);
  const booster = Booster__factory.connect(
    "0x999bbd4af2d5Ba6E910A14a5ad4AA7CC2b5D27c5",
    provider
  );

  const args = process.argv.slice(2);
  const votesArg = args
    .find((arg) => arg.startsWith("--votes="))
    ?.split("=")[1];
  const weightsArg = args
    .find((arg) => arg.startsWith("--weights="))
    ?.split("=")[1];

  const votes = votesArg ? votesArg.split(",") : [];
  const weights = weightsArg
    ? weightsArg.split(",").map((weight) => BigInt(weight))
    : [];

  await (await booster.connect(signer).vote(votes, weights)).wait();
  console.log("success");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
