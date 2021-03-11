export interface INotification {
  type: TNotificationType;
  payload: string;
  topicTitle: string;
  topicId: number;
  avatar: string;
  username: string;
  createdAt: string;
}

export type TNotificationType = 'reply' | 'refer' | 'thanks' | 'collect';
