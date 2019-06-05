import React, { useState } from 'react';
import { get, orderBy, cloneDeep, isEqual } from 'lodash';
import { produce } from 'immer';

import network from 'util/network';
import { useInterval } from 'util/useInterval';
import { getTransactions, transfer, getAccounts, getMoveFromTransaction } from 'util/networkActions';
import checkWinner from 'util/checkWinner';
import addCoinToBoard from 'util/addCoinToBoard';
import getMoveCoordinates from 'util/getMoveCoordinates';
import config from 'util/config';

import Board from 'components/board/Board';

import * as styles from './Game.module.scss';

const POLLING_INTERVAL = 10000;

const INITIAL_BOARD_STATE = {
  col1: [0, 0, 0, 0, 0, 0],
  col2: [0, 0, 0, 0, 0, 0],
  col3: [0, 0, 0, 0, 0, 0],
  col4: [0, 0, 0, 0, 0, 0],
  col5: [0, 0, 0, 0, 0, 0],
  col6: [0, 0, 0, 0, 0, 0],
  col7: [0, 0, 0, 0, 0, 0]
};

const Game = ({ history, match: { params } }) => {
  const gameAddress = get(params, 'gameaddress');

  const [ board, setBoard ] = useState(INITIAL_BOARD_STATE);
  const [ turn, setTurn ] = useState(true);
  const [ pending, setPending ] = useState(false);

  const buildBoard = (moves, currentPlayer) => {
    const board = cloneDeep(INITIAL_BOARD_STATE);
    for (let i = 0; i < moves.length; i++) {
      const player = moves[i].owner.toLowerCase() === currentPlayer ? 'B' : 'R';
      const { x, y } = moves[i].move;
      board[`col${x}`] = produce(board[`col${x}`], draft => {
        draft[y] = player
      });
    }
    return board;
  }

  const emptyBoard = (board) => {
    let isEmpty = true;
    for (let i = 1; i < Object.keys(board).length; i++) {
      const values = board[`col${i}`];
      if (!values.every(i => i === 0)) {
        isEmpty = false;
        break;
      }
    }
    return isEmpty;
  }

  const checkTurn = (moves, accounts) => {
    if (moves[0].owner.toLowerCase() === accounts[0].address.toLowerCase()) {
      setTurn(false);
    } else {
      setTurn(true);
    }
  }

  const getBoardMoves = async () => {
    const res = await getTransactions(network.childChain, gameAddress);
    if (res.length) {
      const movePromises = res.map(transaction => getMoveFromTransaction(transaction, network.childChain));
      const _moves = await Promise.all(movePromises);
      const moves = orderBy(_moves, ['timestamp', 'desc']);

      const accounts = await getAccounts(network.web3);
      const newBoard = buildBoard(moves, accounts[0].address.toLowerCase())

      const isLoser = checkWinner(newBoard, 'R');
      if (isLoser) {
        alert('Sorry! You lost!');
        history.push('/');
      }

      if (emptyBoard(board)) {
        console.log('empty...');
        setBoard(newBoard);
        checkTurn(moves, accounts);
        return;
      }

      if (isEqual(board, newBoard)) {
        console.log('equal...');
        checkTurn(moves, accounts);
        return;
      }

      if (pending) {
        console.log('pending...');
        setTurn(false);
        return;
      } 

      console.log('final')
      setBoard(newBoard);
      checkTurn(moves, accounts);
      setPending(false);
    }
  }

  const dropCoin = async (col) => {
    const hasSpace = board[col].includes(0);
    if (!hasSpace) {
      alert('This column is full. Pick another one!');
      return;
    };

    const moveCoordinates = getMoveCoordinates(col, board);
    const newBoardState = addCoinToBoard(col, board, 'B');

    const accounts = await getAccounts(network.web3);
    await transfer(
      network.web3,
      network.childChain,
      accounts[0].address,
      gameAddress,
      250000000000,
      config.PLASMA_CONTRACT_ADDRESS,
      moveCoordinates
    );

    setPending(true);
    setTurn(false);
    setBoard(newBoardState);

    const isWinner = checkWinner(newBoardState, 'B');
    if (isWinner) {
      alert('YOU WON!');
      history.push('/');
    }
  }

  getBoardMoves();
  useInterval(getBoardMoves, POLLING_INTERVAL);

  return (
    <div className={styles.Game}>
      <Board
        onClick={turn ? dropCoin : () => alert('Its not your turn!')}
        data={board}
      />
      <div className={styles.sidebar}>
        {turn ? 'Its your turn!': 'Please wait for your opponent...'}
      </div>
    </div>
  )
}

export default Game;
