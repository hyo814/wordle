import React, { useEffect } from "react";
import styles from "../../styles/Index.module.css";
import { useRecoilState } from "recoil";
import {playTimeState, totalGamesState, totalWinsState, triesStatState, winRateState} from "../../state/complete";
import {useRouter} from "next/router";
import {openSnackbarState, snackbarMessageState, snackbarSeverityState} from "../../state/snackbar";
import CommonAlert from "../../components/Common/CommonAlert";

const Complete: React.FC = () => {
  const router = useRouter();
  
  const [, setSeverity] = useRecoilState(snackbarSeverityState);
  const [, setOpenSnackbar] = useRecoilState(openSnackbarState);
  const [, setSnackbarMessage] = useRecoilState(snackbarMessageState);
  
  const showMessage = (message:string) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };
  
  useEffect(() => {
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    
    window.addEventListener('beforeunload', handleWindowClose);
    
    const handleBackButton = () => {
      alert("초기 화면으로 넘어갑니다.")
      setPlayTime('0초');
      router.push('/');
    };
    
    router.beforePopState(() => {
      handleBackButton();
      return false;
    });
    
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      router.beforePopState(() => true);
    };
  }, [router]);
  
  const [playTime, setPlayTime] = useRecoilState(playTimeState);
  const [totalWins, setTotalWins] = useRecoilState(totalWinsState);
  const [winRate, setWinRate] = useRecoilState(winRateState);
  const [triesStat, setTriesStat] = useRecoilState(triesStatState);
  const [totalGames, setTotalGames] = useRecoilState(totalGamesState);
  
  useEffect(() => {
    const loadedPlayTime = localStorage.getItem('lastPlayTime');
    const loadedTotalWins = parseInt(localStorage.getItem('totalWins') || '0', 10);
    const loadedTotalGames = parseInt(localStorage.getItem('totalGames') || '0', 10);
    const loadedWinRate = parseFloat(localStorage.getItem('winRate') || '0');
    const loadedTriesStat = JSON.parse(localStorage.getItem('triesStat') || '{}');
    
    if (!loadedPlayTime || loadedTotalGames === 0 || isNaN(loadedTotalWins) || isNaN(loadedWinRate) || Object.keys(loadedTriesStat).length === 0) {
      setSeverity("warning")
      showMessage("플레이 정보가 없어 초기 화면으로 넘어갑니다.");
      setPlayTime('0초');
      router.push('/');
      return;
    }
    
    setPlayTime(loadedPlayTime ? `${loadedPlayTime}초` : '데이터 없음');
    setTotalWins(loadedTotalWins);
    setTotalGames(loadedTotalGames);
    setWinRate(loadedWinRate);
    setTriesStat(loadedTriesStat);
  }, []);
  
  const triesStatStr = Object.entries(triesStat).map(([key, value]) => `${key}회 시도: ${value}번`).join(', ');
	
	return (
    <div className={styles.container}>
      <CommonAlert/>
      <h1 className={styles.title}>Wordle 게임 결과</h1>
      <br/>
      <div className={styles.info}>이번 게임 플레이시간: {playTime}</div>
      <div className={styles.info}>현재까지 워들을 승리한 횟수: {totalWins}회</div>
      <div className={styles.info}>현재까지의 워들 승률: {winRate}%</div>
      <div className={styles.info}>현재까지 워들 시도한 횟수의 통계: {triesStatStr || '데이터 없음'}</div>
      <div className={styles.info}>총 게임 횟수: {totalGames}회</div>
      <button className={styles.info} onClick={() => {
        setPlayTime('0초');
        setOpenSnackbar(false);
        setSnackbarMessage('');
        router.push("/");
      }}>게임 재시작하기
      </button>
    </div>
  );
};

export default Complete;
