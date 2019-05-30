import React from 'react';

import Button from 'components/button/Button';
import * as styles from './NoMetaMask.module.scss';

const NoMetaMask = ({ history }) => {
  return (
    <div className={styles.NoMetaMask}>
      <h1>Sorry</h1>
      <p>It looks like you don't have MetaMask installed.</p>

      <a
        href='https://metamask.io/'
        target='_blank'
        rel='noopener noreferrer'
        style={{ textDecoration: 'none' }}
      >
        <Button
          style={{ marginTop: '20px' }}
        >
          Install MetaMask
        </Button>
      </a>
    </div>
  )
}

export default NoMetaMask;
