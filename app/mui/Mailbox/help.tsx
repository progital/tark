import type { StackProps } from '@mui/material';
import { Typography, Stack } from '@mui/material';

export const MailboxHelp = (props: StackProps) => {
  return (
    <Stack
      {...props}
      spacing={3}
      sx={{ p: 3, pl: 6, ul: { listStyle: 'none' } }}
    >
      <Typography variant="body1">
        Selecting a message on the left will display it's contents
      </Typography>
      <Typography variant="body1" component="ul">
        <li>
          <strong>Text</strong> - plaintext body of the message
        </li>
        <li>
          <strong>HTML</strong> - HTML body of the message
        </li>
        <li>
          <strong>HTML Markup</strong> - HTML body of the message displayed as
          plain text
        </li>
        <li>
          <strong>Source</strong> - parsed{' '}
          <a
            href="https://nodemailer.com/extras/mailparser/#mail-object"
            target="_blank"
            rel="noopener noreferrer"
          >
            email structure
          </a>
        </li>
        <li>
          <strong>Raw</strong> - message source as received by the SMTP server
        </li>
        <li>
          <strong>Session</strong> - SMTP server's{' '}
          <a
            href="https://nodemailer.com/extras/smtp-server/#session-object"
            target="_blank"
            rel="noopener noreferrer"
          >
            session object
          </a>
        </li>
      </Typography>
    </Stack>
  );
};
