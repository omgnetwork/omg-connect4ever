const getMoveCoordinates = (col, board) => {
  let row;
  for (let i = 0; i < board[col].length; i++) {
    if (board[col][i] === 0) {
      row = i;
      break;
    };
  }

  return {
    x: Number.parseInt(col.split('col')[1]),
    y: row
  }
}

export default getMoveCoordinates;
