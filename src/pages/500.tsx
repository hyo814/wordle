import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import styles from "../styles/Error.module.css";

const ServerErrorPage: React.FC = () => {
  return (
    <Box
      className={styles.error_layer}
    >
      <Typography variant="h1" component="h1" gutterBottom>
        500 Internal Server Error
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        죄송합니다. 서버에 문제가 발생했습니다.
      </Typography>
      <Button variant="contained" color="primary" href="/">
        홈으로 돌아가기
      </Button>
    </Box>
  );
};

export default ServerErrorPage;
