import { AxiosResponse } from 'axios';
import instance from './request';

export interface IThanksReplyResponse {
  message?: string;
  success: boolean;
  once: string;
}

export default {
  fetchHottestTopic: () => instance.get('api/topics/hot.json'),

  fetchLatestTopic: () => instance.get('api/topics/latest.json'),

  fetchTopicById: (id: number) => instance.get(`api/topics/show.json?id=${id}`),

  fetchTopicByUsername: (username: string) =>
    instance.get(`api/topics/show.json?username=${username}`),

  fetchTopicByNodeName: (nodeName: string) =>
    instance.get(`api/topics/show.json?node_name=${nodeName}`),

  fetchTopicByNodeId: (nodeId: number) =>
    instance.get(`api/topics/show.json?node_id=${nodeId}`),

  fetchReplyById: (id: number) =>
    instance.get(`api/replies/show.json?topic_id=${id}`),

  thanksReplyById: (
    id: number,
    once: string,
  ): Promise<AxiosResponse<IThanksReplyResponse>> =>
    instance.post(`thank/reply/${id}?once=${once}`),
};
