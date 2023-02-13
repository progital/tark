import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';

export const useMobile = () => {
  return !useMediaQuery((theme: Theme) => theme.breakpoints.up('md'), {
    defaultMatches: true,
    noSsr: false,
  });
};

export const useMobileLg = () => {
  return !useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false,
  });
};
