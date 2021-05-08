import { IBaseNode } from '@/interfaces/node';

interface INodes extends IBaseNode {
  loginRequired: boolean;
}

export const NODE_TABS = {
  ALL: 'all',
  HOT: 'hot',
  QNA: 'qna',
  CITY: 'city',
  DEALS: 'deals',
  JOBS: 'jobs',
  APPLE: 'apple',
  PLAY: 'play',
  CREATIVE: 'creative',
  TECH: 'tech',
  R2: 'R2',
  NODES: 'nodes',
  MEMBERS: 'members',
};

export type NODE_TABS = typeof NODE_TABS[keyof typeof NODE_TABS];

export const HOME_NODES: Array<INodes> = [
  {
    name: NODE_TABS.ALL,
    title: '全部',
    loginRequired: false,
  },
  {
    name: NODE_TABS.HOT,
    title: '最热',
    loginRequired: false,
  },
  {
    name: NODE_TABS.QNA,
    title: '问与答',
    loginRequired: false,
  },
  {
    name: NODE_TABS.CITY,
    title: '城市',
    loginRequired: false,
  },
  {
    name: NODE_TABS.DEALS,
    title: '交易',
    loginRequired: false,
  },
  {
    name: NODE_TABS.JOBS,
    title: '酷工作',
    loginRequired: false,
  },
  {
    name: NODE_TABS.APPLE,
    title: 'Apple',
    loginRequired: false,
  },
  {
    name: NODE_TABS.PLAY,
    title: '好玩',
    loginRequired: false,
  },
  {
    name: NODE_TABS.CREATIVE,
    title: '创意',
    loginRequired: false,
  },
  {
    name: NODE_TABS.TECH,
    title: '技术',
    loginRequired: false,
  },
  {
    name: NODE_TABS.R2,
    title: 'R2',
    loginRequired: false,
  },
  {
    name: NODE_TABS.NODES,
    title: '节点',
    loginRequired: true,
  },
  {
    name: NODE_TABS.MEMBERS,
    title: '关注',
    loginRequired: true,
  },
];
