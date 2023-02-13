import { Box, Container } from '@mui/material';
import type { MetaFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { APP_TITLE } from '~/lib/constants';

export const meta: MetaFunction = () => ({
  title: `${APP_TITLE} | Login`,
});

export default function AuthLayout() {
  return (
    <Box
      component="main"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexGrow: 1,
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="sm">
        <Outlet />
      </Container>
    </Box>
  );
}
