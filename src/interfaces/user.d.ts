import { ISocial } from './social';

export interface IUser {
  id: number;
  username: string;
  createdAt: string;
  avatar: string;
  dau: string;
  bio: string;
  isOnline: boolean;
  socialList: Array<ISocial>;
  blockToken: string;
  tagLine: string;
  company: string;
  workTitle: string;
}

export interface ILoginParams {
  username: string;
  password: string;
  captcha: string;
  once: string;
  next: string;
}
