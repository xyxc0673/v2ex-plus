import ITopic from '@/interfaces/topic';
import { createSlice } from '@reduxjs/toolkit';

export const topicSlice = createSlice({
  name: 'topic',
  initialState: {
    topicList: [] as Array<ITopic>,
  },
  reducers: {},
});

export default topicSlice.reducer;
