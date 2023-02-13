import { useMatches } from '@remix-run/react';
import * as React from 'react';
import type { LimitedUser } from '~/types/loader';

let hydrating = true;

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = React.useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

export function useUser(): LimitedUser | null {
  const data = useMatchesData('routes/_app');

  return data?.user ? (data.user as LimitedUser) : null;
}

export function useHost(): {
  origin?: string | null;
  port?: string;
  domain?: string;
  host?: string;
} {
  const data = useMatchesData('routes/_app');
  // TODO can do better here
  let domain;
  let host;
  try {
    // @ts-ignore
    const url = new URL(data?.host?.origin);
    domain = url.hostname;
    host = url.host;
  } catch (e) {
    // do nothing
  }

  return data?.host ? { ...data.host, domain, host } : {};
}

export function useIsAdmin(): boolean {
  const user = useUser();

  return user?.role === 'ADMIN';
}

export function useHydrated() {
  let [hydrated, setHydrated] = React.useState(() => !hydrating);

  React.useEffect(function hydrate() {
    hydrating = false;
    setHydrated(true);
  }, []);

  return hydrated;
}
