import erc20abi from 'human-standard-token-abi';
import { transaction } from '@omisego/omg-js-util';
import numberToBN from 'number-to-bn';
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

export const transfer = async (web3, childChain, from, to, amount, contract) => {
  const utxos = await childChain.getUtxos(from)
  const utxosToSpend = selectUtxos(
    utxos,
    amount,
    transaction.ETH_CURRENCY
  )
  if (!utxosToSpend) {
    throw new Error(`No utxo big enough to cover the amount ${amount}`)
  }

  const txBody = {
    inputs: utxosToSpend,
    outputs: [{
      owner: to,
      currency: transaction.ETH_CURRENCY,
      amount: amount.toString()
    }]
  }

  const bnAmount = numberToBN(utxosToSpend[0].amount)
  if (bnAmount.gt(numberToBN(amount))) {
    // Need to add a 'change' output
    const CHANGE_AMOUNT = bnAmount.sub(numberToBN(amount))
    txBody.outputs.push({
      owner: from,
      currency: transaction.ETH_CURRENCY,
      amount: CHANGE_AMOUNT
    })
  }

  // Get the transaction data
  const typedData = transaction.getTypedData(txBody, contract)

  // We should really sign each input separately but in this we know that they're all
  // from the same address, so we can sign once and use that signature for each input.
  //
  // const sigs = await Promise.all(utxosToSpend.map(input => signTypedData(web3, web3.utils.toChecksumAddress(from), typedData)))
  //
  const signature = await signTypedData(
    web3,
    web3.utils.toChecksumAddress(from),
    JSON.stringify(typedData)
  )
  const sigs = new Array(utxosToSpend.length).fill(signature)

  // Build the signed transaction
  const signedTx = childChain.buildSignedTransaction(typedData, sigs)
  // Submit the signed transaction to the childchain
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