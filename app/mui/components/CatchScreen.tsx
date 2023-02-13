import { Box, Container, Typography } from '@mui/material';
import * as React from 'react';
import { FixingBugs } from '~/mui/svg/FixingBugs';

type CatchScreenProps = React.PropsWithChildren<{
  componentTitle?: any;
  title: React.ReactNode;
}>;

export const CatchScreen = ({
  children,
  componentTitle = 'p',
  title,
}: CatchScreenProps) => (
  <Box
    sx={{
      alignItems: 'center',
      display: 'flex',
      flexGrow: 1,
      height: '100vh',
    }}
  >
    <Container maxWidth="md">
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          align="center"
          color="text.primary"
          variant="h3"
          component={componentTitle}
          sx={{ mb: 2 }}
        >
          {title}
        </Typography>
        <FixingBugs
          sx={{
            width: '200px',
            maxWidth: '100%',
            height: 'auto',
            mb: 3,
          }}
        />
        <Typography color="text.primary" variant="body1" component="div">
          {children}
        </Typography>
      </Box>
    </Container>
  </Box>
);
