import React from 'react';

import * as styles from './Button.module.scss';

const Button = ({
  children,
  onClick,
  style,
  disabled
}) => {
  return (
    <div
      onClick={onClick}
      className={[
        styles.Button,
        disabled ? styles.disabled : ''
      ].join(' ')}
      style={style}
    >
      { children }
    </div>
  )
}

export default Button;
