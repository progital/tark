import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { requireAdmin } from '~/lib/auth';
import { getAllUsers } from '~/lib/db-actions';
import { AdminView } from '~/mui/Admin';

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireAdmin({ request });
  const users = await getAllUsers();

  return json({ user, users });
};

export default function AdminIndexRoute() {
  const data = useLoaderData<typeof loader>();

  return <AdminView {...data} />;
}
