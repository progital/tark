import { Logout as LogoutIcon } from '@mui/icons-material';
import type { DrawerProps } from '@mui/material';
import { Box, Drawer, List } from '@mui/material';
import { Form, useLocation } from '@remix-run/react';
import { NavItem } from './nav-item';
import { SidebarButton } from './sidebar-button';
import { SIDEBAR_ITEMS, SIDEBAR_MOBILE_ITEMS } from '~/lib/constants';
import { useIsAdmin } from '~/lib/hooks';
import { useMobile, useMobileLg } from '~/mui/hooks/useMobile';
import { Logo } from '~/mui/svg/Logo';

type DashboardSidebarProps = {
  open: boolean;
  onClose: DrawerProps['onClose'];
};

export const DashboardSidebar = ({ open, onClose }: DashboardSidebarProps) => {
  const lgUp = !useMobileLg();
  const location = useLocation();
  const isMobile = useMobile();
  const isAdmin = useIsAdmin();

  const content = (
    <Box
      role="navigation"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div>
        <Box sx={{ p: 3 }}>
          <Logo
            sx={{
              width: '120px',
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        </Box>
      </div>

      <List sx={{ flexGrow: 1 }}>
        {SIDEBAR_ITEMS.map((item) => {
          if (item.adminOnly && !isAdmin) {
            return null;
          }

          return (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={item.href}
              title={item.title}
              active={item.href === location.pathname}
            />
          );
        })}
        {isMobile
          ? SIDEBAR_MOBILE_ITEMS.map((item) => {
              if (item.adminOnly && !isAdmin) {
                return null;
              }

              return (
                <NavItem
                  key={item.title}
                  icon={item.icon}
                  href={item.href}
                  title={item.title}
                  active={item.href === location.pathname}
                />
              );
            })
          : null}
        {isMobile ? (
          <NavItem>
            <Form method="post" action="/logout">
              <SidebarButton
                startIcon={<LogoutIcon fontSize="small" />}
                type="submit"
              >
                Log out
              </SidebarButton>
            </Form>
          </NavItem>
        ) : null}
      </List>
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: '280px',
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: '280px',
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};
