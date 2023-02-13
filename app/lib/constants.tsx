import {
  MarkAsUnread as MarkAsUnreadIcon,
  ForwardToInbox as ForwardToInboxIcon,
  GroupAdd as UsersIcon,
  AdminPanelSettings as AdminIcon,
  AccountBox as ProfileIcon,
} from '@mui/icons-material/';
import type { MessageViewType } from '~/types/loader';

export const MAGIC_LINK_EXPIRATION_TIME = 1000 * 60 * 30; // [ms] --> 30 mins
export const USER_SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 90; // ms --> 90 days
export const USER_SESSION_AUTO_EXTEND_TIME = 1000 * 60 * 60 * 24 * 30; // ms --> 30 days
export const MAGIC_LINK_CALLBACK_ROUTE = 'magic'; // /magic route used for callback
export const MAGIC_LINK_SEARCH_PARAM = 'signinkey'; // query string param
export const ROUTES = {
  login: '/login',
  dashboard: '/',
  landing: '/',
} as const;
export const APP_TITLE = 'Tark';
export const APP_NAME_EMAIL = 'Tark - Email Testing Tool';

export const DEFAULT_MESAGE_TAB: MessageViewType = 'html';

export const LOGIN_COOKIE_NAME = '__tarkserv_login';
export const USER_SESSION_COOKIE_NAME = '__tarkserv_user_session';

type SidebarItemType = {
  href: string;
  icon: JSX.Element;
  title: string;
  adminOnly?: boolean;
};

export const SIDEBAR_ITEMS: SidebarItemType[] = [
  {
    href: '/',
    icon: <MarkAsUnreadIcon fontSize="small" />,
    title: 'Dashboard',
  },
  {
    href: '/invite-user',
    icon: <UsersIcon fontSize="small" />,
    title: 'Invite User',
  },
  {
    href: '/test-mail',
    icon: <ForwardToInboxIcon fontSize="small" />,
    title: 'Test Mail',
    adminOnly: true,
  },
  {
    href: '/admin',
    icon: <AdminIcon fontSize="small" />,
    title: 'Admin',
    adminOnly: true,
  },
];

export const SIDEBAR_MOBILE_ITEMS: SidebarItemType[] = [
  {
    href: '/profile',
    icon: <ProfileIcon fontSize="small" />,
    title: 'Profile',
  },
];
