import React from 'react';
import styles from '../../../styles/Key.module.css';
import {KeyProps} from "../../../types";

const Key: React.FC<KeyProps> = ({ value, onClick }) => {
	return (
		<button className={styles.key} onClick={() => onClick(value)}>
			{value}
		</button>
	);
};

export default Key;
