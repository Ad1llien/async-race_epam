import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import * as carsApi from '../../api/carsApi';
import * as winnersApi from '../../api/winnersApi';
import { WINNERS_PAGE_SIZE } from '../../utils/constants';
import type { Car } from '../../types/car';
import type { SortOrder, Winner, WinnerSortField } from '../../types/winner';
import type { RootState } from '../../store/store';

export interface WinnerRow extends Winner {
  car: Car | null;
}

export interface WinnersState {
  rows: WinnerRow[];
  totalCount: number;
  page: number;
  sortBy: WinnerSortField;
  sortOrder: SortOrder;
}

const initialState: WinnersState = {
  rows: [],
  totalCount: 0,
  page: 1,
  sortBy: 'id',
  sortOrder: 'ASC',
};

async function attachCar(winner: Winner): Promise<WinnerRow> {
  try {
    const car = await carsApi.fetchCar(winner.id);
    return { ...winner, car };
  } catch {
    return { ...winner, car: null };
  }
}

export const loadWinnersPage = createAsyncThunk(
  'winners/loadPage',
  async (_: void, { getState }) => {
    const { page, sortBy, sortOrder } = (getState() as RootState).winners;
    const { data, totalCount } = await winnersApi.fetchWinners(
      page,
      WINNERS_PAGE_SIZE,
      sortBy,
      sortOrder,
    );
    const rows = await Promise.all(data.map(attachCar));
    return { rows, totalCount };
  },
);

const winnersSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {
    setWinnersPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setWinnersSort(state, action: PayloadAction<WinnerSortField>) {
      if (state.sortBy === action.payload) {
        state.sortOrder = state.sortOrder === 'ASC' ? 'DESC' : 'ASC';
      } else {
        state.sortBy = action.payload;
        state.sortOrder = 'ASC';
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadWinnersPage.fulfilled, (state, action) => {
      state.rows = action.payload.rows;
      state.totalCount = action.payload.totalCount;
    });
  },
});

export const { setWinnersPage, setWinnersSort } = winnersSlice.actions;
export default winnersSlice.reducer;
