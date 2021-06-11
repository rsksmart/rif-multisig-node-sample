import { EthersSafeFactory } from '@rsksmart/safe-factory-sdk'
import chalk from 'chalk'

export const createSafeFactory = (...args: ConstructorParameters<typeof EthersSafeFactory>) => async (owners: string[], threshold: number) => {
  console.log(chalk.cyan('Creating a new multi-sig wallet'))
  console.log('Owners', owners)
  console.log('Threshold', threshold)
  const factory = new EthersSafeFactory(...args)
  const safe = await factory.createSafe({
    owners, threshold
  })
  console.log('Safe created', await safe.getAddress())
  return safe
}
