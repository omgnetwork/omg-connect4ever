import React, { useState, useEffect } from 'react';
import { get } from 'lodash';

import network from 'util/network';
import { getTransactions, transfer, getAccounts } from 'util/networkActions';
import checkWinner from 'util/checkWinner';
import addCoinToBoard from 'util/addCoinToBoard';
import getMoveCoordinates from 'util/getMoveCoordinates';
import config from 'util/config';

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
  const gameAddress = get(params, 'gameaddress');

  const [ transactions, setTransactions ] = useState(DUMMY_TRANSACTIONS);

  useEffect(() => {
    getBoardMoves();
    const interval = setInterval(getBoardMoves, POLLING_INTERVAL);
    return () => clearInterval(interval);
  });

  const getBoardMoves = async () => {
    const res = await getTransactions(network.childChain, gameAddress);
    if (res.length) {
      console.log(res);
      // convert transaction metadata into game state
      // get player turn from transaction data
      // setTransactions(_transactions);
    }
  }

  const dropCoin = async (col) => {
    // TODO: build board from transaction data
    // const currentBoardState = buildBoard(transactions);
    const currentBoardState = transactions.map(i => i.meta)[transactions.length - 1];
    const hasSpace = currentBoardState[col].includes(0);

    if (!hasSpace) {
      console.warn('invalid move: no space left');
      return;
    }

    const moveCoordinates = getMoveCoordinates(col, currentBoardState);
    const newBoardState = addCoinToBoard(col, currentBoardState, 'R');

    // check if move creates win state
    const isWinner = checkWinner(newBoardState, 'R');
    if (isWinner) {
      // if it does, make win transaction. display message
      console.log('you won the game!');
    } else {
      const accounts = await getAccounts(network.web3);
      // TODO: don't assume we are using the first account...
      const res = await transfer(
        network.web3,
        network.childChain,
        accounts[0].address,
        gameAddress,
        250000000000,
        config.PLASMA_CONTRACT_ADDRESS
      );
      console.log('res: ', res);

      setTransactions([
        ...transactions,
        {
          timestamp: Date.now(),
          meta: newBoardState
        }
      ]);
    }
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
