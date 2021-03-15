import { IReply } from '@/interfaces/reply';
import { ITopic } from '@/interfaces/topic';
import { topicService } from '@/services';
import { topicCrawler } from '@/services/crawler';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

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
  async (tab: string) => {
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
  async (params: { topicId: number; page: number }) => {
    const response = await topicCrawler.fetchTopicDetails(
      params.topicId,
      params.page,
    );
    return response;
  },
);

export const topicSlice = createSlice({
  name: 'topic',
  initialState: {
    topicList: [] as Array<ITopic>,
    currentTopic: {} as ITopic,
    replyList: [] as Array<IReply>,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopicById.pending, (state) => {
        state.currentTopic = {} as ITopic;
        state.replyList = [];
      })
      .addCase(fetchTopicByTab.fulfilled, (state, action) => {
        state.topicList = action.payload;
      })
      .addCase(fetchTopicDetails.fulfilled, (state, action) => {
        state.currentTopic = action.payload.topic;
        state.replyList = action.payload.replyList;
      });
    5;
  },
});

export default topicSlice.reducer;
