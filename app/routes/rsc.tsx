import { Outlet } from '@remix-run/react';

// the only function of this layout is custom CatchBoundary
// TODO we may want some aggressive caching headers
export default function ResourceLayout() {
  return <Outlet />;
}

// we don't want anything here
export function CatchBoundary() {
  return '';
}
