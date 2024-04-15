import { atom } from 'recoil';

export const playTimeState = atom({
  key: 'playTime',
  default: '',
});

export const totalWinsState = atom({
  key: 'totalWins',
  default: 0,
});

export const winRateState = atom({
  key: 'winRate',
  default: 0,
});

export const triesStatState = atom({
  key: 'triesStat',
  default: {},
});

export const totalGamesState = atom({
  key: 'totalGames',
  default: 0,
});
