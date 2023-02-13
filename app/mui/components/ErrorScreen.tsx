import { ArrowBack } from '@mui/icons-material';
import { Box, Container, Typography } from '@mui/material';
import * as React from 'react';
import { ROUTES } from '~/lib/constants';
import { ContainedButtonLink } from '~/mui/components/LinkStyled';
import { Letter } from '~/mui/svg/Letter';

type ErrorScreenProps = React.PropsWithChildren<{
  ImageComponent?: React.ElementType;
  component?: React.ElementType;
}>;

export const ErrorScreen = ({
  children,
  ImageComponent = Letter,
  component = 'p',
}: ErrorScreenProps) => (
  <Box
    sx={{
      alignItems: 'center',
      display: 'flex',
      flexGrow: 1,
      minHeight: '100%',
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
          component={component}
          sx={{ mb: 2 }}
        >
          {children}
        </Typography>
        <Box sx={{ textAlign: 'center' }}>
          <ImageComponent
            sx={{
              width: '200px',
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        </Box>
        <ContainedButtonLink
          to={ROUTES.dashboard}
          startIcon={<ArrowBack fontSize="small" />}
          sx={{ mt: 3 }}
        >
          Go back to dashboard
        </ContainedButtonLink>
      </Box>
    </Container>
  </Box>
);
