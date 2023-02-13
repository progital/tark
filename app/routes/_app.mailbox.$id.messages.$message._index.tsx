import type { LoaderArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { DEFAULT_MESAGE_TAB } from '~/lib/constants';

export const loader = async ({ request, params }: LoaderArgs) => {
  return redirect(DEFAULT_MESAGE_TAB);
};
