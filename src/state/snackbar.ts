import { atom } from 'recoil';
import {AlertColor} from "@mui/material";

export const snackbarSeverityState = atom<AlertColor>({
  key: 'snackbarSeverityState',
  default: 'warning', // 'error', 'info', 'success', 'warning'
});

export const openSnackbarState = atom({
  key: 'openSnackbarState',
  default: false,
});

export const snackbarMessageState = atom({
  key: 'snackbarMessageState',
  default: '',
});
