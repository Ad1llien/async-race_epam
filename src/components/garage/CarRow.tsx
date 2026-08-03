import CarTrack from './CarTrack';
import CarControls from './CarControls';
import { useAppSelector } from '../../store/hooks';
import { IDLE_ENGINE_STATE } from '../../features/race/raceSlice';
import type { Car } from '../../types/car';

interface CarRowProps {
  car: Car;
  raceInProgress: boolean;
}

export default function CarRow({ car, raceInProgress }: CarRowProps) {
  const engine = useAppSelector((state) => state.race.engines[car.id] ?? IDLE_ENGINE_STATE);

  return (
    <div className="border-b border-border py-3">
      <CarControls car={car} engine={engine} raceInProgress={raceInProgress} />
      <CarTrack color={car.color} engine={engine} />
    </div>
  );
}
