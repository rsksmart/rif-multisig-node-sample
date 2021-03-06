import { Contract, BigNumber } from 'ethers'
import { Safe, SafeTransaction } from "@gnosis.pm/safe-core-sdk";
import chalk from "chalk";

export const logGrey = (text: string, ...rest: any) => console.log(chalk.gray(text), ...rest)

export const logSubtitle = (subtitle: string) => console.log(chalk.cyan(subtitle))

export const approveAndExecute = (safe1: Safe, safe2: Safe) => async (safeTransaction: SafeTransaction) => {
  const removeOwnerTxHash = await safe1.getTransactionHash(safeTransaction)
  await safe1.approveTransactionHash(removeOwnerTxHash).then(tx => tx.wait())
  await safe2.approveTransactionHash(removeOwnerTxHash).then(tx => tx.wait())
  await safe1.executeTransaction(safeTransaction).then(tx => tx.wait())
}

export const logCount = async (counter: Contract) => {
  logGrey('Count', await counter.count().then((r: BigNumber) => r.toNumber()))
}
