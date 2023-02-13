import { alpha } from '@mui/material';
import type { Theme } from '@mui/material/styles';

export const sidebarButtonStyle = ({ active }: { active?: boolean }) =>
  ({
    ...(active && {
      backgroundColor: 'rgba(255,255,255, 0.08)',
    }),
    borderRadius: 1,
    color: active ? 'secondary.light' : 'neutral.300',
    // fontWeight: 700,
    justifyContent: 'flex-start',
    px: 3,
    textAlign: 'left',
    textTransform: 'none',
    width: '100%',
    '& .MuiButton-startIcon': {
      color: active ? 'secondary.light' : 'neutral.400',
    },
    '&:hover': {
      backgroundColor: 'rgba(255,255,255, 0.08)',
    },
  } as const);

export const iconButtonStyle = ({ theme }: { theme: Theme }) =>
  ({
    display: 'flex',
    borderRadius: '50%',
    p: 1,
    alignItems: 'center',
    justifyContent: 'center',
    '&:focus-visible, &:focus, &.Mui-focusVisible': {
      outline: 'none',
      boxShadow: '0px 0px 7px 2px rgba(0,0,0,0.4)',
    },
    '&:hover': {
      backgroundColor: alpha(theme.palette.secondary.light, 0.1),
    },
  } as const);
