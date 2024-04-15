import React from "react";
import Spelling from "./Spelling";
import styles from "../../../styles/Board.module.css";
import {BoardProps} from "../../../types";

const Board: React.FC<BoardProps> = ({boardData}) => {
	return (
		<div className={styles.container}>
			{boardData.map((row, rowIndex) => (
				<div className={styles.board} key={rowIndex}>
					{row.map((title, titleIndex) => (
						<Spelling key={titleIndex} value={title.value} status={title.status}/>
					))}
				</div>
			))}
		</div>
	);
};

export default Board;
