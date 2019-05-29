const checkWinner = (board, color) => {
  let counter = 0;
  let colCounter = 0;

  // scan for vertical win
  for (let col = 1; col < 8; col++) {
    counter = 0;
    colCounter = 0;
    for (let row = 0; row < 6; row++) {
      const cellCoin = board[`col${col}`][row];
      if (cellCoin === color) {
        counter++
      } else {
        counter = 0;
      }
      if (counter === 4) {
        console.log('vertical win');
        return true;
      }
    }
  }

  // scan for horizontal win
  for (let row = 0; row < 6; row++) {
    counter = 0;
    colCounter = 0;
    for (let col = 1; col < 8; col++) {
      const cellCoin = board[`col${col}`][row];
      if (cellCoin === color) {
        counter++
      } else {
        counter = 0;
      }
      if (counter === 4) {
        console.log('horizontal win');
        return true;
      }
    }
  }

  // scan for rightdiagonal win -> go up and right
  for (let col = 1; col < 8; col++) {
    counter = 0;
    colCounter = 0;
    for (let row = 0; row < 6; row++) {
      if (!board[`col${col + colCounter}`]) {
        counter = 0;
        break;
      }
      const cellCoin = board[`col${col + colCounter}`][row];
      colCounter++;
      if (cellCoin === color) {
        counter++
      } else {
        counter = 0;
      }
      if (counter === 4) {
        console.log('right-diagonal win');
        return true;
      }
    }
    colCounter = 0;
  }

  // scan for leftdiagonal win -> go up and left
  for (let col = 1; col < 8; col++) {
    counter = 0;
    colCounter = 0;
    for (let row = 0; row < 6; row++) {
      if ((col - colCounter) < 1) {
        counter = 0;
        break;
      }

      const cellCoin = board[`col${col - colCounter}`][row];
      colCounter++;
      if (cellCoin === 0) {
        counter = 0;
      }
      if (cellCoin === color) {
        counter++
      }
      if (counter === 4) {
        console.log('left-diagonal win');
        return true;
      }
    }
    colCounter = 0;
  }
  return false;
}

export default checkWinner;
