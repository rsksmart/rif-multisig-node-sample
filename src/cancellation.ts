import { Contract, Signer } from 'ethers'
import { Safe } from '@gnosis.pm/safe-core-sdk'
import { rejectTx } from '@rsksmart/safe-transactions-sdk'
import { approveAndExecute, logSubtitle, logCount, logGrey } from './utils'

export const cancellation = async (safeSdk: Safe, owners: Signer[], counter: Contract) => {
  logSubtitle('Cancellation')

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

  const cancellationTx = await rejectTx(safe1, tx)

  await approveAndExecute(safe1, safe2)(cancellationTx)

  try {
    await approveAndExecute(safe1, safe2)(tx)
  } catch (e) {
    logGrey('Catched error', `...${e.message.slice(67, 180)}...`)
  }

  await logCount(counter)
  console.log()
}
