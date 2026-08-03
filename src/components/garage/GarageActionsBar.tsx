import RaceControls from './RaceControls';
import { useAppDispatch } from '../../store/hooks';
import { createRandomCarsThunk } from '../../features/garage/garageSlice';
import { resetRaceThunk, startRaceThunk } from '../../features/race/raceSlice';
import type { Car } from '../../types/car';

interface GarageActionsBarProps {
  cars: Car[];
  isRacing: boolean;
}

export default function GarageActionsBar({ cars, isRacing }: GarageActionsBarProps) {
  const dispatch = useAppDispatch();

  return (
    <div className="mb-3 flex flex-wrap gap-3">
      <RaceControls
        isRacing={isRacing}
        onStartRace={() => dispatch(startRaceThunk(cars))}
        onResetRace={() => dispatch(resetRaceThunk(cars.map((car) => car.id)))}
      />
      <button
        type="button"
        onClick={() => dispatch(createRandomCarsThunk())}
        disabled={isRacing}
        className="rounded border border-accent-green px-4 py-2 text-sm uppercase text-accent-green disabled:opacity-40"
      >
        Generate 100 cars
      </button>
    </div>
  );
}
