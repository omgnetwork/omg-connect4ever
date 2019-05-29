import React from 'react';
import { map } from 'lodash';

import * as styles from './Board.module.scss';

const Board = ({ data, onClick }) => {
  const renderCell = (type) => {
    switch(type) {
      case 'B':
          return <img className={styles.blue} src={'/omg-coin.png'} alt='blue-coin'/>;
      case 'R':
        return (
          <div className={styles.red}>
            <img src={'/omg-text.png'} alt='red-coin'/>
          </div>
        )
      default:
        return <div className={styles.empty} />;
    }

  }

  return (
    <div className={styles.Board}>
      {map(data, (rowData, columnKey) => {
        return (
          <div
            key={columnKey}
            className={styles.column}
            onClick={() => onClick(columnKey)}
          >
            {rowData.map((row, index) => {
              return (
                <div
                  key={index}
                  className={styles.cell}
                >
                  {renderCell(row)}
                </div>
              )
            })}
          </div>
        )
      })}

    </div>
  )
}

export default Board;
