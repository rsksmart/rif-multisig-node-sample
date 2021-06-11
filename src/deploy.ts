import { ContractFactory, Signer } from 'ethers'
import SafeFactory from './contracts/SafeFactory.json'
import Safe from './contracts/Safe.json'
import chalk from 'chalk'

const simpleDeploy = async (...params: ConstructorParameters<typeof ContractFactory>) => {
  const factory = new ContractFactory(...params)
  const contract = await factory.deploy()
  await contract.deployTransaction.wait()
  return contract
}

export const deployContracts = async (signer: Signer) => {
  console.log(chalk.cyan('Deploying smart contracts'))
  const safeFactory = await simpleDeploy(SafeFactory.abi, SafeFactory.bytecode, signer)
  const safe = await simpleDeploy(Safe.abi, Safe.bytecode, signer)

  console.log('Gnosis Safe Factory', safeFactory.address)
  console.log('Gnosis Safe', safe.address)

  return { safeFactory, safe }
}
