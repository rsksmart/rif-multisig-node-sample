import { ContractFactory, Signer } from 'ethers'
import SafeFactory from './contracts/SafeFactory.json'
import Safe from './contracts/Safe.json'

const simpleDeploy = async (...params: ConstructorParameters<typeof ContractFactory>) => {
  const factory = new ContractFactory(...params)
  const contract = await factory.deploy()
  await contract.deployTransaction.wait()
  return contract
}

export const deployContracts = async (signer: Signer) => {
  const safeFactory = await simpleDeploy(SafeFactory.abi, SafeFactory.bytecode, signer)
  const safe = await simpleDeploy(Safe.abi, Safe.bytecode, signer)

  return { safeFactory, safe }
}
