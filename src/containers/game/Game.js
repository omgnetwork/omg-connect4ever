import React, { useState, useEffect } from 'react';
import { get } from 'lodash';

import checkWinner from 'util/checkWinner';
import addCoinToBoard from 'util/addCoinToBoard';

import Board from 'components/board/Board';

import * as styles from './Game.module.scss';

const POLLING_INTERVAL = 10000;

const DUMMY_TRANSACTIONS = [
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
  }
];

const Game = ({ history, match: { params } }) => {
  const address = get(params, 'address');

  const [ transactions, setTransactions ] = useState(DUMMY_TRANSACTIONS);

  useEffect(() => {
    if (address === 'new') {
      console.log('create new game address...');
    } else {
      getTransactions();
      const interval = setInterval(getTransactions, POLLING_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [address]);

  const dropCoin = (col) => {
    const currentBoardState = transactions.map(i => i.meta)[transactions.length - 1];
    const hasSpace = currentBoardState[col].includes(0);

    if (!hasSpace) {
      console.warn('invalid move: no space left');
      return;
    }

    // TODO: get current player color! R? B?
    const newBoardState = addCoinToBoard(col, currentBoardState, 'R');

    // check if move creates win state
    const isWinner = checkWinner(newBoardState, 'R');
    if (isWinner) {
      console.log('you won the game!');
      // if it does, make win transaction. display message
    } else {
      console.log('no winner... making transaction...');
      setTransactions([
        ...transactions,
        {
          timestamp: Date.now(),
          meta: newBoardState
        }
      ]);
      // if it does not, make move transaction. display message
    }
  }

  const getTransactions = async () => {
    // fetch real transactions using game address and set in game state
    console.log('fetching transactions...');
    // setTransactions(_transactions);
  }

  return (
    <div className={styles.Game}>
      <Board
        onClick={dropCoin}
        data={transactions.map(i => i.meta)[transactions.length - 1]}
      />
    </div>
  )
}

export default Game;
