import {
  InfoOutlined as InfoIcon,
  LibraryAdd as AddIcon,
  DeleteOutline as DeleteIcon,
  SettingsOutlined as SettingsIcon,
} from '@mui/icons-material';
import {
  List,
  ListItem,
  ListItemText,
  Tooltip,
  IconButton,
  Button,
  useTheme,
  Collapse,
} from '@mui/material';
import { useFetcher } from '@remix-run/react';
import * as React from 'react';
import { TransitionGroup } from 'react-transition-group';
import { fromUUID } from '~/lib/utils';
import { CardTitle } from '~/mui/components/CardTitle';
import { IconButtonLink, Link } from '~/mui/components/LinkStyled';
import { ListActions } from '~/mui/components/ListActions';
import { LoadingButton } from '~/mui/components/LoadingButton';
import { BasicCard } from '~/mui/DashboardLayout';
import { useMobile } from '~/mui/hooks/useMobile';
import { iconButtonStyle } from '~/mui/styles';
import type { MailboxesLoaderType } from '~/types/loader';

type MailboxesProps = {
  mailboxes: MailboxesLoaderType;
  userId: string;
};

/** mailboxes can only be deleted by their owners */
const MailboxActions = ({
  mailboxLinkId,
  isOwner,
}: {
  mailboxLinkId: string;
  isOwner?: boolean;
}) => {
  const fetcher = useFetcher();
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const isSubmitting = !!fetcher.submission;
  const theme = useTheme();

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
            <Button
              type="submit"
              name="_action"
              value="_delete"
              color="error"
              disabled={isSubmitting}
            >
              Delete
            </Button>
          </fetcher.Form>
          <Button variant="outlined" onClick={() => setShowConfirmation(false)}>
            Cancel
          </Button>
        </>
      ) : (
        <>
          <IconButtonLink
            to={`mailbox/${mailboxLinkId}/info`}
            aria-label="Info"
          >
            <Tooltip title="Info">
              <InfoIcon color="action" fontSize="medium" />
            </Tooltip>
          </IconButtonLink>
          <IconButtonLink
            to={`mailbox/${mailboxLinkId}/settings`}
            aria-label="Settings"
          >
            <Tooltip title="Settings">
              <SettingsIcon color="action" fontSize="medium" />
            </Tooltip>
          </IconButtonLink>
          <IconButton
            disabled={!isOwner || isSubmitting}
            onClick={() => setShowConfirmation(true)}
            aria-label="Delete"
            sx={iconButtonStyle({ theme })}
          >
            <Tooltip title="Delete">
              <DeleteIcon color="action" fontSize="medium" />
            </Tooltip>
          </IconButton>
        </>
      )}
    </ListActions>
  );
};

const CreateNewMailbox = () => {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post">
      <LoadingButton
        variant="outlined"
        loading={!!fetcher.submission}
        startIcon={<AddIcon fontSize="small" />}
        type="submit"
        name="_action"
        value="_create-new"
      >
        Create New
      </LoadingButton>
    </fetcher.Form>
  );
};

export const Mailboxes = ({ mailboxes, userId }: MailboxesProps) => {
  const isMobile = useMobile();

  return (
    <BasicCard
      headerProps={{
        title: <CardTitle>Mailboxes</CardTitle>,
        action: <CreateNewMailbox />,
      }}
    >
      <List component="div" sx={{ ul: { listStyle: 'none' } }}>
        <TransitionGroup component="ul">
          {mailboxes.map((item, idx) => {
            const mailboxLinkId = fromUUID(item.id);

            return (
              <Collapse key={item.id} component="li">
                <ListItem
                  component="div"
                  divider={idx + 1 < mailboxes.length}
                  secondaryAction={
                    <MailboxActions
                      mailboxLinkId={mailboxLinkId}
                      isOwner={item.ownerId === userId}
                    />
                  }
                  sx={(theme) => ({
                    [theme.breakpoints.down('md')]: {
                      flexDirection: 'column',
                      pr: 2,
                      alignItems: 'flex-start',
                      '.MuiListItemSecondaryAction-root': {
                        position: 'initial',
                        transform: 'none',
                        alignSelf: 'flex-end',
                      },
                    },
                  })}
                >
                  <ListItemText
                    primary={
                      <Link bold to={`mailbox/${mailboxLinkId}/messages`}>
                        {item.name}
                      </Link>
                    }
                    secondary={
                      <>
                        {`messages: ${item._count.messages}`}
                        <br />
                        {isMobile ? (
                          <>
                            username: {item.username}
                            <br />
                            password: {item.password}
                          </>
                        ) : (
                          `username: ${item.username}, password: ${item.password}`
                        )}
                      </>
                    }
                  />
                </ListItem>
              </Collapse>
            );
          })}
        </TransitionGroup>
      </List>
    </BasicCard>
  );
};
