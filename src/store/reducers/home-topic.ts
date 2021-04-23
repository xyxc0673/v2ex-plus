import { IReply } from '@/interfaces/reply';
import { ITopic } from '@/interfaces/topic';
import { topicService } from '@/services';
import { topicCrawler } from '@/services/crawler';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchHottestTopic = createAsyncThunk(
  'homeTopic/fetchHottestTopic',
  async () => {
    const reponse = await topicService.fetchHottestTopic();
    return reponse.data;
  },
);

export const fetchLatestTopic = createAsyncThunk(
  'homeTopic/fetchLatestTopic',
  async () => {
    const reponse = await topicService.fetchLatestTopic();
    return reponse.data;
  },
);

export const fetchTopicByTab = createAsyncThunk(
  'homeTopic/fetchTopicByTab',
  async (params: { tab: string; refresh: boolean }) => {
    const { tab } = params;
    const response = await topicCrawler.fetchTopicByTab(tab);
    return response;
  },
);

interface TopicState {
  topicList: Array<ITopic>;
  topicListMap: Record<string, Array<ITopic>>;
  currentTopic: ITopic;
  replyList: Array<IReply>;
  pending: string;
  isRefreshing: string;
}

const initialState: TopicState = {
  topicList: [] as Array<ITopic>,
  topicListMap: {} as Record<string, Array<ITopic>>,
  currentTopic: {} as ITopic,
  replyList: [] as Array<IReply>,
  pending: 'default',
  isRefreshing: 'default',
};

export const homeTopicSlice = createSlice({
  name: 'homeTopic',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopicByTab.pending, (state, action) => {
        const tab = action.meta.arg.tab;
        if (!action.meta.arg.refresh) {
          state.pending = tab;
        } else {
          state.isRefreshing = tab;
        }
      })
      .addCase(fetchTopicByTab.fulfilled, (state, action) => {
        const tab = action.meta.arg.tab;
        state.topicListMap = Object.assign({}, state.topicListMap, {
          [tab]: action.payload,
        });
        state.pending = 'default';
        state.isRefreshing = 'default';
      });
    5;
  },
});

export const homeTopicActions = homeTopicSlice.actions;

export default homeTopicSlice.reducer;
