import type { User } from '@prisma/client';
import type { RouteMatch } from '@remix-run/react';
import short from 'short-uuid';
import type { UserStatusType } from '~/types/db';

const translator = short();

function getErrorMessage(
  error: unknown,
  defaultMessage: string = 'Unknown Error'
) {
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
}

/** gives active/valid users, removing disabled users */
function filterValidUsers(users: User[]) {
  const validStatus: Array<UserStatusType> = ['ACTIVE', 'INVITED'];

  return users.filter((item) =>
    validStatus.includes(item.status as UserStatusType)
  );
}

function timeAgo(timestamp: Date, locale = 'en') {
  let value;
  const diff = (new Date().getTime() - timestamp.getTime()) / 1000;
  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (years > 0) {
    value = rtf.format(0 - years, 'year');
  } else if (months > 0) {
    value = rtf.format(0 - months, 'month');
  } else if (days > 0) {
    value = rtf.format(0 - days, 'day');
  } else if (hours > 0) {
    value = rtf.format(0 - hours, 'hour');
  } else if (minutes > 0) {
    value = rtf.format(0 - minutes, 'minute');
  } else {
    value = 'less than a minute ago';
  }
  return value;
}

function getParamFromMatches(paramName: string, matches: RouteMatch[]) {
  const found = matches.find((item) => item.params?.[paramName]);
  return found?.params?.[paramName];
}

function escapeHtml(str: string) {
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ((
        {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;',
        } as any
      )[tag])
  );
}

// this looks good because all picked keys must exist on the object
// TODO try it with different data
function pickModelFields<
  ObjType extends { [key in KeysType[number]]?: any },
  KeysType extends readonly any[]
>(obj: ObjType, keys: KeysType) {
  return keys.reduce(function (result: ObjType, prop: KeysType[number]) {
    if (prop in obj) {
      result[prop] = obj[prop];
    }
    return result;
  }, {}) as { [key in KeysType[number]]: ObjType[key] };
}

const { fromUUID, toUUID } = translator;

export {
  escapeHtml,
  filterValidUsers,
  fromUUID,
  getErrorMessage,
  getParamFromMatches,
  pickModelFields,
  timeAgo,
  toUUID,
};
