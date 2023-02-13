import { Menu as MenuIcon } from '@mui/icons-material/';
import type { PopoverProps } from '@mui/material';
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Avatar,
  Popover,
  MenuList,
  MenuItem,
} from '@mui/material';
import { Form, Link, useLocation } from '@remix-run/react';
import * as React from 'react';
import { MenuButton } from '~/mui/components/MenuButton';
import { useMobile } from '~/mui/hooks/useMobile';

type DashboardNavbarProps = {
  onSidebarOpen: () => void;
  action?: React.ReactNode;
  crumbs?: React.ReactNode;
  name?: string;
};

const AccountMenu = (props: PopoverProps) => {
  const { anchorEl, onClose, open, ...other } = props;

  if (!anchorEl) {
    return null;
  }

  return (
    <Popover
      disablePortal
      disableScrollLock
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom',
      }}
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: { width: '300px', mt: 1 },
      }}
      {...other}
    >
      <MenuList disablePadding>
        <MenuItem
          tabIndex={-1}
          divider
          disableGutters
          sx={{
            borderTopColor: 'divider',
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
          }}
        >
          <MenuButton component="span" role={undefined} tabIndex={-1}>
            <Link to="/profile">Profile</Link>
          </MenuButton>
        </MenuItem>
        <MenuItem disableGutters sx={{ form: { width: '100%' } }} tabIndex={-1}>
          <Form method="post" action="/logout">
            <MenuButton type="submit">Log out</MenuButton>
          </Form>
        </MenuItem>
      </MenuList>
    </Popover>
  );
};

export const DashboardNavbar = ({
  onSidebarOpen,
  action,
  crumbs,
  name,
}: DashboardNavbarProps) => {
  const [openMenu, setOpenMenu] = React.useState(false);
  const avatarRef = React.useRef(null);
  const showMobile = useMobile();

  const { pathname } = useLocation();
  React.useEffect(() => {
    setOpenMenu(false);
  }, [pathname]);

  return (
    <>
      <AppBar
        sx={(theme) => ({
          left: {
            lg: 280,
          },
          width: {
            lg: 'calc(100% - 280px)',
          },
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.shadows[3],
        })}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2,
          }}
        >
          <IconButton
            aria-label="activate sidebar"
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: 'inline-flex',
                lg: 'none',
              },
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          {showMobile ? crumbs : action}

          <Box sx={{ flexGrow: 1 }} />

          {!showMobile && (
            <>
              <Avatar
                role="button"
                tabIndex={0}
                onClick={() => setOpenMenu(true)}
                ref={avatarRef}
                sx={{
                  bgcolor: 'secondary.main',
                  cursor: 'pointer',
                  height: 40,
                  width: 40,
                  mx: 2,
                }}
              >
                {name?.slice(0, 1)?.toUpperCase() ?? 'N'}
              </Avatar>
              <AccountMenu
                anchorEl={avatarRef.current}
                open={openMenu}
                onClose={() => setOpenMenu(false)}
              />
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};
