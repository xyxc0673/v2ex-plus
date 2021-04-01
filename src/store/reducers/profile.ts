import { userCrawler } from '@/services/crawler';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IUser } from '@/interfaces/user';
import { ITopic } from '@/interfaces/topic';
import { IUserReply } from '@/interfaces/userReply';

export const fetchUserTopics = createAsyncThunk(
  'user/fetchUserTopics',
  async (params: { username: string; page: number }) => {
    const response = await userCrawler.fetchUserTopics(
      params.username,
      params.page,
    );
    return response;
  },
);

export const fetchUserReplies = createAsyncThunk(
  'user/fetchUserReplies',
  async (params: { username: string; page: number }) => {
    const response = await userCrawler.fetchUserReplies(
      params.username,
      params.page,
    );
    return response;
  },
);

export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (username: string) => {
    const response = await userCrawler.fetchUserProfile(username);
    return response;
  },
);

type ProfileState = {
  userInfo: IUser;
  userTopicList: Array<ITopic>;
  userReplyList: Array<IUserReply>;
  userTopicCount: number;
  userReplyCount: number;
  once: string | undefined;
};

const initialState: ProfileState = {
  userInfo: {} as IUser,
  userTopicList: [] as Array<ITopic>,
  userReplyList: [] as Array<IUserReply>,
  userTopicCount: 0,
  userReplyCount: 0,
  once: undefined,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState: initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.userInfo = action.payload.profile;
        state.once = action.payload.once;
      })
      .addCase(fetchUserTopics.fulfilled, (state, action) => {
        state.userTopicList = action.payload.topicList;
        state.userTopicCount = action.payload.topicCount;
      })
      .addCase(fetchUserReplies.fulfilled, (state, action) => {
        state.userReplyList = action.payload.replyList;
        state.userReplyCount = action.payload.replyCount;
      });
    5;
  },
});

export const profileActions = profileSlice.actions;
export default profileSlice.reducer;
