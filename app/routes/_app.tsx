import { json } from '@remix-run/node';
import type { LoaderArgs, MetaFunction } from '@remix-run/node';
import { Link, Outlet, useLoaderData, useMatches } from '@remix-run/react';
import { requireUser } from '~/lib/auth';
import { APP_TITLE, ROUTES } from '~/lib/constants';
import { pickModelFields } from '~/lib/utils';
import {
  getDomainUrlFromRequest,
  getRequiredEnvVariable,
} from '~/lib/utils.server';
import { BackAction } from '~/mui/components/BackAction';
import { Breadcrumbs } from '~/mui/components/Breadcrumbs';
import { DashboardLayout } from '~/mui/DashboardLayout';
import type { LimitedUser } from '~/types/loader';

const allowedUserFields = [
  'id',
  'createdAt',
  'email',
  'name',
  'role',
  'status',
] as const;

export const meta: MetaFunction = () => ({
  title: `${APP_TITLE}`,
});

// other routes still need the requireUser check
export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser({ request });
  const LISTEN_PORT = getRequiredEnvVariable('SMTP_LISTEN_PORT');

  const selected: LimitedUser = pickModelFields(user, allowedUserFields);
  return json({
    user: selected,
    host: { origin: getDomainUrlFromRequest(request), port: LISTEN_PORT },
  });
};

// we can pass something to the layout in this pathless route
export default function AppLayout() {
  const data = useLoaderData<typeof loader>();

  // Child routes can provide elements/data for the dashboard layout
  const matches = useMatches();
  let layoutProps: React.ComponentProps<typeof DashboardLayout> = {
    name: data.user.name,
  };

  // we get last child route that has `navbarAction`;
  const actionData = matches
    .slice()
    .reverse()
    .find((item) => !!item.data?.navbarAction);

  const crumbs = matches
    .filter((item) => !!item?.data?.navbarNavItem)
    .map((item) => ({
      name: item?.data.navbarNavItem.name,
      path: item.pathname,
    }));

  if (actionData && actionData.data.navbarAction?.action === 'back') {
    // we get the last child route that has `navbarAction`;
    layoutProps = {
      ...layoutProps,
      action: <BackAction {...(actionData.data.navbarAction?.args ?? {})} />,
    };
  }

  if (crumbs.length) {
    layoutProps = {
      ...layoutProps,
      crumbs: (
        <Breadcrumbs className="top-nav">
          <Link to={ROUTES.dashboard}>Home</Link>
          {crumbs.map((item, idx) =>
            idx < crumbs.length - 1 ? (
              <Link key={item.path} to={item.path}>
                {item.name}
              </Link>
            ) : (
              <span key={item.path} className="top-nav-crumb">
                {item.name}
              </span>
            )
          )}
        </Breadcrumbs>
      ),
    };
  }

  return (
    <DashboardLayout {...layoutProps}>
      <Outlet />
    </DashboardLayout>
  );
}
