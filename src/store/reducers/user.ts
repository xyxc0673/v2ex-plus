import { IBalance } from '@/interfaces/balance';
import { ILoginParams } from '@/interfaces/user';
import { userService } from '@/services';
import { parser, userCrawler } from '@/services/crawler';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMyNode } from '@/interfaces/node';
import { Alert } from '@/utils';
import { goBack } from '@/navigations/root';

export const fetchUserInfoById = createAsyncThunk(
  'user/fetchUserInfoById',
  async (userId: number) => {
    const response = await userService.fetchUserInfoById(userId);
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
  async (
    loginData: {
      username: string;
      password: string;
      captcha: string;
      loginParams: ILoginParams;
    },
    thunkApi,
  ) => {
    const { username, password, captcha, loginParams } = loginData;
    const response = await userCrawler.login(
      username,
      password,
      captcha,
      loginParams,
    );
    if (response.isLogged) {
      goBack();
    } else {
      const problemText = response.problemList.reduce(
        (prev, curr) => `${prev}\n${curr}`,
      );
      Alert.alert({
        message: `登录失败，请检查以下问题:\n${problemText}`,
        onPress: () => {
          thunkApi.dispatch(fetchLoginParams());
        },
      });
    }
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

export const fetchMyNodes = createAsyncThunk('user/fetchMyNodes', async () => {
  const response = await userCrawler.fetchMyNodes();
  return response;
});

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    loginParams: {} as ILoginParams,
    isLogged: false,
    cookies: [] as Array<string>,
    balance: {} as IBalance,
    user: {} as userCrawler.IUserInfo,
    once: '',
    myNodeList: [] as Array<IMyNode>,
    loginProblemList: [] as Array<string>,
    unread: 0,
    myFavNodeCount: 0,
    myFavTopicCount: 0,
    myFollowingCount: 0,
  },
  reducers: {
    setUserBox: (state, action: PayloadAction<parser.IUserBox>) => {
      const {
        unread,
        myFavNodeCount,
        myFavTopicCount,
        myFollowingCount,
      } = action.payload;

      state.unread = unread;
      state.myFavNodeCount = myFavNodeCount;
      state.myFavTopicCount = myFavTopicCount;
      state.myFollowingCount = myFollowingCount;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoginParams.fulfilled, (state, action) => {
        state.loginParams = action.payload;
      })
      .addCase(loginByUsername.fulfilled, (state, action) => {
        state.isLogged = action.payload.isLogged;
        state.cookies = action.payload.cookies;
        state.loginProblemList = action.payload.problemList;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        const {
          balance,
          unread,
          myFavNodeCount,
          myFavTopicCount,
          myFollowingCount,
        } = action.payload;

        state.balance = balance;
        state.unread = unread;
        state.myFavNodeCount = myFavNodeCount;
        state.myFavTopicCount = myFavTopicCount;
        state.myFollowingCount = myFollowingCount;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchMyNodes.fulfilled, (state, action) => {
        state.myNodeList = action.payload;
      });

    5;
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
