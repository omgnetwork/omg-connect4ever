import { cloneDeep } from 'lodash';

const addCoinToBoard = (col, board, color) => {
  const newBoard = cloneDeep(board);
  for (let i = 0; i < newBoard[col].length; i++) {
    const iPosition = newBoard[col][i];
    if (iPosition === 0) {
      newBoard[col].splice(i, 1, color);
      break;
    }
  }
  return newBoard;
}

export default addCoinToBoard;
