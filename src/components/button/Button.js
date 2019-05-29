import React from 'react';

import * as styles from './Button.module.scss';

const Button = ({ children, onClick, style }) => {
  return (
    <div
      onClick={onClick}
      className={styles.Button}
      style={style}
    >
      { children }
    </div>
  )
}

export default Button;
