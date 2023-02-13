import { Button, Stack, TextField } from '@mui/material';
import { Form, useNavigation } from '@remix-run/react';
import { CardTitle } from '~/mui/components/CardTitle';
import { ErrorMessage } from '~/mui/components/ErrorMessage';
import { BasicCard } from '~/mui/DashboardLayout';

type UserProfileProps = {
  user: {
    userId: string;
    userName: string;
    userEmail: string;
  };
  error?: string;
};

export const UserProfile = ({ user, error }: UserProfileProps) => {
  const navigation = useNavigation();
  const isIdle = navigation.state === 'idle';
  const isSubmitting = navigation.state === 'submitting';

  return (
    <BasicCard headerProps={{ title: <CardTitle>User Profile</CardTitle> }}>
      <Form method="post">
        <Stack spacing={3}>
          <input type="hidden" name="userId" value={user.userId} />
          <TextField label="E-mail" value={user.userEmail} disabled />
          <TextField
            label="Name"
            name="userName"
            required
            defaultValue={user.userName}
          />
          {isIdle && error ? <ErrorMessage>{error}</ErrorMessage> : null}
          <Button
            type="submit"
            disabled={isSubmitting}
            sx={{ alignSelf: 'flex-start' }}
          >
            {isSubmitting ? 'Updating' : 'Update'}
          </Button>
        </Stack>
      </Form>
    </BasicCard>
  );
};
