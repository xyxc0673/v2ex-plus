import instance from './request';

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
};
