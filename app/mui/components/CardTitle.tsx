import { Typography } from '@mui/material';
import * as React from 'react';

type CardTitleProps = React.PropsWithChildren<{
  component?: React.ElementType;
}>;

export const CardTitle = ({ children, component = 'h1' }: CardTitleProps) => {
  return (
    <Typography variant="h6" component={component} sx={{ display: 'inline' }}>
      {children}
    </Typography>
  );
};
