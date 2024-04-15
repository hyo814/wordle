import React from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Index.module.css';
import CryptoJS from 'crypto-js';
import {dictionaryCheck} from "../api";
import {useRecoilState} from "recoil";
import {userInputState} from "../../state/answer";
import {openSnackbarState, snackbarMessageState} from "../../state/snackbar";
import CommonAlert from "../../components/Common/CommonAlert";
import Board from "../../components/Game/Board/Board";
import {initialBoardData} from "../../components/Common/WordleView";

const Answer: React.FC = () => {
  const router = useRouter();
  const secretKey = "secret_key";
  const [userInput, setUserInput] = useRecoilState(userInputState);
  const [, setOpenSnackbar] = useRecoilState(openSnackbarState);
  const [, setSnackbarMessage] = useRecoilState(snackbarMessageState);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-Z]*$/.test(value) && value.length <= 5) {
      setUserInput(value);
    }
    else if (value.length > 5) {
      setSnackbarMessage("단어는 5글자를 초과할 수 없습니다.");
      setOpenSnackbar(true);
    }
    else {
      setSnackbarMessage("영어 입력 이외에 허용 되지 않습니다.");
      setOpenSnackbar(true);
    }
  };
  
  const handleStart = async () => {
    const result = await dictionaryCheck(userInput);
    
    if (result.success) {
      const upperCaseInput = userInput.toUpperCase();
      const encryptedWord = CryptoJS.AES.encrypt(upperCaseInput, secretKey).toString();
      setOpenSnackbar(false);
      setSnackbarMessage('');
      await router.push({
        pathname: '/Game',
        query: { word: encryptedWord },
      });
    } else {
      setSnackbarMessage("단어가 아닙니다. 다시 단어를 적어주세요.");
      setOpenSnackbar(true);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && userInput.length === 5) {
      handleStart();
    }
  };
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Wordle 생성하기</h1>
      <Board boardData={initialBoardData} />
      <input
        className={styles.inputField}
        type="text"
        value={userInput}
        onKeyUp={handleKeyPress}
        onChange={handleInputChange}
      ></input>
      <button
        className={styles.button}
        onClick={handleStart}
        disabled={userInput.length !== 5}
      >
        시작하기
      </button>
      <CommonAlert/>
    </div>
  );
};

export default Answer;
