import type { ButtonProps } from '@mui/material';
import { Button, styled, useTheme, alpha } from '@mui/material';
import { Link as RemixLink } from '@remix-run/react';
import deepmerge from 'deepmerge';
import * as React from 'react';
import { iconButtonStyle, sidebarButtonStyle } from '~/mui/styles';

const LinkStyled = styled(RemixLink)``;

type LinkProps = React.ComponentProps<typeof LinkStyled> & { bold?: boolean };
type SidebarLinkProps = React.ComponentProps<typeof LinkStyled> & {
  active: boolean;
};
type OutlinedButtonLinkProps = React.ComponentProps<typeof LinkStyled> &
  Pick<ButtonProps, 'startIcon'>;
type ContainedButtonLinkProps = OutlinedButtonLinkProps;
type IconLinkProps = React.ComponentProps<typeof LinkStyled>;

export const Link = ({ bold, sx = {}, ...props }: LinkProps) => {
  let styles = sx;
  if (bold) {
    styles = { ...styles, fontWeight: 600 };
  }

  return <LinkStyled {...props} sx={styles} />;
};

export const SidebarLink = ({
  active,
  sx = {},
  ...props
}: SidebarLinkProps) => {
  const theme = useTheme();
  const styles = deepmerge(
    sidebarButtonStyle({ active }),
    {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      px: 2,
      py: 1.2,
      '.MuiSvgIcon-root': {
        mr: 1,
      },
      '&:focus-visible, &:focus': {
        outline: 'none',
        textDecoration: 'none',
      },
      '&:focus-visible': {
        outline: `${theme.palette.primary.contrastText} auto 1px`,
      },
    },
    sx as {}
  );

  return <LinkStyled {...props} sx={styles} />;
};

export const OutlinedButtonLink = ({
  startIcon,
  sx = {},
  children,
  ...props
}: OutlinedButtonLinkProps) => {
  const theme = useTheme();
  const styles = deepmerge(
    {
      '&:focus-visible, &:focus': {
        outline: 'none',
        textDecoration: 'none',
        // all our buttons have primary color
        '.MuiButton-outlined': {
          bgcolor: alpha(
            theme.palette.text.primary,
            theme.palette.action.hoverOpacity
          ),
        },
      },
    },
    sx as {}
  );

  return (
    <LinkStyled {...props} sx={styles}>
      <Button
        variant="outlined"
        startIcon={startIcon}
        component="span"
        tabIndex={-1}
        role={undefined}
      >
        {children}
      </Button>
    </LinkStyled>
  );
};

export const ContainedButtonLink = ({
  startIcon,
  sx = {},
  children,
  ...props
}: ContainedButtonLinkProps) => {
  const styles = deepmerge(
    {
      '&:focus-visible, &:focus': {
        outline: 'none',
        textDecoration: 'none',
        // all our buttons have primary color
        '.MuiButton-contained': {
          bgcolor: 'primary.dark',
        },
      },
    },
    sx as {}
  );

  return (
    <LinkStyled {...props} sx={styles}>
      <Button
        variant="contained"
        startIcon={startIcon}
        component="span"
        tabIndex={-1}
        role={undefined}
      >
        {children}
      </Button>
    </LinkStyled>
  );
};

export const IconButtonLink = ({
  sx = {},
  children,
  ...props
}: IconLinkProps) => {
  const theme = useTheme();
  const styles = deepmerge(iconButtonStyle({ theme }), sx as {});

  return (
    <LinkStyled {...props} sx={styles}>
      {children}
    </LinkStyled>
  );
};
