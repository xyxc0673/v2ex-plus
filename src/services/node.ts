import instance from './request';

export default {
  fetchNodeInfoById: (id: string) =>
    instance.get(`api/nodes/show.json?id=${id}`),

  fetchNodeInfoByName: (nodeName: string) =>
    instance.get(`api/nodes/show.json?name=${nodeName}`),

  fetchAllNode: () => instance.get('api/nodes/all.json'),
};
