import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import * as carsApi from '../../api/carsApi';
import { registerWin } from '../../api/winnersApi';
import type { Car } from '../../types/car';
import type { AppDispatch } from '../../store/store';

export interface EngineState {
  isDriving: boolean;
  hasMoved: boolean;
  velocity: number;
  distance: number;
  startedAt: number | null;
}

export interface RaceWinner {
  carId: number;
  name: string;
  time: number;
}

export interface RaceState {
  engines: Record<number, EngineState>;
  raceStatus: 'idle' | 'racing' | 'finished';
  winner: RaceWinner | null;
  raceNotice: string | null;
}

export const IDLE_ENGINE_STATE: EngineState = {
  isDriving: false,
  hasMoved: false,
  velocity: 0,
  distance: 0,
  startedAt: null,
};

const initialState: RaceState = {
  engines: {},
  raceStatus: 'idle',
  winner: null,
  raceNotice: null,
};

const raceSlice = createSlice({
  name: 'race',
  initialState,
  reducers: {
    engineStarted(
      state,
      action: PayloadAction<{ carId: number; velocity: number; distance: number }>,
    ) {
      const { carId, velocity, distance } = action.payload;
      state.engines[carId] = {
        isDriving: true,
        hasMoved: true,
        velocity,
        distance,
        startedAt: Date.now(),
      };
    },
    engineDriveEnded(state, action: PayloadAction<{ carId: number }>) {
      const engine = state.engines[action.payload.carId];
      if (engine) {
        engine.isDriving = false;
      }
    },
    engineStopped(state, action: PayloadAction<{ carId: number }>) {
      state.engines[action.payload.carId] = { ...IDLE_ENGINE_STATE };
    },
    raceStarted(state, action: PayloadAction<number[]>) {
      state.raceStatus = 'racing';
      state.winner = null;
      state.raceNotice = null;
      action.payload.forEach((id) => {
        state.engines[id] = { ...IDLE_ENGINE_STATE };
      });
    },
    raceFinished(state, action: PayloadAction<RaceWinner>) {
      state.raceStatus = 'finished';
      state.winner = action.payload;
    },
    raceEndedWithoutWinner(state, action: PayloadAction<string>) {
      state.raceStatus = 'idle';
      state.raceNotice = action.payload;
    },
    raceReset(state, action: PayloadAction<number[]>) {
      action.payload.forEach((id) => {
        state.engines[id] = { ...IDLE_ENGINE_STATE };
      });
      state.raceStatus = 'idle';
      state.winner = null;
      state.raceNotice = null;
    },
    dismissWinnerBanner(state) {
      state.winner = null;
      state.raceNotice = null;
    },
  },
});

export const {
  engineStarted,
  engineDriveEnded,
  engineStopped,
  raceStarted,
  raceFinished,
  raceEndedWithoutWinner,
  raceReset,
  dismissWinnerBanner,
} = raceSlice.actions;
export default raceSlice.reducer;

interface DriveOutcome {
  outcome: 'finished' | 'broken';
  time: number;
}

const MS_PER_SECOND = 1000;

async function runDriveSequence(id: number, dispatch: AppDispatch): Promise<DriveOutcome> {
  const { velocity, distance } = await carsApi.setEngineStatus(id, 'started');
  dispatch(engineStarted({ carId: id, velocity, distance }));
  const driveStartedAt = Date.now();

  try {
    await carsApi.driveCar(id);
    dispatch(engineDriveEnded({ carId: id }));
    return { outcome: 'finished', time: (Date.now() - driveStartedAt) / MS_PER_SECOND };
  } catch {
    dispatch(engineDriveEnded({ carId: id }));
    return { outcome: 'broken', time: 0 };
  }
}

export const startEngineThunk = createAsyncThunk(
  'race/startEngine',
  async (carId: number, { dispatch }) => {
    await runDriveSequence(carId, dispatch as AppDispatch);
  },
);

export const stopEngineThunk = createAsyncThunk(
  'race/stopEngine',
  async (carId: number, { dispatch }) => {
    await carsApi.setEngineStatus(carId, 'stopped');
    dispatch(engineStopped({ carId }));
  },
);

export const startRaceThunk = createAsyncThunk(
  'race/startRace',
  async (cars: Car[], { dispatch }) => {
    dispatch(raceStarted(cars.map((car) => car.id)));
    let winnerDeclared = false;

    await Promise.all(
      cars.map(async (car) => {
        try {
          const result = await runDriveSequence(car.id, dispatch as AppDispatch);
          if (result.outcome === 'finished' && !winnerDeclared) {
            winnerDeclared = true;
            dispatch(raceFinished({ carId: car.id, name: car.name, time: result.time }));
            await registerWin(car.id, result.time);
          }
        } catch {
          // Одна упавшая машина не должна обрывать всю гонку и мешать
          // определению победителя среди остальных.
        }
      }),
    );

    if (!winnerDeclared) {
      dispatch(raceEndedWithoutWinner('Race ended with no winner — no car reached the finish.'));
    }
  },
);

async function stopEngineSafe(id: number): Promise<void> {
  try {
    await carsApi.setEngineStatus(id, 'stopped');
  } catch {
    // Аналогично — одна неудачная остановка не должна блокировать сброс остальных.
  }
}

export const resetRaceThunk = createAsyncThunk(
  'race/resetRace',
  async (carIds: number[], { dispatch }) => {
    await Promise.all(carIds.map(stopEngineSafe));
    dispatch(raceReset(carIds));
  },
);
