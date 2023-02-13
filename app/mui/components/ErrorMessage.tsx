import { Typography } from '@mui/material';
import * as React from 'react';

export const ErrorMessage = ({ children }: React.PropsWithChildren) => {
  return (
    <Typography
      sx={{ color: 'error.main', fontWeight: 'bold' }}
      component="div"
    >
      {children}
    </Typography>
  );
};
