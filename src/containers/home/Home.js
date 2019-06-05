import React, { useState, useEffect } from 'react';

import network from 'util/network';
import { createAddress, getAccounts, getBalances, deposit } from 'util/networkActions';

import Button from 'components/button/Button';
import * as styles from './Home.module.scss';

const POLLING_INTERVAL = 5000;

const Home = ({ history }) => {
  const [ balances, setBalances ] = useState([]);
  const [ hasSufficientBalance, setHasSufficientBalance ] = useState(false);

  useEffect(() => {
    getUserBalances();
    const interval = setInterval(getUserBalances, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const getUserBalances = async () => {
    const accounts = await getAccounts(network.web3);
    let balancePromises = [];
    for (let i = 0; i < accounts.length; i++) {
      balancePromises.push(getBalances(network.childChain, accounts[i], network.web3));
    }
    const balances = await Promise.all(balancePromises);
    setBalances(balances);

    const childAmounts = balances.map(i => i.childBalance.length ? i.childBalance : false)
      .filter(i => !!i);
    if (!!childAmounts.length) setHasSufficientBalance(true);
  }

  const createGameAddress = async () => {
    const address = await createAddress(network.web3);
    history.push(`/game/${address}`);
  }

  const depositEth = () => {
    // TODO: use address with balance, dont assume it's the first one
    deposit(network.web3, balances[0].address, 100000000000000000, network.rootChain);
  }

  return (
    <div className={styles.Home}>
      <h1>Connect4Ever</h1>
      <p>The first Connect 4 experience on the OMG-Network.</p>

      <div className={styles.depositRow}>
        <div className={styles.left}>
          <h3>Balance</h3>
          {balances.map((i, index) => (
            <div key={index}>
              <div className={styles.balance}>
                <div>Address: </div>
                <div>{`${i.address.substring(0, 20)}...`}</div>
              </div>

              <div className={styles.balance}>
                <div>Root Balance: </div>
                <div>{`${i.rootBalance} wei`}</div>
              </div>

              <div className={styles.balance}>
                <div>Plasma Balance: </div>
                <div>{`${i.childBalance[0] ? i.childBalance[0].amount : '0'} wei`}</div>
              </div>                
            </div>
          ))}

          <div className={styles.msg}>
            Please note that after a deposit it will take about 90 seconds for your Plasma Balance to update, so please be patient.
          </div>

          <Button
            style={{ marginTop: '20px' }}
            onClick={depositEth}
          >
            Deposit 0.1 ETH
          </Button>
        </div>

        <div className={styles.right}>
          {!hasSufficientBalance && (
            <p>You currently don't have a balance on Plasma. Please deposit some ETH into the OMG-Network to play.</p>
          )}
          <Button
            style={{ marginTop: '20px' }}
            onClick={createGameAddress}
            disabled={!hasSufficientBalance}
          >
            {hasSufficientBalance ? 'New Game' : 'Insufficient Balance'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Home;
