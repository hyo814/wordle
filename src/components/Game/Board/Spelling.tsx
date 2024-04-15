import styles from '../../../styles/Spelling.module.css';
import React from "react";
import {TitleProps} from "../../../types";

const Spelling: React.FC<TitleProps> = ({ value, status }) => {
	const titleStatus = styles[status];
	return <div className={`${styles.title} ${titleStatus}`}>{value}</div>;
};

export default Spelling;
