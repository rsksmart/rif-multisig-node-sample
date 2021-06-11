import { providers } from 'ethers'
import { deployContracts } from './deploy'

console.log(`
██████╗ ██╗███████╗    ███╗   ███╗██╗   ██╗██╗  ████████╗██╗███████╗██╗ ██████╗
██╔══██╗██║██╔════╝    ████╗ ████║██║   ██║██║  ╚══██╔══╝██║██╔════╝██║██╔════╝
██████╔╝██║█████╗      ██╔████╔██║██║   ██║██║     ██║   ██║███████╗██║██║  ███╗
██╔══██╗██║██╔══╝      ██║╚██╔╝██║██║   ██║██║     ██║   ██║╚════██║██║██║   ██║
██║  ██║██║██║         ██║ ╚═╝ ██║╚██████╔╝███████╗██║   ██║███████║██║╚██████╔╝
╚═╝  ╚═╝╚═╝╚═╝         ╚═╝     ╚═╝ ╚═════╝ ╚══════╝╚═╝   ╚═╝╚══════╝╚═╝ ╚═════╝
`)

const main = async () => {
  const provider = new providers.JsonRpcBatchProvider()
  const deployer = await provider.getSigner(0)
  const { safeFactory, safe } = await deployContracts(deployer)

  console.log(safeFactory.address)
  console.log(safe.address)
}

main()
