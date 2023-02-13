import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
} from '@mui/material';
import * as React from 'react';
import { BackAction } from '~/mui/components/BackAction';
import type { MailboxLoaderType } from '~/types/loader';

type MailboxCardProps = React.PropsWithChildren<{
  mailbox: MailboxLoaderType;
}>;

export const MailboxCard = ({ mailbox, children }: MailboxCardProps) => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={<BackAction button label={mailbox.name} />} />
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>{children}</CardContent>
            <Divider />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
