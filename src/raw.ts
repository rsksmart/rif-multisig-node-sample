import { Contract, Signer } from 'ethers'
import { Safe } from '@gnosis.pm/safe-core-sdk'
import { approveAndExecute, logSubtitle, logCount } from './utils'

export const raw = async (safeSdk: Safe, owners: Signer[], counter: Contract) => {
  logSubtitle('Raw tx')

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

  await approveAndExecute(safe1, safe2)(tx)

  await logCount(counter)
  console.log()
}
