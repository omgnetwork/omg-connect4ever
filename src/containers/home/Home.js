import React from 'react';

import Button from 'components/button/Button';
import * as styles from './Home.module.scss';

const Home = ({ history }) => {
  return (
    <div className={styles.Home}>
      <h1>Connect4Ever</h1>
      <p>The first ever Connect 4 experience on the OMG-Network.</p>
      <p>*Note you must have MetaMask installed to play.</p>
      <Button
        style={{ marginTop: '20px' }}
        onClick={() => history.push('/game')}
      >
        New Game
      </Button>
    </div>
  )
}

export default Home;
