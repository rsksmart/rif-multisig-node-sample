import { BigNumber, Contract, Signer } from 'ethers'
import { Safe } from '@gnosis.pm/safe-core-sdk'
import { approveAndExecute, logSubtitle } from './utils'

const logCount = async (counter: Contract) => {
  console.log('Count', await counter.count().then((r: BigNumber) => r.toNumber()))
}

export const offchain = async (safeSdk: Safe, owners: Signer[], counter: Contract) => {
  logSubtitle('Off chain signatures')

  const safe1 = await safeSdk.connect(owners[0]) as any as Safe
  const safe2 = await safeSdk.connect(owners[1]) as any as Safe

  await logCount(counter)

  console.log('Calling inc()')

  const tx = await safe1.createTransaction({
    to: counter.address,
    data: counter.interface.encodeFunctionData('inc'),
    value: '0',
    operation: 0 // call
  })

  await safe1.signTransaction(tx)
  await safe2.signTransaction(tx)

  console.log(tx.signatures)

  await safeSdk.executeTransaction(tx).then(tx => tx.wait())

  await logCount(counter)
  console.log()
}
