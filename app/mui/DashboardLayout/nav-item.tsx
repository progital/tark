import { ListItem } from '@mui/material';
import * as React from 'react';
import { SidebarLink } from '~/mui/components/LinkStyled';

type NavItemProps =
  | {
      href: string;
      title: string;
      icon: JSX.Element;
      active?: boolean;
    }
  | { children: React.ReactNode };

const hasChildren = (props: any): props is { children: React.ReactNode } => {
  return props?.children;
};

export const NavItem = (props: NavItemProps) => {
  let content;
  if (hasChildren(props)) {
    content = props.children;
  }
  if (!hasChildren(props)) {
    const { href, icon, title, active = false } = props;
    content = (
      <>
        <SidebarLink to={href} active={active}>
          {icon ? icon : null}
          {title}
        </SidebarLink>
      </>
    );
  }

  return (
    <ListItem
      disableGutters
      sx={{
        display: 'flex',
        mb: 0.5,
        py: 0,
        px: 2,
        a: {
          flexGrow: 1,
        },
      }}
    >
      {content}
    </ListItem>
  );
};
