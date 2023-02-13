import type { ButtonProps } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { Button } from '@mui/material';

export const LoadingButton = (props: ButtonProps & { loading?: boolean }) => {
  const { loading, ...rest } = props;
  return loading ? (
    <Button
      {...rest}
      startIcon={
        <CircularProgress size="18px" sx={{ color: 'action.disabled' }} />
      }
      disabled
    />
  ) : (
    <Button {...rest} />
  );
};
