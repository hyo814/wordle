import { atom } from 'recoil';
import { initialBoardData } from "../components/Common/WordleView";

export const startTimeState = atom<Date | null>({
  key: 'startTimeState',
  default: null,
});

export const originalWordState = atom<string>({
  key: 'originalWordState',
  default: '',
});

export const boardDataState = atom({
  key: 'boardDataState',
  default: initialBoardData,
});

export const currentGuessState = atom<string>({
  key: 'currentGuessState',
  default: '',
});

export const currentRowState = atom<number>({
  key: 'currentRowState',
  default: 0,
});
