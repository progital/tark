import { Button, Stack, TextField } from '@mui/material';
import { Form, useNavigation } from '@remix-run/react';
import { APP_NAME_EMAIL } from '~/lib/constants';
import { useHost } from '~/lib/hooks';
import { DEFAULT_INVITE } from '~/lib/templates';
import { CardTitle } from '~/mui/components/CardTitle';
import { ErrorMessage } from '~/mui/components/ErrorMessage';
import { BasicCard } from '~/mui/DashboardLayout';

type InviteUserProps = {
  user: {
    userId: string;
    userName: string;
    userEmail: string;
  };
  error?: string;
};

export const InviteUserView = ({ user, error }: InviteUserProps) => {
  const navigation = useNavigation();
  const isIdle = navigation.state === 'idle';
  const isSubmitting = navigation.state === 'submitting';
  const host = useHost();

  return (
    <BasicCard headerProps={{ title: <CardTitle>Invite user</CardTitle> }}>
      <Form method="post">
        <Stack spacing={3}>
          <TextField label="Send to" name="to" required />
          <TextField
            label="Email subject"
            name="subject"
            required
            defaultValue={DEFAULT_INVITE.subject({
              appName: APP_NAME_EMAIL,
            })}
          />
          <TextField
            minRows={3}
            multiline
            name="text"
            label="Email text"
            required
            defaultValue={DEFAULT_INVITE.text({
              host: host.origin || '',
              author: user.userName,
            })}
          />
          <TextField
            minRows={3}
            multiline
            name="html"
            label="Email html"
            required
            defaultValue={DEFAULT_INVITE.html({
              host: host.origin || '',
              author: user.userName,
            })}
          />
          {isIdle && error ? <ErrorMessage>{error}</ErrorMessage> : null}
          <Button
            type="submit"
            disabled={isSubmitting}
            sx={{ alignSelf: 'flex-start' }}
          >
            {isSubmitting ? 'Sending' : 'Send'}
          </Button>
        </Stack>
      </Form>
    </BasicCard>
  );
};
