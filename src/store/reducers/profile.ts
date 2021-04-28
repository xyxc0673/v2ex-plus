import { userCrawler } from '@/services/crawler';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IUser } from '@/interfaces/user';
import { ITopic } from '@/interfaces/topic';
import { IUserReply } from '@/interfaces/userReply';
import { RootState } from '..';

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

export const followUser = createAsyncThunk<
  userCrawler.IFollowUserResponse,
  { userId: number; username: string; once: string; isFollow: boolean },
  { state: RootState }
>('profile/followUser', async (params) => {
  const { userId, username, isFollow, once } = params;
  const response = await userCrawler.followUser(
    userId,
    username,
    isFollow,
    once,
  );
  return response;
});

type ProfileState = {
  userInfo: IUser;
  userTopicList: Array<ITopic>;
  userReplyList: Array<IUserReply>;
  userTopicCount: number;
  userReplyCount: number;
  once: string;
  isTopicsHidden: boolean;
  isUserFollowed: boolean;
};

const initialState: ProfileState = {
  userInfo: {} as IUser,
  userTopicList: [] as Array<ITopic>,
  userReplyList: [] as Array<IUserReply>,
  userTopicCount: 0,
  userReplyCount: 0,
  once: '',
  isTopicsHidden: false,
  isUserFollowed: false,
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
        state.isTopicsHidden = action.payload.isHidden;
        state.isUserFollowed = action.payload.isUserFollowed;
      })
      .addCase(fetchUserTopics.fulfilled, (state, action) => {
        state.userTopicList = action.payload.topicList;
        state.userTopicCount = action.payload.topicCount;
      })
      .addCase(fetchUserReplies.fulfilled, (state, action) => {
        state.userReplyList = action.payload.replyList;
        state.userReplyCount = action.payload.replyCount;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        const { once, isUserFollowed } = action.payload;
        state.once = once;
        state.isUserFollowed = isUserFollowed;
      });
  },
});

export const profileActions = profileSlice.actions;
export default profileSlice.reducer;
