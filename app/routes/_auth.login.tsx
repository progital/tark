import { Box, TextField, Typography } from '@mui/material';
import type { ActionArgs, HeadersFunction, LoaderArgs } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import { Form, useLoaderData, useNavigation } from '@remix-run/react';
import * as React from 'react';
import { getLoginSession, authService } from '~/lib/auth';
import { ROUTES } from '~/lib/constants';
import { ErrorMessage } from '~/mui/components/ErrorMessage';
import { LoadingButton } from '~/mui/components/LoadingButton';

const routeHeaders = {
  'Cache-Control': 'private, max-age=3600',
  Vary: 'Cookie',
};

export const loader = async ({ request }: LoaderArgs) => {
  const auth = await authService({ request });
  await auth.isAuthenticated({
    successCallback: () => {
      throw redirect(ROUTES.dashboard);
    },
    failureAlwaysThrows: false,
  });

  const loginSession = await getLoginSession(request);

  const data = {
    email: loginSession.getEmail(),
    error: loginSession.getError(),
    magicLinkSent: loginSession.hasMagicLink(),
  };

  const headers = new Headers(routeHeaders);
  await loginSession.getHeaders(headers);

  return json(data, { headers });
};

// TODO better merge function
export const headers: HeadersFunction = () => routeHeaders;

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData();

  const failedHoneypot = Boolean(form.get('password'));
  if (failedHoneypot) {
    console.log(`FAILED HONEYPOT ON LOGIN`, Object.fromEntries(form.entries()));
    // TODO add delay ~10s
    return redirect(ROUTES.login);
  }

  const auth = await authService({ request });
  const email = form.get('email');

  if (typeof email !== 'string' || !(await auth.validateEmail(email))) {
    console.log(`INVALID EMAIL`, Object.fromEntries(form.entries()));
    auth.session.setFlashError('Invalid email');

    return redirect(ROUTES.login, { headers: await auth.session.getHeaders() });
  }

  try {
    await auth.sendMagicLinkEmail(email);
  } catch (e) {
    auth.session.setFlashError(
      e instanceof Error ? e.message : 'Failed to send email'
    );
    return redirect(ROUTES.login, {
      headers: await auth.session.getHeaders(),
    });
  }

  return redirect(ROUTES.login, {
    headers: await auth.session.getHeaders(),
  });
};

export default function LoginRoute() {
  const { magicLinkSent, email, error } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const formRef = React.useRef<HTMLFormElement | null>(null);

  React.useEffect(() => {
    if (!isSubmitting) {
      formRef.current?.reset();
    }
  }, [isSubmitting]);

  return (
    <>
      <Box>
        <Typography color="textPrimary" variant="h4" component="h1">
          Sign in
        </Typography>
        <Typography color="textSecondary" gutterBottom variant="body2">
          {magicLinkSent ? (
            <>
              We've sent an email to {email}
              <br />
              Entering a different email below resets the login flow
            </>
          ) : (
            "Enter your email below to sign in to your existing account or create a new one. We'll send you an email with a magic link to get started."
          )}
        </Typography>
      </Box>
      <Form ref={formRef} method="post">
        <TextField
          fullWidth
          label="Email Address"
          margin="normal"
          name="email"
          type="email"
          variant="outlined"
          error={!!error}
          required
          disabled={isSubmitting}
        />
        <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden>
          <TextField
            fullWidth
            label="Password"
            margin="normal"
            name="password"
            type="password"
            variant="outlined"
            InputProps={{ inputProps: { tabIndex: -1 } }}
            autoComplete="nope"
          />
        </div>

        {error ? <ErrorMessage>{error}</ErrorMessage> : null}

        <Box sx={{ py: 2 }}>
          <LoadingButton
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            type="submit"
            loading={isSubmitting}
          >
            <span>{isSubmitting ? 'Signing In' : 'Sign In'}</span>
          </LoadingButton>
        </Box>
      </Form>
    </>
  );
}
