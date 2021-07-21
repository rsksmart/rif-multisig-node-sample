import { Signer, Contract, ContractTransaction, BigNumber, Event } from 'ethers';
import { Safe } from '@gnosis.pm/safe-core-sdk';
import { ERC721TransactionBuilder } from '@rsksmart/safe-transactions-sdk';
import { approveAndExecute, logSubtitle, logGrey } from './utils';

const extractTokenId = async (tx: ContractTransaction): Promise<BigNumber> => {
  const txResponse = await tx.wait()
  const eventTransfer = txResponse.events?.find((ev: Event) => ev.event === 'Transfer') as Event
  return eventTransfer?.args?.tokenId
}

const createToken = async (erc721: Contract, initialOwner: string) => {
  const receipt = await erc721.createAndAssign(initialOwner);
  const firstToken = await extractTokenId(receipt);
  return firstToken;
}

const logOwner = async (erc721: Contract, tokenId: BigNumber) => {
  const owner = await erc721.ownerOf(tokenId)
  logGrey(`Token ${tokenId.toString()} assigned to`, owner)
}

export const erc721 = async (safeSdk: Safe, owners: Signer[], erc721: Contract) => {
  logSubtitle('ERC721 token')

  const safe1 = await safeSdk.connect(owners[0]) as any as Safe
  const safe2 = await safeSdk.connect(owners[1]) as any as Safe

  const firstToken = await createToken(erc721, safeSdk.getAddress())
  logOwner(erc721, firstToken)

  const tokenReceiver = await owners[1].getAddress()
  const txBuilder = new ERC721TransactionBuilder(safeSdk, erc721.address)
  const transferFromTx = await txBuilder.transferFrom(
    safeSdk.getAddress(),
    tokenReceiver,
    firstToken
  )  
  await approveAndExecute(safe1, safe2)(transferFromTx)
  console.log('After the "transferFrom" transaction execution')
  logOwner(erc721, firstToken)


  const secondTokenReceiver = await owners[2].getAddress()
  const secondToken = await createToken(erc721, safeSdk.getAddress())
  logOwner(erc721, secondToken)

  const safeTransferFromTx = await txBuilder.safeTransferFrom(
    safeSdk.getAddress(),
    secondTokenReceiver,
    secondToken
  )
  await approveAndExecute(safe1, safe2)(safeTransferFromTx)
  console.log('After the "safeTransferFrom" transaction execution')
  logOwner(erc721, secondToken)
}


