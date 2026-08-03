import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import * as carsApi from '../../api/carsApi';
import { deleteWinnerSafe } from '../../api/winnersCleanup';
import { GARAGE_PAGE_SIZE, RANDOM_CARS_COUNT } from '../../utils/constants';
import { getTotalPages } from '../../utils/pagination';
import { randomCarName, randomColor } from '../../utils/randomCar';
import type { Car } from '../../types/car';
import type { RootState } from '../../store/store';

export interface CarFormState {
  name: string;
  color: string;
}

export interface GarageState {
  cars: Car[];
  totalCount: number;
  page: number;
  status: 'idle' | 'loading' | 'error';
  createForm: CarFormState;
  updateForm: CarFormState;
  editingCarId: number | null;
}

const initialState: GarageState = {
  cars: [],
  totalCount: 0,
  page: 1,
  status: 'idle',
  createForm: { name: '', color: '#ffffff' },
  updateForm: { name: '', color: '#ffffff' },
  editingCarId: null,
};

export const loadCarsPage = createAsyncThunk('garage/loadCarsPage', async (page: number) => {
  const result = await carsApi.fetchCars(page, GARAGE_PAGE_SIZE);
  const totalPages = getTotalPages(result.totalCount, GARAGE_PAGE_SIZE);

  // если гараж "усохл" и запрошенная страница уже не существует — берём последнюю валидную
  if (page > totalPages) {
    const clamped = await carsApi.fetchCars(totalPages, GARAGE_PAGE_SIZE);
    return { ...clamped, page: totalPages };
  }

  return { ...result, page };
});

export const createCarThunk = createAsyncThunk(
  'garage/createCar',
  async (car: CarFormState, { dispatch, getState }) => {
    await carsApi.createCar(car);
    const { page } = (getState() as RootState).garage;
    await dispatch(loadCarsPage(page));
  },
);

export const updateCarThunk = createAsyncThunk(
  'garage/updateCar',
  async ({ id, car }: { id: number; car: CarFormState }, { dispatch, getState }) => {
    await carsApi.updateCar(id, car);
    const { page } = (getState() as RootState).garage;
    await dispatch(loadCarsPage(page));
  },
);

function getTargetPageAfterDelete(state: GarageState): number {
  const isLastCarOnPage = state.cars.length === 1;
  const hasPreviousPage = state.page > 1;
  return isLastCarOnPage && hasPreviousPage ? state.page - 1 : state.page;
}

export const deleteCarThunk = createAsyncThunk(
  'garage/deleteCar',
  async (id: number, { dispatch, getState }) => {
    await carsApi.deleteCar(id);
    await deleteWinnerSafe(id); // машина не должна оставаться "мёртвой душой" в winners
    const targetPage = getTargetPageAfterDelete((getState() as RootState).garage);
    await dispatch(loadCarsPage(targetPage));
  },
);

export const createRandomCarsThunk = createAsyncThunk(
  'garage/createRandomCars',
  async (_: void, { dispatch, getState }) => {
    const newCars = Array.from({ length: RANDOM_CARS_COUNT }, () => ({
      name: randomCarName(),
      color: randomColor(),
    }));
    await Promise.all(newCars.map((car) => carsApi.createCar(car)));
    const { page } = (getState() as RootState).garage;
    await dispatch(loadCarsPage(page));
  },
);

const garageSlice = createSlice({
  name: 'garage',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setCreateForm(state, action: PayloadAction<Partial<CarFormState>>) {
      Object.assign(state.createForm, action.payload);
    },
    setUpdateForm(state, action: PayloadAction<Partial<CarFormState>>) {
      Object.assign(state.updateForm, action.payload);
    },
    selectCarForEdit(state, action: PayloadAction<Car>) {
      state.editingCarId = action.payload.id;
      state.updateForm = { name: action.payload.name, color: action.payload.color };
    },
    clearEditingCar(state) {
      state.editingCarId = null;
      state.updateForm = { name: '', color: '#ffffff' };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCarsPage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadCarsPage.fulfilled, (state, action) => {
        state.status = 'idle';
        state.cars = action.payload.data;
        state.totalCount = action.payload.totalCount;
        state.page = action.payload.page;
      })
      .addCase(loadCarsPage.rejected, (state) => {
        state.status = 'error';
      })
      .addCase(deleteCarThunk.fulfilled, (state, action) => {
        if (state.editingCarId === action.meta.arg) {
          state.editingCarId = null;
          state.updateForm = { name: '', color: '#ffffff' };
        }
      });
  },
});

export const { setPage, setCreateForm, setUpdateForm, selectCarForEdit, clearEditingCar } =
  garageSlice.actions;
export default garageSlice.reducer;
