import { NODE_TABS } from '@/config/tabs';
import { TPending } from '@/interfaces/pending';
import { IReply } from '@/interfaces/reply';
import { ITopic } from '@/interfaces/topic';
import { topicCrawler } from '@/services/crawler';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

/**
 * 通过 tab 获取主题列表
 */
export const fetchTopicByTab = createAsyncThunk(
  'homeTopic/fetchTopicByTab',
  async (params: { tab: string; refresh: boolean }) => {
    const { tab } = params;
    const response = await topicCrawler.fetchTopicByTab(tab);
    return response;
  },
);

/**
 * 获取最近的主题列表
 */
export const fetchRecentTopics = createAsyncThunk(
  'homeTopic/fetchRecentTopic',
  async (params: { page: number }) => {
    const { page } = params;
    const response = await topicCrawler.fetchRecentTopics(page);
    return response;
  },
);

interface IMapData {
  pending: TPending;
  refreshing: boolean;
  error: undefined | string;
  data: Array<ITopic>;
}

interface ITopicListMap {
  [index: string]: IMapData;
}

interface TopicState {
  topicList: Array<ITopic>;
  topicListMap: ITopicListMap;
  replyList: Array<IReply>;
  recentPage: number;
}

const initialState: TopicState = (() => {
  const map: ITopicListMap = {};

  // 遍历首页节点生成默认的数据
  Object.values(NODE_TABS).forEach((tab) => {
    map[tab] = {
      pending: 'pending',
      refreshing: false,
      error: undefined,
      data: [] as Array<ITopic>,
    };
  });

  return {
    topicList: [] as Array<ITopic>,
    topicListMap: map,
    replyList: [] as Array<IReply>,
    recentPage: 0,
  };
})();

export const homeTopicSlice = createSlice({
  name: 'homeTopic',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopicByTab.pending, (state, action) => {
        const tab = action.meta.arg.tab;
        if (!action.meta.arg.refresh) {
          state.topicListMap[tab].pending = 'pending';
        } else {
          state.topicListMap[tab].refreshing = true;
        }
      })
      .addCase(fetchTopicByTab.fulfilled, (state, action) => {
        const tab = action.meta.arg.tab;
        state.topicListMap[tab].data = action.payload;
        state.topicListMap[tab].pending = 'succeeded';
        state.topicListMap[tab].refreshing = false;
      })
      .addCase(fetchRecentTopics.pending, (state, _) => {
        // 添加数据到 NODE_TABS.ALL 节点中
        state.topicListMap.all.pending = 'pending';
      })
      .addCase(fetchRecentTopics.fulfilled, (state, action) => {
        // 添加数据到 NODE_TABS.ALL 节点中
        const oldList = state.topicListMap.all.data;
        state.topicListMap.all.data = oldList.concat(action.payload);
        state.recentPage += 1;
        state.topicListMap.all.pending = 'succeeded';
      });
  },
});

export const homeTopicActions = homeTopicSlice.actions;

export default homeTopicSlice.reducer;
