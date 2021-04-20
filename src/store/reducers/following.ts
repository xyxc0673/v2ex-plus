import { TPending } from '@/interfaces/pending';
import { userCrawler } from '@/services/crawler';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';

export const fetchFollowing = createAsyncThunk<
  { followingList: Array<userCrawler.IFollowing> },
  { refresh: boolean },
  { state: RootState }
>('following/fetchFollowing', async (params, thunkApi) => {
  const { refresh } = params;
  const nextPage = refresh ? 1 : thunkApi.getState().nodeTopic.currPage + 1;
  const response = await userCrawler.fetchMyFollowing();
  return response;
});

interface TopicState {
  followingList: Array<userCrawler.IFollowing>;
  pending: TPending;
  isRefreshing: boolean;
  maxPage: number | undefined;
  currPage: number;
}

const initialState: TopicState = {
  followingList: [],
  pending: 'idle',
  isRefreshing: false,
  maxPage: undefined,
  currPage: 0,
};

export const followingSlice = createSlice({
  name: 'following',
  initialState: initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchFollowing.pending, (state, action) => {
        if (!action.meta.arg.refresh) {
          state.pending = 'pending';
        }
        state.isRefreshing = action.meta.arg.refresh;
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        const { followingList } = action.payload;
        state.followingList = followingList;
        state.pending = 'succeeded';
        state.isRefreshing = false;
      });
  },
});

export const followingActions = followingSlice.actions;

export default followingSlice.reducer;
