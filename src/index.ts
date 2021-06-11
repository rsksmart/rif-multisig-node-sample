import { providers } from 'ethers'
import { createSafeFactory } from './create'
import { deployContracts } from './deploy'
import { gas } from './gas'
import { polices } from './polices'

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
  const { safeFactory, safe } = await deployContracts(deployer)
  console.log()

  const owner1 = provider.getSigner(1)
  const owner2 = provider.getSigner(2)
  const owner3 = provider.getSigner(3)

  const createSafe = createSafeFactory(owner1, safeFactory.address, safe.address)

  const safeSdk = await createSafe(
    [await owner1.getAddress(), await owner2.getAddress(), await owner3.getAddress()],
    2
  )
  console.log()

  await polices(safeSdk, [owner1, owner2, owner3, await provider.getSigner(4)])
  await gas(safeSdk, [owner1, owner2, owner3])
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
