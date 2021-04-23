import { IBaseNode } from '@/interfaces/node';

interface INodes extends IBaseNode {
  loginRequired: boolean;
}

export const HOME_NODES: Array<INodes> = [
  {
    name: 'all',
    title: '全部',
    loginRequired: false,
  },
  {
    name: 'hot',
    title: '最热',
    loginRequired: false,
  },
  {
    name: 'qna',
    title: '问与答',
    loginRequired: false,
  },
  {
    name: 'city',
    title: '城市',
    loginRequired: false,
  },
  {
    name: 'deals',
    title: '交易',
    loginRequired: false,
  },
  {
    name: 'jobs',
    title: '酷工作',
    loginRequired: false,
  },
  {
    name: 'apple',
    title: 'Apple',
    loginRequired: false,
  },
  {
    name: 'play',
    title: '好玩',
    loginRequired: false,
  },
  {
    name: 'creative',
    title: '创意',
    loginRequired: false,
  },
  {
    name: 'tech',
    title: '技术',
    loginRequired: false,
  },
  {
    name: 'R2',
    title: 'R2',
    loginRequired: false,
  },
  {
    name: 'nodes',
    title: '节点',
    loginRequired: true,
  },
  {
    name: 'members',
    title: '关注',
    loginRequired: true,
  },
];
