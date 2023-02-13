import type { ButtonProps } from '@mui/material';
import { Button } from '@mui/material';

type MenuButtonProps = ButtonProps & {
  component?: React.ElementType;
};

export const MenuButton = ({ children, ...props }: MenuButtonProps) => {
  return (
    <Button
      {...props}
      variant="text"
      sx={{
        borderRadius: 1,
        justifyContent: 'flex-start',
        px: 3,
        textAlign: 'left',
        textTransform: 'none',
        width: '100%',
        '&, .MuiButton-startIcon, a': {
          color: 'text.primary',
        },
        '&:hover': {
          backgroundColor: 'transparent',
        },
        '& > *': {
          width: '100%',
        },
      }}
    >
      {children}
    </Button>
  );
};
