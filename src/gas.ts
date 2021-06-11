import { Signer } from "@ethersproject/abstract-signer";
import { Safe } from "@gnosis.pm/safe-core-sdk";
import { approveAndExecute, logSubtitle } from "./utils";

const logBalance = async (safeSdk: Safe) => {
  console.log('Balance', await safeSdk.getProvider().getBalance(await safeSdk.getAddress()).then(r => r.toNumber()))
}

export const gas = async (safeSdk: Safe, owners: Signer[]) => {
  logSubtitle('Gas payment')

  const safe1 = await safeSdk.connect(owners[0]) as any as Safe
  const safe2 = await safeSdk.connect(owners[1]) as any as Safe

  await logBalance(safe1)

  const value = '0x1000000'

  console.log('Receiving funds')

  const safeAddress = await safe1.getAddress()
  await owners[0].sendTransaction({ to: safeAddress, value })

  await logBalance(safe1)

  console.log('Sending funds')

  const to = '0x1111111111111111111111111111111111111111'

  const sendBalanceTx = await safe1.createTransaction({
    to,
    data: '0x',
    value
  })

  await approveAndExecute(safe1, safe2)(sendBalanceTx)

  await logBalance(safe1)

  console.log('"to" balance', await safeSdk.getProvider().getBalance(to).then(r => r.toNumber()))
}
