import { List, ListItem, ListItemText, Box } from '@mui/material';
import type { User } from '@prisma/client';
import type { SerializeFrom } from '@remix-run/node';
import { CardTitle } from '~/mui/components/CardTitle';
import { BasicCard } from '~/mui/DashboardLayout';
import type { UserStatusType } from '~/types/db';

type AdminProps = {
  user: SerializeFrom<User>;
  users: SerializeFrom<User>[];
};

const colors: { [key in UserStatusType]: string } = {
  ACTIVE: 'primary.main',
  DISABLED: 'error.dark',
  INVITED: 'text.secondary',
};

export const AdminView = ({ user, users }: AdminProps) => {
  return (
    <BasicCard headerProps={{ title: <CardTitle>Users</CardTitle> }}>
      <List>
        {users.map((item, idx) => (
          <ListItem
            key={item.id}
            divider={idx + 1 < users.length}
            sx={{ '& > .MuiListItemText-root': { flexBasis: '50%' } }}
          >
            <ListItemText primary={`${item.name} (${item.email})`} />
            <ListItemText
              secondary={
                <>
                  {`role: ${item.role}`}
                  <br />
                  <Box
                    component="span"
                    sx={{
                      '.status': {
                        color:
                          colors[item.status as UserStatusType] ??
                          'text.secondary',
                      },
                    }}
                  >
                    status: <span className="status">{item.status}</span>
                  </Box>
                  <br />
                  {`created: ${new Date(item.createdAt).toLocaleString(
                    'en-gb'
                  )}`}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </BasicCard>
  );
};
