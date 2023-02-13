import { ArrowBack } from '@mui/icons-material';
import { Box, Container, Typography } from '@mui/material';
import { ROUTES } from '~/lib/constants';
import { ContainedButtonLink } from '~/mui/components/LinkStyled';
import { Donuts } from '~/mui/svg/Donuts';

export const NotFound = () => (
  <Box
    component="main"
    sx={{
      alignItems: 'center',
      display: 'flex',
      flexGrow: 1,
      minHeight: '100vh',
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
          color="textPrimary"
          variant="h3"
          component="h1"
        >
          404 Error: Looks like you've hit a dead end
        </Typography>
        <Typography
          align="center"
          color="textPrimary"
          variant="subtitle2"
          component="p"
        >
          Page not found? No problem. Have a donut and relax.
        </Typography>
        <Box sx={{ textAlign: 'center' }}>
          <Donuts
            sx={{
              mt: 6,
              display: 'inline-block',
              maxWidth: '100%',
              height: 'auto',
              width: '560px',
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
