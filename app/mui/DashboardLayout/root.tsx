import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLocation } from '@remix-run/react';
import * as React from 'react';
import { DashboardNavbar } from './navbar';
import { DashboardSidebar } from './sidebar';
import { RootAriaHiddenMuiBugFix } from '~/mui/components/MuiBugFix';
import { useMobileLg } from '~/mui/hooks/useMobile';

type DashboardLayoutProps = React.PropsWithChildren<{
  action?: React.ReactNode;
  crumbs?: React.ReactNode;
  name?: string;
}>;

const DashboardLayoutRoot = styled('main')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 64,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 280,
  },
  height: '100vh',
  overflow: 'hidden',
}));

export const DashboardLayout = ({
  children,
  action,
  crumbs,
  name,
}: DashboardLayoutProps) => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const { pathname } = useLocation();
  // TODO
  // aria-hidden body fix is only needed on large screens
  const lgUp = !useMobileLg();

  React.useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <>
      {lgUp ? <RootAriaHiddenMuiBugFix /> : null}
      <DashboardNavbar
        onSidebarOpen={() => setSidebarOpen(true)}
        action={action}
        crumbs={crumbs}
        name={name}
      />
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%',
            overflowX: 'auto',
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      <DashboardSidebar
        onClose={() => setSidebarOpen(false)}
        open={isSidebarOpen}
      />
    </>
  );
};
