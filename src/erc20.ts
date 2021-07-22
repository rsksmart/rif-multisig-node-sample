import { Signer, Contract, ContractTransaction, BigNumber } from 'ethers';
import { Safe } from '@gnosis.pm/safe-core-sdk';
import { ERC20TransactionBuilder } from '@rsksmart/safe-transactions-sdk';
import { approveAndExecute, logSubtitle, logGrey } from './utils';

const logBalance = async (safeSdk: Safe, erc20: Contract) => {
  logGrey('Balance', await erc20.balanceOf(await safeSdk.getAddress()).then((r: BigNumber) => r.toNumber()))
}

export const erc20 = async (safeSdk: Safe, owners: Signer[], erc20: Contract) => {
  logSubtitle('ERC20 payment')

  const safe1 = await safeSdk.connect(owners[0]) as any as Safe
  const safe2 = await safeSdk.connect(owners[1]) as any as Safe

  await logBalance(safe1, erc20)

  const value = '0x1000000'
  const to = '0x1111111111111111111111111111111111111111'

  console.log('Receiving funds')

  const safeAddress = await safe1.getAddress()
  await erc20.transfer(safeAddress, value).then((tx: ContractTransaction) => tx.wait())

  await logBalance(safe1, erc20)

  console.log('Sending funds')

  const txBuilder = new ERC20TransactionBuilder(safe1, erc20.address)
  const sendBalanceTx = await txBuilder.transfer(to, BigNumber.from(value))

  await approveAndExecute(safe1, safe2)(sendBalanceTx)

  await logBalance(safe1, erc20)

  console.log('"to" balance', await erc20.balanceOf(to).then((r: BigNumber) => r.toNumber()))
  console.log()
}
