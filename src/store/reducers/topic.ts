import { TPending } from '@/interfaces/pending';
import { IReply } from '@/interfaces/reply';
import { ITopic } from '@/interfaces/topic';
import { topicService } from '@/services';
import { topicCrawler } from '@/services/crawler';
import { IThanksReplyResponse } from '@/services/topic';
import { Alert } from '@/utils';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import { historyActions } from './history';
import { userActions } from './user';

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
    const {
      topic: currentTopic,
      unread,
      myFavNodeCount,
      myFavTopicCount,
      myFollowingCount,
    } = response;

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
    thunkApi.dispatch(
      userActions.setUserBox({
        unread,
        myFavNodeCount,
        myFavTopicCount,
        myFollowingCount,
      }),
    );
    return response;
  },
);

interface IThanksReplyThunkResponse extends IThanksReplyResponse {
  index: number;
}

export const thanksReplyById = createAsyncThunk<
  IThanksReplyThunkResponse,
  { replyId: number; index: number },
  { state: RootState }
>('topic/thanksReplyById', async (params, thunkApi) => {
  const response = await topicService.thanksReplyById(
    params.replyId,
    thunkApi.getState().topic.once,
  );
  return { ...response.data, index: params.index };
});

export const replyTopic = createAsyncThunk<
  topicCrawler.IReplyResponse,
  { topicId: number },
  { state: RootState }
>('topic/replyTopic', async (params, thunkApi) => {
  const { once, replyContent } = thunkApi.getState().topic;
  const response = await topicCrawler.replyByTopicId(
    params.topicId,
    replyContent,
    once,
  );
  const { problemList } = response;
  if (problemList.length > 0) {
    const problemText = response.problemList.reduce(
      (prev, curr) => `${prev}\n${curr}`,
    );
    Alert.alert({
      message: `回复失败，请检查以下问题:\n${problemText}`,
      onPress: () => {},
    });
  }
  return response;
});

interface TopicState {
  topicList: Array<ITopic>;
  currentTopic: ITopic;
  replyList: Array<IReply>;
  pending: TPending;
  isRefreshing: boolean;
  once: string;
  replyContent: string;
  isReplying: boolean;
}

const initialState: TopicState = {
  topicList: [] as Array<ITopic>,
  currentTopic: {} as ITopic,
  replyList: [] as Array<IReply>,
  pending: 'idle',
  isRefreshing: false,
  once: '',
  replyContent: '',
  isReplying: false,
};

export const topicSlice = createSlice({
  name: 'topic',
  initialState: initialState,
  reducers: {
    setReplyContent: (state, action: PayloadAction<string>) => {
      state.replyContent = action.payload;
    },
  },
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
      })
      .addCase(thanksReplyById.fulfilled, (state, action) => {
        const { index, success, once } = action.payload;
        if (success) {
          state.replyList[index].thanked = true;
          state.replyList[index].thanks += 1;
        }
        state.once = once;
      })
      .addCase(replyTopic.pending, (state, _) => {
        state.isReplying = true;
      })
      .addCase(replyTopic.fulfilled, (state, action) => {
        const { topic, replyList } = action.payload;
        // only replace list when less than 100 replies
        if (topic.replyCount <= 100) {
          state.replyList = replyList;
          state.currentTopic = topic;
        }
        state.once = action.payload.once;
        state.isReplying = false;
        state.replyContent = '';
      });
    5;
  },
});

export const topicActions = topicSlice.actions;

export default topicSlice.reducer;
