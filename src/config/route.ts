export const ROUTES = {
  TABS: 'TABS',
  TAB_INDEX: 'TAB_INDEX',
  TAB_NODE: 'TAB_NODE',
  TAB_NOTICE: 'TAB_NOTICE',
  TAB_ME: 'TAB_ME',
  LOGIN: 'LOGIN',
  TOPIC: 'TOPIC',
  PROFILE: 'PROFILE',
  HISTORY: 'HISTORY',
  NODE_TOPIC: 'NODE_TOPIC',
  FAV_TOPIC: 'FAV_TOPIC',
  FOLLOW: 'FOLLOW',
  ABOUT: 'ABOUT',
} as const;

// see https://stackoverflow.com/questions/52393730/typescript-string-literal-union-type-from-enum
export type ROUTES = typeof ROUTES[keyof typeof ROUTES];
