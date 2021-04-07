import { TPending } from '@/interfaces/pending';
import { ITopic } from '@/interfaces/topic';
import { topicCrawler } from '@/services/crawler';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';

export const fetchTopicsByNode = createAsyncThunk<
  topicCrawler.ITopicNodeResponse,
  { tab: string; refresh: boolean },
  { state: RootState }
>('nodeTopic/fetchTopicsByNode', async (params, thunkApi) => {
  const { tab, refresh } = params;
  const nextPage = refresh ? 1 : thunkApi.getState().nodeTopic.currPage + 1;
  const response = await topicCrawler.fetchTopicsByNode(tab, nextPage);
  return response;
});

interface TopicState {
  topicList: Array<ITopic>;
  pending: TPending;
  isRefreshing: boolean;
  topicCount: number;
  nodeIcon: string;
  nodeIntro: string;
  maxPage: number | undefined;
  currPage: number;
}

const initialState: TopicState = {
  topicList: [] as Array<ITopic>,
  pending: 'idle',
  isRefreshing: false,
  topicCount: 0,
  nodeIcon: '',
  nodeIntro: '',
  maxPage: undefined,
  currPage: 0,
};

export const nodeTopicSlice = createSlice({
  name: 'nodeTopic',
  initialState: initialState,
  reducers: {
    resetNodeTopic: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopicsByNode.pending, (state, action) => {
        if (!action.meta.arg.refresh) {
          state.pending = 'pending';
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
        if (state.currPage === 0) {
          state.topicList = topicList;
        } else {
          state.topicList = state.topicList.concat(topicList);
        }
        state.topicCount = topicCount;
        state.nodeIcon = nodeIcon;
        state.nodeIntro = nodeIntro;
        state.maxPage = maxPage;
        state.pending = 'succeeded';
        state.isRefreshing = false;
        state.currPage += 1;
      });
    5;
  },
});

export const nodeTopicAction = nodeTopicSlice.actions;

export default nodeTopicSlice.reducer;
