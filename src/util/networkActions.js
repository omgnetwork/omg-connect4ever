import erc20abi from 'human-standard-token-abi';
import { transaction } from '@omisego/omg-js-util';

// import numberToBN from 'number-to-bn';
import BigNumber from 'big-number';

export const deposit = async (web3, from, value, rootChain) => {
  const depositTx = transaction.encodeDeposit(from, value, transaction.ETH_CURRENCY)
  try {
    await rootChain.depositEth(depositTx, value, { from });
    return true;
  } catch (e) {
    console.warn('error making deposit: ', e);
    return false;
  }
}

export const createAddress = async (web3) => {
  const res = web3.eth.accounts.create();
  return res.address;
};

export const getAccounts = async (web3) => {
  const accounts = await web3.eth.getAccounts();
  return accounts.map(address => ({
    address,
    rootBalance: 0,
    childBalance: 0
  }));
};

export const getUtxos = async (childChain, address) => {
  return childChain.getUtxos(address);
};

export const getTransactions = async (childChain, address) => {
  return childChain.getTransactions({ address });
};

export const getBalances = async (childChain, account, web3) => {
  account.rootBalance = await web3.eth.getBalance(account.address);
  const childchainBalance = await childChain.getBalance(account.address);

  account.childBalance = await Promise.all(childchainBalance.map(
    async (balance) => {
      if (balance.currency === transaction.ETH_CURRENCY) {
        balance.symbol = 'ETH'
      } else {
        const tokenContract = new web3.eth.Contract(erc20abi, balance.currency)
        try {
          balance.symbol = await tokenContract.methods.symbol().call()
        } catch (err) {
          balance.symbol = 'Unknown ERC20'
        }
      }
      return balance
    }
  ))

  return account;
}

export const selectUtxos = (utxos, amount, currency) => {
  const correctCurrency = utxos.filter(utxo => utxo.currency === currency)
  // Just find the first utxo that can fulfill the amount
  const selected = correctCurrency.find(utxo => BigNumber(utxo.amount).gte(BigNumber(amount)))
  if (selected) {
    return [selected]
  }
}

export const getMoveFromTransaction = async (_transaction, childChain) => {
  const { txhash } = _transaction;
  const transactionData = await childChain.getTransaction(txhash);
  const transactionOwner = transactionData.inputs[0].owner;
  const meta = transaction.decodeMetadata(_transaction.metadata);
  return {
    time: transactionData.block.timestamp,
    owner: transactionOwner,
    move: JSON.parse(meta)
  };
}

export const transfer = async (web3, childChain, from, to, amount, contract, meta) => {
  const utxos = await childChain.getUtxos(from)
  const utxosToSpend = selectUtxos(
    utxos,
    amount,
    transaction.ETH_CURRENCY
  )
  if (!utxosToSpend) {
    throw new Error(`No utxo big enough to cover the amount ${amount}`)
  }

  const txBody = transaction.createTransactionBody(
    from,
    utxosToSpend,
    to,
    amount,
    transaction.ETH_CURRENCY,
    transaction.encodeMetadata(JSON.stringify(meta))
  )

  const typedData = transaction.getTypedData(txBody, contract)
  // We should really sign each input separately but in this we know that they're all
  // from the same address, so we can sign once and use that signature for each input.
  // const sigs = await Promise.all(utxosToSpend.map(input => signTypedData(web3, web3.utils.toChecksumAddress(from), typedData)))
  const signature = await signTypedData(
    web3,
    web3.utils.toChecksumAddress(from),
    JSON.stringify(typedData)
  )
  const sigs = new Array(utxosToSpend.length).fill(signature)
  const signedTx = childChain.buildSignedTransaction(typedData, sigs)
  return childChain.submitTransaction(signedTx)
}

const signTypedData = (web3, signer, data) => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send(
      {
        method: 'eth_signTypedData_v3',
        params: [signer, data],
        from: signer
      },
      (err, result) => {
        if (err) {
          reject(err)
        } else if (result.error) {
          reject(result.error.message)
        } else {
          resolve(result.result)
        }
      }
    )
  })
}