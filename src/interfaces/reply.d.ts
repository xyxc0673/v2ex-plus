import { IUser } from './user';

export interface IReply {
  id: number;
  topic_id: number;
  content: string;
  content_rendered: string;
  created: number;
  last_modified: number;
  member_id: number;
  member: IUser;
}
