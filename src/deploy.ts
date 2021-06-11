import { ContractFactory, Signer } from 'ethers'
import { logSubtitle } from './utils'

import SafeFactory from './contracts/SafeFactory.json'
import Safe from './contracts/Safe.json'
import ERC20 from './contracts/ERC20.json'
import Counter from './contracts/Counter.json'

const simpleDeploy = (...params: ConstructorParameters<typeof ContractFactory>) => async (...args: Parameters<InstanceType<typeof ContractFactory>['deploy']>) => {
  const factory = new ContractFactory(...params)
  const contract = await factory.deploy(...args)
  await contract.deployTransaction.wait()
  return contract
}

export const deployContracts = async (signer: Signer) => {
  logSubtitle('Deploying smart contracts')

  const safeFactory = await simpleDeploy(SafeFactory.abi, SafeFactory.bytecode, signer)()
  const safe = await simpleDeploy(Safe.abi, Safe.bytecode, signer)()
  const erc20 = await simpleDeploy(ERC20.abi, ERC20.bytecode, signer)(signer.getAddress(), '0x1000000000000000000000', 'RIFOS', 'RIF')
  const counter = await simpleDeploy(Counter.abi, Counter.bytecode, signer)()

  console.log('Gnosis Safe Factory', safeFactory.address)
  console.log('Gnosis Safe', safe.address)

  return { safeFactory, safe, erc20, counter }
}
