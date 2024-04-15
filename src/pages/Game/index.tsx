import React, {useEffect} from "react";
import Board from "../../components/Game/Board/Board";
import Keyboard from "../../components/Game/KeyBoard/KeyBoard";
import styles from "../../styles/Game.module.css";
import {useRouter} from "next/router";
import {dictionaryCheck} from "../api";
import CommonAlert from '../../components/Common/CommonAlert';
import {DecryptWithRetry} from "../../components/Common/DecryptWithRetry";
import {useRecoilState} from "recoil";
import {openSnackbarState, snackbarMessageState, snackbarSeverityState} from "../../state/snackbar";
import {isLoadedState} from "../../state";
import {boardDataState, currentGuessState, currentRowState, originalWordState, startTimeState} from "../../state/game";
import {initialBoardData} from "../../components/Common/WordleView";

const Game: React.FC = () => {
  const router = useRouter();
  const {word} = router.query;
  
  const [startTime, setStartTime] = useRecoilState(startTimeState);
  const [originalWord, setOriginalWord] = useRecoilState(originalWordState);
  const [boardData, setBoardData] = useRecoilState(boardDataState);
  const [currentGuess, setCurrentGuess] = useRecoilState(currentGuessState);
  const [currentRow, setCurrentRow] = useRecoilState(currentRowState);
  
  const [isLoaded, setIsLoaded] = useRecoilState(isLoadedState);
  
  const [, setSeverity] = useRecoilState(snackbarSeverityState);
  const [, setOpenSnackbar] = useRecoilState(openSnackbarState);
  const [, setSnackbarMessage] = useRecoilState(snackbarMessageState);
  
  const showMessage = (message: string) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };
  
  
  useEffect(() => {
    const fetchData = async () => {
      if (word) {
        try {
          const decryptedWord = await DecryptWithRetry(word as string);
          setOriginalWord(decryptedWord as string);
          setStartTime(new Date());
        } catch (error) {
          console.error("복호화 과정에서 최종적으로 오류 발생 확인 해주세요!:", error);
        }
      }
    };
    
    fetchData();
  }, [word, setOriginalWord, setStartTime]);
  
  const handleKeyPress = async (key: string) => {
    if (key === '←') {
      const newGuess = currentGuess.slice(0, -1);
      setCurrentGuess(newGuess);
      updateBoardData(newGuess);
      return;
    }
    
    if (key !== '↵' && currentGuess.length < 5) {
      const newGuess = currentGuess + key;
      setCurrentGuess(newGuess);
      updateBoardData(newGuess);
    } else if (key === '↵') {
      if (currentGuess.length === 5 && currentRow < 6) {
        const result = await dictionaryCheck(currentGuess);
        if (result.success) {
          evaluateGuess(currentGuess);
          setCurrentRow(currentRow + 1);
          setCurrentGuess('');
        } else {
          setSeverity("error")
          showMessage("단어를 찾을 수 없습니다.");
        }
      } else if (currentGuess.length !== 5) {
        setSeverity("error")
        showMessage("글자수가 5글자가 되어야 합니다.");
      }
    }
  };
  
  const evaluateGuess = (guess: string) => {
    const letterCount: { [key: string]: number } = {};
    for (const char of originalWord) {
      if (letterCount[char]) {
        letterCount[char] += 1;
      } else {
        letterCount[char] = 1;
      }
    }
    
    const evaluation = guess.split('').map((char, index) => {
      if (char === originalWord[index]) {
        letterCount[char] -= 1;
        return 'correct';
      } else if (originalWord.includes(char) && letterCount[char] > 0) {
        letterCount[char] -= 1;
        return 'present';
      } else {
        return 'absent';
      }
    });
    
    updateBoardDataWithEvaluation(guess, evaluation);
    
    const allCorrect = evaluation.every(status => status === 'correct');
    
    if (allCorrect || currentRow === 5) {
      const endTime = new Date();
      const playTime = startTime ? (endTime.getTime() - startTime.getTime()) / 1000 : 0;
      
      const totalWins = parseInt(localStorage.getItem('totalWins') || '0') + (allCorrect ? 1 : 0);
      const totalGames = parseInt(localStorage.getItem('totalGames') || '0') + 1;
      const winRate = (totalWins / totalGames * 100).toFixed(2);
      
      const triesStat = JSON.parse(localStorage.getItem('triesStat') || '{}');
      const currentTries = currentRow + 1;
      triesStat[currentTries] = (triesStat[currentTries] || 0) + 1;
      
      localStorage.setItem('totalWins', totalWins.toString());
      localStorage.setItem('totalGames', totalGames.toString());
      localStorage.setItem('winRate', winRate);
      localStorage.setItem('triesStat', JSON.stringify(triesStat));
      localStorage.setItem('lastPlayTime', playTime.toString());
      
      setTimeout(() => {
        const message = allCorrect ? `축하합니다! 정답은 "${originalWord}" 입니다.` : `모든 시도가 끝났습니다. 정답은 "${originalWord}" 입니다.`;
        setSeverity(allCorrect? "success" : "info");
        showMessage(message);
        setIsLoaded(false);
        
        router.push("/Complete").then(() => {
          setBoardData(initialBoardData);
          setCurrentGuess('');
          setCurrentRow(0);
          localStorage.removeItem('boardData');
          localStorage.removeItem('currentGuess');
          localStorage.removeItem('currentRow');
        });
      }, 500)
    } else {
      if (currentRow < 5) {
        setCurrentRow(currentRow + 1);
      }
    }
  };
  
  const updateBoardDataWithEvaluation = (guess: string, evaluation: string[]) => {
    setBoardData((prevBoardData) => {
      const newBoardData = [...prevBoardData];
      const newRowData = newBoardData[currentRow].map((cell, index) => ({
        value: guess[index],
        status: evaluation[index]
      }));
      
      newBoardData[currentRow] = newRowData;
      return newBoardData;
    });
  };
  
  const updateBoardData = (newGuess: string) => {
    if (currentRow < 6) {
      setBoardData((prevBoardData) => {
        const newBoardData = [...prevBoardData];
        const newRowData = newBoardData[currentRow] ? [...newBoardData[currentRow]] : Array(5).fill({
          value: '',
          status: 'none'
        });
        
        newGuess.split('').forEach((char: string, index: number) => {
          newRowData[index] = {value: char, status: 'none'};
        });
        
        for (let i = newGuess.length; i < 5; i++) {
          newRowData[i] = {value: '', status: 'none'};
        }
        
        newBoardData[currentRow] = newRowData;
        return newBoardData;
      });
    }
  };
  
  useEffect(() => {
    const savedBoardData = localStorage.getItem('boardData');
    const savedCurrentGuess = localStorage.getItem('currentGuess');
    const savedCurrentRow = localStorage.getItem('currentRow');
    
    if (savedBoardData) {
      setBoardData(JSON.parse(savedBoardData));
    }
    if (savedCurrentGuess) {
      setCurrentGuess(savedCurrentGuess);
    }
    if (savedCurrentRow) {
      setCurrentRow(parseInt(savedCurrentRow, 10));
    }
    setIsLoaded(true);
  }, []);
  
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('boardData', JSON.stringify(boardData));
      localStorage.setItem('currentGuess', currentGuess);
      localStorage.setItem('currentRow', currentRow.toString());
    }
  }, [boardData, currentGuess, currentRow, isLoaded]);
  
  return (
    <div className={styles.game_container}>
      <CommonAlert/>
      <h1 className={styles.title}>Wordle</h1>
      <Board boardData={boardData}/>
      <Keyboard onKeyPress={handleKeyPress}/>
    </div>
  );
};

export default Game;
