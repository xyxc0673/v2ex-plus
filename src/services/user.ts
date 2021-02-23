import instance from './request';

export default {
  fetchUserInfoById: (id: number) =>
    instance.get(`api/members/show.json?id=${id}`),
  fetchUserInfoByName: (username: string) =>
    instance.get(`api/members/show.json?username=${username}`),
};
