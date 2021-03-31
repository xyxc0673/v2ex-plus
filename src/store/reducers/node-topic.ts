import { TPending } from '@/interfaces/pending';
import { ITopic } from '@/interfaces/topic';
import { topicCrawler } from '@/services/crawler';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchTopicsByNode = createAsyncThunk(
  'topic/fetchTopicsByNode',
  async (params: { tab: string; refresh: boolean }) => {
    const { tab } = params;
    const response = await topicCrawler.fetchTopicsByNode(tab);
    return response;
  },
);

interface TopicState {
  topicList: Array<ITopic>;
  pending: TPending;
  isRefreshing: boolean;
  topicCount: number;
  nodeIcon: string;
  nodeIntro: string;
  maxPage: number | undefined;
  currentPage: number;
}

const initialState: TopicState = {
  topicList: [] as Array<ITopic>,
  pending: 'idle',
  isRefreshing: false,
  topicCount: 0,
  nodeIcon: '',
  nodeIntro: '',
  maxPage: undefined,
  currentPage: 0,
};

export const nodeTopicSlice = createSlice({
  name: 'topic',
  initialState: initialState,
  reducers: {
    resetNodeTopic: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopicsByNode.pending, (state, action) => {
        if (!action.meta.arg.refresh) {
          state.pending = 'pending';
          state.topicList = [];
        }
        state.isRefreshing = action.meta.arg.refresh;
      })
      .addCase(fetchTopicsByNode.fulfilled, (state, action) => {
        const {
          topicList,
          topicCount,
          nodeIcon,
          nodeIntro,
          maxPage,
        } = action.payload;
        state.topicList = topicList;
        state.topicCount = topicCount;
        state.nodeIcon = nodeIcon;
        state.nodeIntro = nodeIntro;
        state.maxPage = maxPage;
        state.pending = 'succeeded';
        state.isRefreshing = false;
      });
    5;
  },
});

export const nodeTopicAction = nodeTopicSlice.actions;

export default nodeTopicSlice.reducer;
