import { IUser } from './user';
import { INode } from './node';

export interface ITopic {
  content: string;
  content_rendered: string;
  created: number;
  id: number;
  last_modified: number;
  last_reply_by: number;
  last_touched: number;
  replies: number;
  title: string;
  url: string;
  member: IUser;
  node: INode;
}
