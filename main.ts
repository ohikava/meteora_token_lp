import { Connection, PublicKey } from "@solana/web3.js";
import { DLMM } from "./src/dlmm";
import AmmImpl from './src/amm';
import "dotenv/config";


const connection = new Connection(process.env.RPC_URL, "finalized");

async function getDLLMRatio(poolAddress: PublicKey, walletAddress: PublicKey) {
  const dlmmPool = await DLMM.create(connection, poolAddress, {
    cluster: "mainnet-beta",
  });
  const { userPositions } = await dlmmPool.getPositionsByUserAndLbPair(
    walletAddress
  );

  for (let ix = 0; ix < userPositions.length; ix++) {
    const item = userPositions[ix]['positionData'];
    console.log(item['totalXAmount'] / 10**9, item['totalYAmount'] / 10**9);
  }

}

async function getDynamicPoolRatio(poolAddress: PublicKey, walletAddress: PublicKey) {
  const pool = await AmmImpl.create(connection, poolAddress);
  const userLpBalance = await pool.getUserBalance(walletAddress);
  const { poolTokenAmountIn, tokenAOutAmount, tokenBOutAmount } = pool.getWithdrawQuote(userLpBalance); // use lp balance for full withdrawal
  console.log(tokenAOutAmount.toNumber() / 10**9, tokenBOutAmount.toNumber() / 10**9)
}

async function main() {
  const WALLET = new PublicKey("4Ugxy4QkH3CU1zXaaXMNdyG9sjNXvKJpoR7G3aNYsy2T");
  const DLLM_POOL = new PublicKey("2dBPJGLgNDZnzA32452zV2u6vensbo28dveBvecDg6X1");
  const DYNAMIC_POOL = new PublicKey("HcjZvfeSNJbNkfLD4eEcRBr96AD3w1GpmMppaeRZf7ur");

  await getDLLMRatio(DLLM_POOL, WALLET);
  await getDynamicPoolRatio(DYNAMIC_POOL, WALLET);
}

main()
