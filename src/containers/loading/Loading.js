import React from 'react';

import * as styles from './Loading.module.scss';

const Loading = () => {
  return (
    <div className={styles.Loading}>
      <img src={'/omg-coin.png'} alt='coin'/>
    </div>
  )
}

export default Loading;
