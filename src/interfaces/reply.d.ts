// import { IUser } from './user';

// export interface IReply {
//   id: number;
//   topic_id: number;
//   content: string;
//   content_rendered: string;
//   created: number;
//   last_modified: number;
//   member_id: number;
//   member: IUser;
// }

export interface IReply {
  avatar: string;
  author: string;
  createdAt: string;
  thanks: number;
  no: number;
  content: string;
}
