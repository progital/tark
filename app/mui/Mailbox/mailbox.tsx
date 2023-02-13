import {
  DeleteOutline as DeleteIcon,
  Cached as ReloadIcon,
  InfoOutlined as InfoIcon,
  SettingsOutlined as SettingsIcon,
} from '@mui/icons-material';
import {
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  alpha,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useFetcher, useMatches, useRevalidator } from '@remix-run/react';
import clsx from 'clsx';
import * as React from 'react';
import { MailboxHelp } from './help';
import { fromUUID, getParamFromMatches, timeAgo, toUUID } from '~/lib/utils';
import { ErrorScreen } from '~/mui/components/ErrorScreen';
import { IconButtonLink, Link } from '~/mui/components/LinkStyled';
import { ListActions } from '~/mui/components/ListActions';
import { useMobile } from '~/mui/hooks/useMobile';
import { MobileUser } from '~/mui/svg/MobileUser';
import type { MailboxLoaderType, MessageViewType } from '~/types/loader';

type MailboxProps = React.PropsWithChildren<{
  mailbox: MailboxLoaderType;
}>;

const viewList: { [key in MessageViewType]: string } = {
  text: 'Text',
  // iframe
  html: 'HTML',
  markup: 'HTML Markup',
  parsed: 'Source',
  // iframe
  raw: 'Raw',
  session: 'Session',
};

const ViewLink = ({
  isActive,
  to,
  label,
}: {
  isActive: boolean;
  to: string;
  label: string;
}) => {
  return isActive ? (
    <span className="active">{label}</span>
  ) : (
    <Link to={to}>{label}</Link>
  );
};

const MessageActions = ({ messageLinkId }: { messageLinkId: string }) => {
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
            <input type="hidden" name="messageLinkId" value={messageLinkId} />
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
        <IconButton
          disabled={isSubmitting}
          onClick={() => setShowConfirmation(true)}
          aria-label="Delete Message"
          className="message-action-button"
        >
          <Tooltip title="Delete Message">
            <DeleteIcon color="action" fontSize="medium" />
          </Tooltip>
        </IconButton>
      )}
    </ListActions>
  );
};

export const MailboxView = ({ mailbox, children }: MailboxProps) => {
  const { messages } = mailbox;
  const hasMessages = !!messages?.length;
  const matches = useMatches();
  let revalidator = useRevalidator();

  const showMobile = useMobile();

  const locationMessageLinkId = getParamFromMatches('message', matches);
  const locationViewId = getParamFromMatches('view', matches);
  const mailboxLinkId = getParamFromMatches('id', matches);
  const theme = useTheme();

  let currentMessage: (typeof messages)[number] | null = null;
  let currentMessageId: string | null = null;
  if (locationMessageLinkId) {
    currentMessageId = toUUID(locationMessageLinkId);
    currentMessage =
      messages.find((item) => item.id === currentMessageId) ?? null;
  }

  const refreshMessages = () => {
    if (revalidator.state === 'idle') {
      revalidator.revalidate();
    }
  };

  if (!hasMessages) {
    return (
      <ErrorScreen ImageComponent={MobileUser}>
        This mailbox is empty
      </ErrorScreen>
    );
  }

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        maxHeight: '100%',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          maxHeight: '100%',
          height: '100%',
          maxWidth: '100%',
        }}
      >
        {!(showMobile && currentMessageId) ? (
          <Box
            sx={{
              width: showMobile ? '100%' : '370px',
              flex: showMobile ? '0 0 100%' : '0 0 370px',
              overflowX: 'auto',
              maxHeight: '100%',
              a: { color: 'inherit' },
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                p: 1,
                bgcolor: theme.palette.background.paper,
              }}
            >
              <IconButton
                disabled={revalidator.state !== 'idle'}
                onClick={refreshMessages}
                aria-label="Refresh messages"
              >
                <Tooltip title="Refresh">
                  <ReloadIcon color="action" fontSize="medium" />
                </Tooltip>
              </IconButton>
              <IconButtonLink
                to={`/mailbox/${mailboxLinkId}/info`}
                aria-label="Info"
              >
                <Tooltip title="Info">
                  <InfoIcon color="action" fontSize="medium" />
                </Tooltip>
              </IconButtonLink>
              <IconButtonLink
                to={`/mailbox/${mailboxLinkId}/settings`}
                aria-label="Settings"
              >
                <Tooltip title="Settings">
                  <SettingsIcon color="action" fontSize="medium" />
                </Tooltip>
              </IconButtonLink>
            </Box>
            <List sx={{ pt: 0 }}>
              {messages.map((item, idx) => {
                const messageLinkId = fromUUID(item.id);
                const isActive = messageLinkId === locationMessageLinkId;

                return (
                  <ListItem
                    key={item.id}
                    disableGutters
                    className={clsx({ active: isActive })}
                    divider={idx + 1 < messages.length}
                    sx={{
                      borderLeft: '4px solid transparent',
                      '&.active': {
                        borderLeftColor: theme.palette.secondary.main,
                        bgcolor: alpha(theme.palette.secondary.light, 0.05),
                      },
                      a: {
                        px: 1,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                      },
                    }}
                  >
                    <Link
                      to={messageLinkId}
                      sx={{
                        '&:focus, &:focus-visible': {
                          textDecoration: 'none',
                        },
                        '&:focus-visible': {
                          '.MuiListItemText-primary': {
                            fontWeight: 600,
                            textDecoration: 'underline',
                          },
                        },
                      }}
                    >
                      <ListItemText
                        className={clsx('mail-details', { active: isActive })}
                        primary={item.subject}
                        secondary={
                          <>
                            From: {item.from}
                            <br />
                            To: {item.to}
                          </>
                        }
                      />
                      <ListItemText
                        secondary={timeAgo(new Date(item.createdAt))}
                        sx={{
                          width: '100px',
                          textAlign: 'right',
                          alignSelf: 'flex-end',
                        }}
                      />
                    </Link>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ) : null}
        {locationMessageLinkId ? (
          <Box
            sx={{
              p: 2,
              flexGrow: 1,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '100%',
            }}
          >
            {currentMessage ? (
              <Box
                component="div"
                sx={{ display: 'flex', flexDirection: 'row' }}
              >
                <Box component="div" sx={{ flexGrow: 1 }}>
                  <Typography component="p" variant="h4" sx={{ mb: 1 }}>
                    {currentMessage.subject}
                  </Typography>
                  <Typography component="div" variant="body1" sx={{ mb: 3 }}>
                    <p>
                      <strong>From:</strong> {currentMessage.from}
                    </p>
                    <p>
                      <strong>To: </strong>
                      {currentMessage.to}
                    </p>
                    <p>
                      <strong>Sent: </strong>
                      {new Date(currentMessage.createdAt).toLocaleString(
                        'en-gb'
                      )}
                    </p>
                  </Typography>
                </Box>
                <Box
                  component="div"
                  sx={{
                    width: '100px',
                    flex: '0 0 100px',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    pr: 4,
                    '.message-action-button': {
                      mt: 1,
                    },
                  }}
                >
                  <MessageActions messageLinkId={locationMessageLinkId} />
                </Box>
              </Box>
            ) : null}
            <Typography
              component="div"
              variant="h6"
              sx={(theme) => ({
                pb: 2,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'row',
                overflowX: 'auto',
                a: {
                  color: 'inherit',
                  whiteSpace: 'nowrap',
                  '&:focus, &:focus-visible': {
                    textDecoration: 'none',
                    borderBottom: `3px solid ${alpha(
                      theme.palette.secondary.light,
                      0.7
                    )}`,
                  },
                },
                '& > *': {
                  px: 1,
                  py: 0.5,
                  mx: 1,
                  transition: 'border 0.1s linear',
                  borderBottom: `3px solid transparent`,
                  '&:not(:last-child)': {
                    mr: 3,
                  },
                  [theme.breakpoints.down('lg')]: {
                    '&:not(:last-child)': {
                      mr: 0,
                    },
                  },
                },
                '.active': {
                  borderBottom: `3px solid ${theme.palette.secondary.main}`,
                  whiteSpace: 'nowrap',
                },
              })}
            >
              {Object.entries(viewList).map(([key, label]) => (
                <ViewLink
                  key={key}
                  to={`${locationMessageLinkId}/${key}`}
                  isActive={locationViewId === key}
                  label={label}
                />
              ))}
            </Typography>
            <Box
              sx={{
                flexGrow: 1,
                overflow: 'hidden',
              }}
            >
              {children}
            </Box>
          </Box>
        ) : !showMobile ? (
          <MailboxHelp />
        ) : null}
      </Box>
    </Container>
  );
};
