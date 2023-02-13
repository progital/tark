import { Box } from '@mui/material';
import * as React from 'react';

export const ListActions = ({ children }: React.PropsWithChildren) => {
  return (
    <Box
      component="span"
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        '& > *:not(:last-child)': {
          marginRight: 0.5,
        },
        a: {
          lineHeight: 1,
        },
        form: {
          display: 'inline',
        },
      }}
    >
      {children}
    </Box>
  );
};
