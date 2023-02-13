import { Typography, Box, Divider } from '@mui/material';
import { MailboxCard } from './card';
import { useHost } from '~/lib/hooks';
import type { MailboxLoaderType } from '~/types/loader';

type MailboxInfoProps = {
  mailbox: MailboxLoaderType;
};

export const MailboxInfo = ({ mailbox }: MailboxInfoProps) => {
  const host = useHost();
  let domain = host.domain || 'unknown';
  let port = host.port || 'unknown';

  return (
    <MailboxCard mailbox={mailbox}>
      <Box
        component="dl"
        sx={{
          display: 'grid',
          gridTemplateColumns: 'max-content 1fr',
          columnGap: 2,
          rowGap: 0.5,
          dt: { fontWeight: 'bold' },
          mb: 3,
        }}
      >
        <dt>Host</dt>
        <dd>{domain}</dd>
        <dt>Port</dt>
        <dd>{port}</dd>
        <dt>Username</dt>
        <dd>{mailbox.username}</dd>
        <dt>Password</dt>
        <dd>{mailbox.password}</dd>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Typography variant="h6" component="p">
        Nodemailer (Node.js) example
      </Typography>
      <Typography variant="body1" component="p">
        <a
          href="https://github.com/nodemailer/nodemailer/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Nodemailer
        </a>{' '}
        is a popular Node.js library for sending emails.
      </Typography>
      <pre>
        <code>
          {`
const transport = nodemailer.createTransport({
  host: '${domain}',
  port: ${port},
  auth: {
    user: '${mailbox.username}',
    pass: '${mailbox.password}'
  }
});`}
        </code>
      </pre>
    </MailboxCard>
  );
};
