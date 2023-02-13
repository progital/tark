import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { useFetcher } from '@remix-run/react';
import * as React from 'react';
import { CardTitle } from '~/mui/components/CardTitle';
import { ErrorMessage } from '~/mui/components/ErrorMessage';
import { LoadingButton } from '~/mui/components/LoadingButton';
import { BasicCard } from '~/mui/DashboardLayout';
import type { MailboxesLoaderType } from '~/types/loader';

type MailboxesProps = {
  mailboxes: MailboxesLoaderType;
  email: string;
  error?: string;
};

export const TestMailView = ({ mailboxes, email, error }: MailboxesProps) => {
  const selectMailboxId = React.useId();
  const fetcher = useFetcher();

  return (
    <BasicCard headerProps={{ title: <CardTitle>Test e-mail</CardTitle> }}>
      <fetcher.Form method="post">
        <input type="hidden" name="from" value={email} />
        <Stack spacing={3}>
          {mailboxes.length ? (
            <FormControl>
              <InputLabel htmlFor={selectMailboxId}>Use mailbox</InputLabel>
              <Select
                id={selectMailboxId}
                label="Use mailbox"
                name="mailbox"
                defaultValue={mailboxes[0].username}
                required
              >
                <MenuItem value="no-mailbox">Wrong Mailbox</MenuItem>
                <MenuItem value="wrong-password">Wrong Password</MenuItem>
                {mailboxes.map((item) => (
                  <MenuItem key={item.id} value={item.username}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Alert severity="error">need to create a mailbox first</Alert>
          )}
          <TextField
            label="To"
            name="to"
            required
            defaultValue="test@noma.co"
          />
          <TextField
            label="Subject"
            name="subject"
            required
            defaultValue="Testing this new email service"
          />
          <TextField
            minRows={3}
            multiline
            label="Email text"
            name="email"
            required
            defaultValue={`Test e-mail from ${email}`}
          />
          <TextField
            minRows={3}
            multiline
            label="Email html"
            name="html"
            required
            defaultValue={`<h1>HTML email</h1><p>Test e-mail from ${email}</p>`}
          />
          {error ? <ErrorMessage>{error}</ErrorMessage> : null}
          <LoadingButton
            loading={!!fetcher.submission}
            type="submit"
            sx={{ alignSelf: 'flex-start' }}
          >
            Send
          </LoadingButton>
        </Stack>
      </fetcher.Form>
    </BasicCard>
  );
};
