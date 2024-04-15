import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styles from '../styles/Index.module.css';
import CryptoJS from 'crypto-js';
import Board from "../components/Game/Board/Board";

const Index: React.FC = () => {
	const router = useRouter();
	const word = "WORLD";
	const secretKey = "secret_key";
	const encryptedWord = CryptoJS.AES.encrypt(word, secretKey).toString();
	
	const initialBoardData = Array(6).fill(null).map(() => Array(5).fill({ value: '', status: 'none' }));
	const [boardData] = useState(initialBoardData);
	
	const handleRoute = (pathname:string, query = {}) => {
		router.push({
			pathname,
			query,
		});
	};
	
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Wordle</h1>
			<Board boardData={boardData} />
			<button className={styles.button} onClick={() => handleRoute('/Game', { word: encryptedWord })}>시작하기</button>
			<button className={styles.button} onClick={() => handleRoute('/Answer')}>워들 생성하기</button>
		</div>
	);
};

export default Index;
