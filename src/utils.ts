import { Safe, SafeTransaction } from "@gnosis.pm/safe-core-sdk";
import chalk from "chalk";

export const logSubtitle = (subtitle: string) => console.log(chalk.cyan(subtitle))

export const approveAndExecute = (safe1: Safe, safe2: Safe) => async (safeTransaction: SafeTransaction) => {
  const removeOwnerTxHash = await safe1.getTransactionHash(safeTransaction)
  await safe1.approveTransactionHash(removeOwnerTxHash).then(tx => tx.wait())
  await safe2.approveTransactionHash(removeOwnerTxHash).then(tx => tx.wait())
  await safe1.executeTransaction(safeTransaction).then(tx => tx.wait())
}
