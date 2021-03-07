export interface IUser {
  id: number;
  username: string;
  location: string;
  url: string;
  website: string;
  twitter: string;
  tagline: string;
  psn: string;
  github: string;
  created: number;
  btc: string;
  bio: string;
  avatar_mini: string;
  avatar_normal: string;
  avatar_large: string;
}

export interface ILoginParams {
  username: string;
  password: string;
  captcha: string;
  once: string;
  next: string;
}
