// import { IUser } from './user';
// import { INode } from './node';

// export interface ITopic {
//   content: string;
//   content_rendered: string;
//   created: number;
//   id: number;
//   last_modified: number;
//   last_reply_by: number;
//   last_touched: number;
//   replies: number;
//   title: string;
//   url: string;
//   member: IUser;
//   node: INode;
// }

export interface ISupplement {
  content: string;
  createdAt: string;
}

export interface ITopic {
  id: number;
  title: string;
  nodeName: string;
  nodeTitle: string;
  vote: number;
  lastRepliedBy?: string;
  replyCount: number;
  avatar: string;
  author: string;
  createdAt?: string;
  content?: string;
  supplementList?: Array<ISupplement>;
  via?: string;
  isCollect?: boolean;
  views?: number;
  likes?: number;
  thanks?: number;
  lastReplyDatetime?: string;
}
