import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Button, Box } from '@mui/material';
import { useNavigate } from '@remix-run/react';
import { CardTitle } from '~/mui/components/CardTitle';
import { OutlinedButtonLink } from '~/mui/components/LinkStyled';

type BackActionProps =
  | { to: string; label: string }
  | { button: true; label: string };

function isButtonProps(props: any): props is { button: true; label: string } {
  return props?.button;
}

const ActionWrapper = ({ children }: React.PropsWithChildren) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {children}
    </Box>
  );
};

export const BackAction = (props: BackActionProps) => {
  const navigate = useNavigate();

  if (isButtonProps(props)) {
    const { label } = props;
    return (
      <ActionWrapper>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon fontSize="small" />}
          sx={{ mr: 3 }}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <CardTitle>{label}</CardTitle>
      </ActionWrapper>
    );
  }

  const { to, label } = props;
  return (
    <ActionWrapper>
      <OutlinedButtonLink
        to={to}
        startIcon={<ArrowBackIcon fontSize="small" />}
        sx={{ mr: 3 }}
      >
        Back
      </OutlinedButtonLink>
      <CardTitle>{label}</CardTitle>
    </ActionWrapper>
  );
};
