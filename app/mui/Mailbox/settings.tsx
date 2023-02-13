import {
  PersonAdd as AddIcon,
  PersonRemove as RemoveIcon,
} from '@mui/icons-material/';
import {
  Typography,
  Stack,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  List,
  ListItem,
  ListItemText,
  Alert,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import type { User } from '@prisma/client';
import type { SerializeFrom } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import * as React from 'react';
import { MailboxCard } from './card';
import { fromUUID } from '~/lib/utils';
import { ListActions } from '~/mui/components/ListActions';
import { LoadingButton } from '~/mui/components/LoadingButton';
import type { MailboxLoaderType } from '~/types/loader';

type MailboxSettingsProps = {
  mailbox: MailboxLoaderType;
  users: SerializeFrom<User>[];
  userId: string;
  error?: string;
};

const NameForm = ({ mailbox }: { mailbox: MailboxLoaderType }) => {
  const fetcher = useFetcher();
  const mailboxLinkId = fromUUID(mailbox.id);
  const isSubmitting = !!fetcher.submission;

  return (
    <fetcher.Form method="post">
      <Stack spacing={3}>
        <Typography component="h2" variant="h6">
          Rename mailbox
        </Typography>
        <input type="hidden" name="mailboxLinkId" value={mailboxLinkId} />
        <TextField
          label="Mailbox name"
          name="name"
          defaultValue={mailbox.name}
        />
        <LoadingButton
          type="submit"
          name="_action"
          value="_rename"
          loading={isSubmitting}
          sx={{ alignSelf: 'flex-start' }}
        >
          Update
        </LoadingButton>
      </Stack>
    </fetcher.Form>
  );
};

/** obviously owners can't be disconnected */
const UsersActions = ({
  userLinkId,
  mailboxLinkId,
}: {
  userLinkId: string;
  mailboxLinkId: string;
}) => {
  const fetcher = useFetcher();
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const isSubmitting = !!fetcher.submission;

  React.useEffect(() => {
    if (isSubmitting) {
      setShowConfirmation(false);
    }
  }, [isSubmitting]);

  return (
    <ListActions>
      {showConfirmation ? (
        <>
          <fetcher.Form method="post">
            <input type="hidden" name="mailboxLinkId" value={mailboxLinkId} />
            <input type="hidden" name="userLinkId" value={userLinkId} />
            <Button
              type="submit"
              name="_action"
              value="_disconnect"
              color="error"
              disabled={isSubmitting}
            >
              Remove Access
            </Button>
          </fetcher.Form>
          <Button variant="outlined" onClick={() => setShowConfirmation(false)}>
            Cancel
          </Button>
        </>
      ) : (
        <IconButton
          disabled={isSubmitting}
          onClick={() => setShowConfirmation(true)}
          aria-label="Remove Access"
        >
          <Tooltip title="Remove Access">
            <RemoveIcon color="action" fontSize="medium" />
          </Tooltip>
        </IconButton>
      )}
    </ListActions>
  );
};

export const MailboxSettings = ({
  mailbox,
  users,
  userId,
  error,
}: MailboxSettingsProps) => {
  const fetcher = useFetcher();
  const selectUsersId = React.useId();
  const sharedWithUsers = mailbox.users;
  const availableUsers = users.filter(
    (item) => !sharedWithUsers.find((mailboxUser) => mailboxUser.id === item.id)
  );
  const mailboxLinkId = fromUUID(mailbox.id);
  const [selected, setSelected] = React.useState('');

  // without this we get superfluous errors from MUI that select value is out of range
  // TODO we could wrap this logic in a separate component
  let safeSelected = selected;
  if (
    selected !== '' &&
    !availableUsers.some((item) => fromUUID(item.id) === selected)
  ) {
    safeSelected = '';
  }

  return (
    <MailboxCard mailbox={mailbox}>
      <NameForm mailbox={mailbox} />
      <Divider sx={{ my: 3 }} />
      <fetcher.Form
        method="post"
        onSubmit={() => {
          // resets the select value
          setSelected('');
        }}
      >
        <Stack spacing={3}>
          <Typography component="p" variant="h6">
            Give access to this mailbox
          </Typography>
          <Typography component="p" variant="body1" style={{ marginTop: 0 }}>
            Users must be invited before they appear in the list below
          </Typography>
          {availableUsers.length ? (
            <>
              <input type="hidden" name="mailboxLinkId" value={mailboxLinkId} />
              <FormControl>
                <InputLabel htmlFor={selectUsersId}>Select user</InputLabel>
                <Select
                  id={selectUsersId}
                  label="Select user"
                  name="shareWithUserLinkId"
                  required
                  value={safeSelected}
                  onChange={(event) => setSelected(event.target.value)}
                >
                  {availableUsers.map((item) => (
                    <MenuItem key={item.id} value={fromUUID(item.id)}>
                      {`${item.name} (${item.email})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <LoadingButton
                loading={!!fetcher.submission}
                startIcon={<AddIcon fontSize="small" />}
                type="submit"
                name="_action"
                value="_share"
                sx={{ alignSelf: 'flex-start' }}
              >
                Share With User
              </LoadingButton>
            </>
          ) : (
            <Alert severity="error">Invite more users first</Alert>
          )}
        </Stack>
      </fetcher.Form>
      <Typography component="p" variant="body1" sx={{ mt: 4, fontWeight: 600 }}>
        Users that already have access to this mailbox
      </Typography>
      <Typography component="p" variant="body1" style={{ marginTop: 0 }}>
        Owner cannot lose access to a mailbox
      </Typography>
      <List>
        {sharedWithUsers.map((itemUser, idx) => {
          const isOwner = mailbox.ownerId === itemUser.id;

          return (
            <ListItem
              key={itemUser.id}
              divider={idx + 1 < sharedWithUsers.length}
              secondaryAction={
                !isOwner ? (
                  <UsersActions
                    mailboxLinkId={mailboxLinkId}
                    userLinkId={fromUUID(itemUser.id)}
                  />
                ) : undefined
              }
            >
              <ListItemText
                primary={`${itemUser.name} (${itemUser.email}) ${
                  itemUser.id === userId ? '(You)' : ''
                } ${isOwner ? 'Owner' : ''}`}
              />
            </ListItem>
          );
        })}
      </List>
    </MailboxCard>
  );
};
