import { IReply } from '@/interfaces/reply';
import { ITopic } from '@/interfaces/topic';
import { IUser } from '@/interfaces/user';
import { topicService, userService } from '@/services';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchUserInfoById = createAsyncThunk(
  'topic/fetchUserInfoById',
  async (userId: number) => {
    const reponse = await userService.fetchUserInfoById(userId);
    return reponse.data;
  },
);

export const fetchUserTopics = createAsyncThunk(
  'topic/fetchUserTopics',
  async (username: string) => {
    const reponse = await topicService.fetchTopicByUsername(username);
    return reponse.data;
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: {} as IUser,
    userTopicList: [] as Array<ITopic>,
    userReplyList: [] as Array<IReply>,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfoById.pending, (state) => {
        state.userInfo = {} as IUser;
        state.userTopicList = [];
        state.userReplyList = [];
      })
      .addCase(fetchUserInfoById.fulfilled, (state, action) => {
        state.userInfo = action.payload;
      })
      .addCase(fetchUserTopics.fulfilled, (state, action) => {
        state.userTopicList = action.payload;
      });
    5;
  },
});

export default userSlice.reducer;
