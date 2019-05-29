import React, { useState, useEffect } from 'react';
import { get } from 'lodash';

import Board from 'components/board/Board';

import * as styles from './Game.module.scss';

const POLLING_INTERVAL = 10000;

const Game = ({ history, match: { params } }) => {
  const address = get(params, 'address');

  const [ transactions, setTransactions ] = useState([]);

  useEffect(() => {
    if (address === 'new') {
      console.log('create new game address...');
    } else {
      getTransactions();
      const interval = setInterval(getTransactions, POLLING_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [address]);

  const getTransactions = async () => {
    // fetch real transactions using game address
    console.log('fetching transactions...');
    const _transactions = [
      {
        timestamp: Date.now(),
        meta: {
          col1: [0, 0, 0, 0, 0, 0],
          col2: [0, 0, 0, 0, 0, 0],
          col3: [0, 0, 0, 0, 0, 0],
          col4: ['R', 0, 0, 0, 0, 0],
          col5: [0, 0, 0, 0, 0, 0],
          col6: [0, 0, 0, 0, 0, 0],
          col7: [0, 0, 0, 0, 0, 0]
        }
      },
      {
        timestamp: Date.now(),
        meta: {
          col1: [0, 0, 0, 0, 0, 0],
          col2: [0, 0, 0, 0, 0, 0],
          col3: [0, 0, 0, 0, 0, 0],
          col4: ['R', 0, 0, 0, 0, 0],
          col5: [0, 0, 0, 0, 0, 0],
          col6: ['B', 0, 0, 0, 0, 0],
          col7: [0, 0, 0, 0, 0, 0]
        }
      },
      {
        timestamp: Date.now(),
        meta: {
          col1: [0, 0, 0, 0, 0, 0],
          col2: ['B', 0, 0, 0, 0, 0],
          col3: [0, 0, 0, 0, 0, 0],
          col4: ['R', 0, 0, 0, 0, 0],
          col5: [0, 0, 0, 0, 0, 0],
          col6: ['B', 'R', 0, 0, 0, 0],
          col7: [0, 0, 0, 0, 0, 0]
        }
      },
    ];
    setTransactions(_transactions);
  }

  return (
    <div className={styles.Game}>
      <Board
        onClick={console.log}
        data={transactions.map(i => i.meta)[transactions.length - 1]}
      />
    </div>
  )
}

export default Game;
