import * as React from 'react';
import { useHydrated } from '~/lib/hooks';

type ClientOnlyProps = {
  children: () => React.ReactNode;
  fallback?: React.ReactNode;
};

/**
 * Render the children only after the JS has loaded client-side.
 * Use an optional fallback component if the JS is not yet loaded.
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  return useHydrated() ? <>{children()}</> : <>{fallback}</>;
}
