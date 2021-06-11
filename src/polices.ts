import { Signer } from '@ethersproject/abstract-signer'
import { Safe } from '@gnosis.pm/safe-core-sdk'
import { logSubtitle, logGrey } from './utils'

const logPolices = async (safe: Safe) => {
  logGrey('Current polices')
  logGrey(`Owners`, await safe.getOwners())
  logGrey(`Threshold`, await safe.getThreshold())
  console.log()
}

export const polices = async (safeSdk: Safe, owners: Signer[]) => {
  logSubtitle('Polices')
  await logPolices(safeSdk)

  const safe1 = await safeSdk.connect(owners[0]) as any as Safe
  const safe2 = await safeSdk.connect(owners[1]) as any as Safe
  const safe3 = await safeSdk.connect(owners[2]) as any as Safe
  const safe4 = await safeSdk.connect(owners[3]) as any as Safe

  console.log('Adding owner')
  // first create the "add owner" transaction
  const addOwnerTx = await safe1.getAddOwnerTx(await owners[3].getAddress())

  // then approve it to fulfill the threshold
  const addOwnerTxHash = await safe1.getTransactionHash(addOwnerTx)
  await safe1.approveTransactionHash(addOwnerTxHash).then(tx => tx.wait())
  await safe2.approveTransactionHash(addOwnerTxHash).then(tx => tx.wait())

  // finally, submit the transaction
  await safe1.executeTransaction(addOwnerTx).then(tx => tx.wait())

  await logPolices(safe1)

  console.log('Changing the threshold...')
  const changeThresholdTx = await safe1.getChangeThresholdTx(3)

  const changeThresholdTxHash = await safe1.getTransactionHash(changeThresholdTx)
  await safe1.approveTransactionHash(changeThresholdTxHash).then(tx => tx.wait())
  await safe2.approveTransactionHash(changeThresholdTxHash).then(tx => tx.wait())
  await safe1.executeTransaction(changeThresholdTx).then(tx => tx.wait())

  await logPolices(safe1)

  console.log('Removing an owner...')
  const removeOwnerTx = await safe1.getRemoveOwnerTx(await owners[2].getAddress())

  const removeOwnerTxHash = await safe1.getTransactionHash(removeOwnerTx)
  await safe1.approveTransactionHash(removeOwnerTxHash).then(tx => tx.wait())
  await safe2.approveTransactionHash(removeOwnerTxHash).then(tx => tx.wait())
  await safe3.approveTransactionHash(removeOwnerTxHash).then(tx => tx.wait())
  await safe1.executeTransaction(removeOwnerTx).then(tx => tx.wait())

  await logPolices(safe1)

  console.log('Swapping an owner...')
  const swapOwnerTx = await safe1.getSwapOwnerTx(await owners[3].getAddress(), await owners[2].getAddress())

  const swapOwnerTxHash = await safe1.getTransactionHash(swapOwnerTx)
  await safe1.approveTransactionHash(swapOwnerTxHash).then(tx => tx.wait())
  await safe2.approveTransactionHash(swapOwnerTxHash).then(tx => tx.wait())
  await safe4.approveTransactionHash(swapOwnerTxHash).then(tx => tx.wait())
  await safe1.executeTransaction(swapOwnerTx).then(tx => tx.wait())

  await logPolices(safe1)

  // setting back the threshold to 2
  const changeThresholdTx2 = await safe1.getChangeThresholdTx(2)
  const changeThresholdTxHash2 = await safe1.getTransactionHash(changeThresholdTx2)
  await safe1.approveTransactionHash(changeThresholdTxHash2).then(tx => tx.wait())
  await safe2.approveTransactionHash(changeThresholdTxHash2).then(tx => tx.wait())
  await safe3.approveTransactionHash(changeThresholdTxHash2).then(tx => tx.wait())
  await safe1.executeTransaction(changeThresholdTx2).then(tx => tx.wait())
}
