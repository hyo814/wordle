import React from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import {useRecoilState} from "recoil";
import {openSnackbarState, snackbarMessageState, snackbarSeverityState} from "../../state/snackbar";

const Index: React.FC = () => {
  const [severity] = useRecoilState(snackbarSeverityState)
  const [openSnackbar, setOpenSnackbar] = useRecoilState(openSnackbarState);
  const [snackbarMessage] = useRecoilState(snackbarMessageState);
  
  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };
  return (
    <>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Index;
