# OMG-Connect4Ever
Connect 4 demo 🔴🔵🔴🔵

http://connect4ever.surge.sh/

## How to play
- Make sure you have installed the MetaMask extension with funds on Rinkeby
- Deposit some ETH onto Plasma using the `Deposit` button (confirm the transaction through MetaMask)
- Once you have a Plasma balance, go ahead and create a `New Game`
- Click the column where you want to place your move (confirm the transaction through MetaMask)
- Copy the page url and send it to a friend
- Take turns trying to connect 4 of the same color, horizontally, vertically, or diagonally!

## How it works
- When creating a new game, a `game address` is created
- Each move is a transaction to this address with the coordinates of the move encoded in the metadata of the transaction (this is why you have to sign and pay for each transaction with MetaMask)
- The game will then short-poll the transactions made to this address, decode the metadata, and build the state of the board from the coordinates
- After the state of the board is built, we check if someone won, if not whose turn it is.
- Each game is limited to 2 players
- *Only frontend logic

## To run locally
- `$ yarn start` check on localhost:3000

## To deploy (using surge.sh)
- `$ yarn build`
- go into build folder and change `index.html` to `200.html` (for surge routing)
- run `surge` inside build folder