import { TPending } from '@/interfaces/pending';
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
  currentTopic: ITopic;
  replyList: Array<IReply>;
  pending: TPending;
  isRefreshing: boolean;
}

const initialState: TopicState = {
  topicList: [] as Array<ITopic>,
  currentTopic: {} as ITopic,
  replyList: [] as Array<IReply>,
  pending: 'idle',
  isRefreshing: false,
};

export const homeTopicSlice = createSlice({
  name: 'homeTopic',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopicByTab.pending, (state, action) => {
        if (!action.meta.arg.refresh) {
          state.pending = 'pending';
          state.topicList = [];
        }
        state.isRefreshing = action.meta.arg.refresh;
      })
      .addCase(fetchTopicByTab.fulfilled, (state, action) => {
        state.topicList = action.payload;
        state.pending = 'succeeded';
        state.isRefreshing = false;
      });
    5;
  },
});

export const homeTopicActions = homeTopicSlice.actions;

export default homeTopicSlice.reducer;
