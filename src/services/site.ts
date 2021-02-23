import instance from './request';

export default {
  fetchSiteInfo: () => instance.get('api/site/info.json'),

  fetchSiteStats: () => instance.get('api/site/stats.json'),
};
