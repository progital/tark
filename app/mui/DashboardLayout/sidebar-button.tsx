import type { ButtonProps } from '@mui/material';
import { Box, Button } from '@mui/material';
import { sidebarButtonStyle } from '~/mui/styles';

type SidebarButtonProps = ButtonProps & {
  active?: boolean;
  component?: React.ElementType;
};

export const SidebarButton = ({
  children,
  active,
  ...props
}: SidebarButtonProps) => {
  return (
    <Button
      {...props}
      disableRipple
      variant="text"
      sx={sidebarButtonStyle({ active })}
    >
      <Box component="span" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
    </Button>
  );
};
