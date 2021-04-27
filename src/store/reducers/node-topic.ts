import { TPending } from '@/interfaces/pending';
import { ITopic } from '@/interfaces/topic';
import { topicCrawler } from '@/services/crawler';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';
import { fetchMyNodes } from './user';

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

export const fetchTopicsCollection = createAsyncThunk<
  topicCrawler.ITopicCollectionResponse,
  { refresh: boolean },
  { state: RootState }
>('nodeTopic/fetchTopicsCollection', async (params, thunkApi) => {
  const { refresh } = params;
  const nextPage = refresh ? 1 : thunkApi.getState().nodeTopic.currPage + 1;
  const response = await topicCrawler.fetchTopicsCollection(nextPage);
  return response;
});

export const followNode = createAsyncThunk<
  topicCrawler.IFollowNodeResponse,
  { nodeCode: string; nodeName: string; once: string; isFollow: boolean },
  { state: RootState }
>('nodeTopic/followNode', async (params, thunkApi) => {
  const { nodeCode, nodeName, isFollow, once } = params;
  const response = await topicCrawler.followNode(
    nodeCode,
    nodeName,
    isFollow,
    once,
  );
  thunkApi.dispatch(fetchMyNodes());
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
  isNodeFollowed: boolean;
  nodeCode: string;
  once: string;
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
  isNodeFollowed: false,
  nodeCode: '',
  once: '',
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
          isNodeFollowed,
          nodeCode,
          once,
        } = action.payload;
        if (state.currPage === 0 || action.meta.arg.refresh) {
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
        state.isNodeFollowed = isNodeFollowed;
        state.nodeCode = nodeCode;
        state.once = once;
      })
      .addCase(fetchTopicsCollection.pending, (state, action) => {
        if (!action.meta.arg.refresh) {
          state.pending = 'pending';
        }
        state.isRefreshing = action.meta.arg.refresh;
      })
      .addCase(fetchTopicsCollection.fulfilled, (state, action) => {
        const { topicList, maxPage } = action.payload;
        if (state.currPage === 0 || action.meta.arg.refresh) {
          state.topicList = topicList;
        } else {
          state.topicList = state.topicList.concat(topicList);
        }
        state.maxPage = maxPage;
        state.pending = 'succeeded';
        state.isRefreshing = false;
        state.currPage += 1;
      })
      .addCase(followNode.fulfilled, (state, action) => {
        const { once, isNodeFollowed } = action.payload;
        state.once = once;
        state.isNodeFollowed = isNodeFollowed;
      });
  },
});

export const nodeTopicAction = nodeTopicSlice.actions;

export default nodeTopicSlice.reducer;
