import React from 'react';
import Key from './Key';
import styles from '../../../styles/KeyBoard.module.css';
import {KeyboardProps} from "../../../types";

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress }) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['↵', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '←']
  ];
  
  return (
    <div className={styles.keyboardContainer}>
      {rows.map((row, index) => (
        <div key={index} className={styles.keyboard}>
          {row.map((key) => (
            <Key key={key} value={key} onClick={onKeyPress}/>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
