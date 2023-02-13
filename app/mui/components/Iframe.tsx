import { styled } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import * as React from 'react';

interface IframeProps extends React.ComponentPropsWithoutRef<'iframe'> {
  title: string;
}

const StyledIframe = styled('iframe')(({ theme }: { theme: Theme }) => ({
  width: '100%',
  minHeight: '100%',
  border: `1px solid ${theme.palette.neutral[200]}`,
  borderRadius: theme.shape.borderRadius,
  paddingLeft: '8px',
}));

export const Iframe = (props: IframeProps) => {
  const { title, ...rest } = props;

  return <StyledIframe title={title} {...rest} sandbox="allow-same-origin" />;
};
