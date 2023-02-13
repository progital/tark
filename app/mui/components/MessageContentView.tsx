import { Box, useTheme } from '@mui/material';
import * as React from 'react';

type MessageContentViewProps = React.PropsWithChildren<{ bgcolor?: string }>;

export const MessageContentView = ({
  children,
  bgcolor = 'transparent',
}: MessageContentViewProps) => {
  const theme = useTheme();

  return (
    <Box
      component="pre"
      tabIndex={0}
      sx={{
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        bgcolor,
        px: 2,
        py: 1,
        border: `1px solid ${theme.palette.neutral[200]}`,
        borderRadius: `${theme.shape.borderRadius}px`,
        overflowX: 'auto',
        height: '100%',
      }}
    >
      {children}
    </Box>
  );
};
