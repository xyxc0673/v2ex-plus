import { IBalance } from '@/interfaces/balance';
import { ILoginParams } from '@/interfaces/user';
import { userService } from '@/services';
import { parser, userCrawler } from '@/services/crawler';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMyNode } from '@/interfaces/node';
import { Alert } from '@/utils';
import { goBack } from '@/navigations/root';
import Toast from 'react-native-toast-message';
import dayjs from 'dayjs';
import { CONSTANTS } from '@/config';

/**
 * 通过 ID 获取用户信息
 */
export const fetchUserInfoById = createAsyncThunk(
  'user/fetchUserInfoById',
  async (userId: number) => {
    const response = await userService.fetchUserInfoById(userId);
    return response.data;
  },
);

/**
 * 获取登录参数
 */
export const fetchLoginParams = createAsyncThunk(
  'user/fetchLoginParams',
  async () => {
    const response = await userCrawler.getLoginParams();
    return response;
  },
);

/**
 * 通过账号密码登录
 */
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
      // 根据返回的错误信息弹出提示
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

/**
 * 获取余额
 */
export const fetchBalance = createAsyncThunk('user/fetchBalance', async () => {
  const response = await userCrawler.fetchBalance();
  return response;
});

/**
 * 获取登录用户的信息
 */
export const fetchUserInfo = createAsyncThunk(
  'user/fetchUserInfo',
  async () => {
    const response = await userCrawler.fetchUserInfo();
    return response;
  },
);

/**
 * 获取收藏的节点
 */
export const fetchMyNodes = createAsyncThunk('user/fetchMyNodes', async () => {
  const response = await userCrawler.fetchMyNodes();
  return response;
});

/**
 * 签到
 */
export const dailyMission = createAsyncThunk(
  'user/dailyMission',
  async (sign: boolean = true) => {
    const response = await userCrawler.dailySignIn(sign);

    return response;
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    loginParams: {} as ILoginParams, // 登录参数
    isLogged: false, // 是否登录
    cookies: [] as Array<string>, // 登录成功的 cookies
    balance: {} as IBalance, // 余额
    user: {} as userCrawler.IUserInfo, // 登录用户的信息
    once: '', // csrf 值
    myNodeList: [] as Array<IMyNode>, // 收藏的节点
    loginProblemList: [] as Array<string>, // 登录失败的问题
    unread: 0, // 未读消息数
    myFavNodeCount: 0, // 收藏节点数
    myFavTopicCount: 0, // 收藏主题数
    myFollowingCount: 0, // 关注人数
    isSigned: false, // 是否签到
    signDays: 0, // 连续签到天数
    signDate: '', // 最近 App 的签到日期
  },
  reducers: {
    /**
     * 用于更新一些用户信息
     */
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
      })
      .addCase(dailyMission.fulfilled, (state, action) => {
        const { isSigned, days } = action.payload;

        const today = dayjs().format(CONSTANTS.SIGN_DATE_FORMAT);

        // only show toast when signed at first time today
        if (isSigned && state.signDate !== today) {
          Toast.show({
            text1: '签到成功！',
            text2: `连续签到 ${days} 天`,
            type: 'success',
          });
          state.signDate = today;
        }

        state.isSigned = isSigned;
        state.signDays = days;
      });
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
