import React from 'react';

import Button from 'components/button/Button';
import * as styles from './NotFound.module.scss';

const NotFound = ({ history }) => {
  return (
    <div className={styles.NotFound}>
      <h1>Oops</h1>
      <p>Sorry, it looks like this page does not exist.</p>
      <Button
        style={{ marginTop: '20px' }}
        onClick={() => history.push('/')}
      >
        Go Home
      </Button>
    </div>
  )
}

export default NotFound;
