import { providers } from 'ethers'
import { createSafeFactory } from './create'
import { deployContracts } from './deploy'
import { gas } from './gas'
import { polices } from './polices'
import { erc20 as erc20script } from './erc20'
import { raw } from './raw'
import { offchain } from './offchain'

console.log(`
██████╗ ██╗███████╗    ███╗   ███╗██╗   ██╗██╗  ████████╗██╗███████╗██╗ ██████╗
██╔══██╗██║██╔════╝    ████╗ ████║██║   ██║██║  ╚══██╔══╝██║██╔════╝██║██╔════╝
██████╔╝██║█████╗      ██╔████╔██║██║   ██║██║     ██║   ██║███████╗██║██║  ███╗
██╔══██╗██║██╔══╝      ██║╚██╔╝██║██║   ██║██║     ██║   ██║╚════██║██║██║   ██║
██║  ██║██║██║         ██║ ╚═╝ ██║╚██████╔╝███████╗██║   ██║███████║██║╚██████╔╝
╚═╝  ╚═╝╚═╝╚═╝         ╚═╝     ╚═╝ ╚═════╝ ╚══════╝╚═╝   ╚═╝╚══════╝╚═╝ ╚═════╝
`)

const main = async () => {
  const provider = new providers.JsonRpcProvider()
  const deployer = await provider.getSigner(0)
  const { safeFactory, safe, erc20, counter } = await deployContracts(deployer)
  console.log()

  const owner1 = provider.getSigner(0)
  const owner2 = provider.getSigner(1)
  const owner3 = provider.getSigner(2)

  const createSafe = createSafeFactory(owner1, safeFactory.address, safe.address)

  const safeSdk = await createSafe(
    [await owner1.getAddress(), await owner2.getAddress(), await owner3.getAddress()],
    2
  )

  const owners = [owner1, owner2, owner3]

  await polices(safeSdk, [...owners, await provider.getSigner(3)])
  await gas(safeSdk, owners)
  await erc20script(safeSdk, owners, erc20)
  await raw(safeSdk, owners, counter)
  await offchain(safeSdk, owners, counter)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
