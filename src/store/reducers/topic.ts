import { TPending } from '@/interfaces/pending';
import { IReply } from '@/interfaces/reply';
import { ITopic } from '@/interfaces/topic';
import { topicService } from '@/services';
import { topicCrawler } from '@/services/crawler';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { historyActions } from './history';

export const fetchHottestTopic = createAsyncThunk(
  'topic/fetchHottestTopic',
  async () => {
    const reponse = await topicService.fetchHottestTopic();
    return reponse.data;
  },
);

export const fetchLatestTopic = createAsyncThunk(
  'topic/fetchLatestTopic',
  async () => {
    const reponse = await topicService.fetchLatestTopic();
    return reponse.data;
  },
);

export const fetchTopicById = createAsyncThunk(
  'topic/fetchTopicById',
  async (topicId: number) => {
    const response = await topicService.fetchTopicById(topicId);
    return response.data;
  },
);

export const fetchTopicByTab = createAsyncThunk(
  'topic/fetchTopicByTab',
  async (params: { tab: string; refresh: boolean }) => {
    const { tab } = params;
    const response = await topicCrawler.fetchTopicByTab(tab);
    return response;
  },
);

export const fetchRepliesById = createAsyncThunk(
  'topic/fetchRepliesById',
  async (topicId: number) => {
    const response = await topicService.fetchReplyById(topicId);
    return response.data;
  },
);

export const fetchTopicDetails = createAsyncThunk(
  'topic/fetchTopicDetails',
  async (params: { topicId: number; page: number }, thunkApi) => {
    const response = await topicCrawler.fetchTopicDetails(
      params.topicId,
      params.page,
    );
    const { topic: currentTopic } = response;
    thunkApi.dispatch(
      historyActions.add({
        id: currentTopic.id,
        title: currentTopic.title,
        author: currentTopic.author,
        avatar: currentTopic.avatar,
        nodeTitle: currentTopic.nodeTitle,
        recordedAt: new Date().getTime(),
      }),
    );
    return response;
  },
);

interface TopicState {
  topicList: Array<ITopic>;
  currentTopic: ITopic;
  replyList: Array<IReply>;
  pending: TPending;
  isRefreshing: boolean;
  once: string;
}

const initialState: TopicState = {
  topicList: [] as Array<ITopic>,
  currentTopic: {} as ITopic,
  replyList: [] as Array<IReply>,
  pending: 'idle',
  isRefreshing: false,
  once: '',
};

export const topicSlice = createSlice({
  name: 'topic',
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
      .addCase(fetchTopicDetails.pending, (state, _) => {
        state.currentTopic = {} as ITopic;
        state.replyList = [];
        state.pending = 'pending';
      })
      .addCase(fetchTopicByTab.fulfilled, (state, action) => {
        state.topicList = action.payload;
        state.pending = 'succeeded';
        state.isRefreshing = false;
      })

      .addCase(fetchTopicDetails.fulfilled, (state, action) => {
        state.currentTopic = action.payload.topic;
        state.replyList = action.payload.replyList;
        state.once = action.payload.once;
        state.pending = 'succeeded';
      });
    5;
  },
});

export default topicSlice.reducer;
