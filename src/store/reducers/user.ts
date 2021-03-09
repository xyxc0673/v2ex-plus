import { IReply } from '@/interfaces/reply';
import { ITopic } from '@/interfaces/topic';
import { IBalance } from '@/interfaces/balance';
import { ILoginParams, IUser } from '@/interfaces/user';
import { topicService, userService } from '@/services';
import { userCrawler } from '@/services/crawler';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchUserInfoById = createAsyncThunk(
  'user/fetchUserInfoById',
  async (userId: number) => {
    const response = await userService.fetchUserInfoById(userId);
    return response.data;
  },
);

export const fetchUserTopics = createAsyncThunk(
  'user/fetchUserTopics',
  async (username: string) => {
    const response = await topicService.fetchTopicByUsername(username);
    return response.data;
  },
);

export const fetchLoginParams = createAsyncThunk(
  'user/fetchLoginParams',
  async () => {
    const response = await userCrawler.getLoginParams();
    return response;
  },
);

export const loginByUsername = createAsyncThunk(
  'user/loginByUsername',
  async (loginData: {
    username: string;
    password: string;
    captcha: string;
    loginParams: ILoginParams;
  }) => {
    const { username, password, captcha, loginParams } = loginData;
    const response = await userCrawler.login(
      username,
      password,
      captcha,
      loginParams,
    );
    return response;
  },
);

export const fetchBalance = createAsyncThunk('user/fetchBalance', async () => {
  const response = await userCrawler.fetchBalance();
  return response;
});

export const fetchUserInfo = createAsyncThunk(
  'user/fetchUserInfo',
  async () => {
    const response = await userCrawler.fetchUserInfo();
    return response;
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: {} as IUser,
    userTopicList: [] as Array<ITopic>,
    userReplyList: [] as Array<IReply>,
    loginParams: {} as ILoginParams,
    isLogged: false,
    cookies: [] as Array<string>,
    balance: {} as IBalance,
    user: {} as userCrawler.IUserInfo,
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
      })
      .addCase(fetchLoginParams.fulfilled, (state, action) => {
        state.loginParams = action.payload;
      })
      .addCase(loginByUsername.fulfilled, (state, action) => {
        state.isLogged = action.payload.isLogged;
        state.cookies = action.payload.cookies;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.balance = action.payload;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.user = action.payload;
      });
    5;
  },
});

export default userSlice.reducer;
