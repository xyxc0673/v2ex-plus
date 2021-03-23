import { userCrawler } from '@/services/crawler';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { INotification } from '@/interfaces/notification';
import { TPending } from '@/interfaces/pending';
import { INotificationResponse } from '@/services/crawler/user';
import { RootState } from '..';

interface IParams {
  refresh: boolean;
  isFirstFetching?: boolean;
}

export const fetchUserNotifications = createAsyncThunk<
  INotificationResponse,
  IParams,
  { state: RootState }
>('user/fetchUserNotifications', async (params, thunkApi) => {
  const { notification } = thunkApi.getState();
  const { currentPage } = notification;
  const nextPage =
    params.refresh || params.isFirstFetching ? 1 : currentPage + 1;
  const response = await userCrawler.fetchUserNotifications(nextPage);
  return response;
});

type NotificationState = {
  list: Array<INotification>;
  maxPage: number;
  currentPage: number;
  pending: TPending;
  isRefreshing: boolean;
  isFirstFetching: boolean;
};

const initialState: NotificationState = {
  list: [],
  maxPage: 0,
  currentPage: 0,
  pending: 'idle',
  isRefreshing: false,
  isFirstFetching: true,
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserNotifications.pending, (state, action) => {
        const { refresh, isFirstFetching } = action.meta.arg;
        if (isFirstFetching) {
          state.list = [];
        }
        state.isFirstFetching = isFirstFetching || false;
        state.pending = 'pending';
        state.isRefreshing = refresh;
      })
      .addCase(fetchUserNotifications.rejected, (state, _) => {
        state.pending = 'failed';
        state.isRefreshing = false;
      })
      .addCase(fetchUserNotifications.fulfilled, (state, action) => {
        const { isFirstFetching, refresh } = action.meta.arg;
        if (isFirstFetching || refresh) {
          state.currentPage = 1;
          state.list = action.payload.notifications;
        } else {
          state.currentPage += 1;
          state.list = state.list.concat(action.payload.notifications);
        }
        state.maxPage = action.payload.maxPage;
        state.isRefreshing = false;
        state.pending = 'succeeded';
      });
    5;
  },
});

export default notificationSlice.reducer;
