import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useNavigate } from '@remix-run/react';
import { CardTitle } from '~/mui/components/CardTitle';
import { OutlinedButtonLink } from '~/mui/components/LinkStyled';

type BackActionProps =
  | { to: string; label: string }
  | { button: true; label: string };

function isButtonProps(props: any): props is { button: true; label: string } {
  return props?.button;
}

export const BackAction = (props: BackActionProps) => {
  const navigate = useNavigate();

  if (isButtonProps(props)) {
    const { label } = props;
    return (
      <>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon fontSize="small" />}
          sx={{ mr: 3 }}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <CardTitle>{label}</CardTitle>
      </>
    );
  }

  const { to, label } = props;
  return (
    <>
      <OutlinedButtonLink
        to={to}
        startIcon={<ArrowBackIcon fontSize="small" />}
        sx={{ mr: 3 }}
      >
        Back
      </OutlinedButtonLink>
      <CardTitle>{label}</CardTitle>
    </>
  );
};
