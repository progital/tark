import type { CardHeaderProps } from '@mui/material';
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
} from '@mui/material';
import * as React from 'react';

type BasicCardProps = React.PropsWithChildren<{
  headerProps: CardHeaderProps;
}>;

export const BasicCard = ({ headerProps, children }: BasicCardProps) => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardHeader {...headerProps} />
            <Divider />
            <CardContent>{children}</CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
