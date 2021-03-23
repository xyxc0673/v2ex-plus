import { userCrawler } from '@/services/crawler';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { INotification } from '@/interfaces/notification';
import { TPending } from '@/interfaces/pending';
import { INotificationResponse } from '@/services/crawler/user';

interface IParams {
  refresh: boolean;
}

export const fetchUserNotifications = createAsyncThunk<
  INotificationResponse,
  IParams,
  { state: NotificationState }
>('user/fetchUserNotifications', async (params, thunkApi) => {
  const { currentPage } = thunkApi.getState();
  const response = await userCrawler.fetchUserNotifications(currentPage + 1);
  return response;
});

type NotificationState = {
  list: Array<INotification>;
  maxPage: number;
  currentPage: number;
  pending: TPending;
  isRefreshing: boolean;
};

const initialState: NotificationState = {
  list: [],
  maxPage: 0,
  currentPage: 0,
  pending: 'idle',
  isRefreshing: false,
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserNotifications.pending, (state, action) => {
        if (!action.meta.arg.refresh) {
          state.pending = 'pending';
          state.list = [];
        }
        state.isRefreshing = action.meta.arg.refresh;
      })
      .addCase(fetchUserNotifications.rejected, (state, _) => {
        state.pending = 'failed';
        state.isRefreshing = false;
      })
      .addCase(fetchUserNotifications.fulfilled, (state, action) => {
        if (!action.meta.arg.refresh) {
          state.currentPage += 1;
        }
        state.list = action.payload.notifications;
        state.maxPage = action.payload.maxPage;
      });
    5;
  },
});

export default notificationSlice.reducer;
