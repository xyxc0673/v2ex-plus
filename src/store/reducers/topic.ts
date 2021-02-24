import { ITopic } from '@/interfaces/topic';
import { topicService } from '@/services';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

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

export const topicSlice = createSlice({
  name: 'topic',
  initialState: {
    topicList: [] as Array<ITopic>,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchHottestTopic.fulfilled, (state, action) => {
      state.topicList = action.payload;
    });
  },
});

export default topicSlice.reducer;
