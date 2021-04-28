import { INodeSection } from '@/interfaces/node';
import { nodeCrawler } from '@/services/crawler';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchIndexNodes = createAsyncThunk(
  'node/fetchIndexNodes',
  async () => {
    const response = await nodeCrawler.fetchIndexNodes();
    return response;
  },
);

export const nodeSlice = createSlice({
  name: 'node',
  initialState: {
    cateNodeList: [] as Array<INodeSection>,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchIndexNodes.fulfilled, (state, action) => {
      state.cateNodeList = action.payload;
    });
  },
});

export default nodeSlice.reducer;
