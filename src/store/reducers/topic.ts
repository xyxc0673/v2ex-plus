import { IReply } from '@/interfaces/reply';
import { ITopic } from '@/interfaces/topic';
import { topicService } from '@/services';
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

export const fetchRepliesById = createAsyncThunk(
  'topic/fetchRepliesById',
  async (topicId: number) => {
    const response = await topicService.fetchReplyById(topicId);
    return response.data;
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
      .addCase(fetchHottestTopic.fulfilled, (state, action) => {
        state.topicList = action.payload;
      })
      .addCase(fetchTopicById.fulfilled, (state, action) => {
        state.currentTopic = action.payload[0];
      })
      .addCase(fetchRepliesById.fulfilled, (state, action) => {
        state.replyList = action.payload;
      });
    5;
  },
});

export default topicSlice.reducer;
