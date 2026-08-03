import { useAppDispatch } from '../../store/hooks';
import { deleteCarThunk, selectCarForEdit } from '../../features/garage/garageSlice';
import { startEngineThunk, stopEngineThunk } from '../../features/race/raceSlice';
import type { EngineState } from '../../features/race/raceSlice';
import type { Car } from '../../types/car';

interface EngineButtonsProps {
  carId: number;
  engine: EngineState;
}

function EngineButtons({ carId, engine }: EngineButtonsProps) {
  const dispatch = useAppDispatch();

  return (
    <>
      <button
        type="button"
        onClick={() => dispatch(startEngineThunk(carId))}
        disabled={engine.isDriving}
        className="rounded border border-border bg-surface-alt px-3 py-1 text-sm disabled:opacity-40"
      >
        A
      </button>
      <button
        type="button"
        onClick={() => dispatch(stopEngineThunk(carId))}
        disabled={!engine.isDriving && !engine.hasMoved}
        className="rounded border border-border bg-surface-alt px-3 py-1 text-sm disabled:opacity-40"
      >
        B
      </button>
    </>
  );
}

interface CarControlsProps {
  car: Car;
  engine: EngineState;
  raceInProgress: boolean;
}

export default function CarControls({ car, engine, raceInProgress }: CarControlsProps) {
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => dispatch(selectCarForEdit(car))}
        disabled={raceInProgress}
        className="rounded border border-border bg-surface-alt px-3 py-1 text-sm disabled:opacity-40"
      >
        Select
      </button>
      <button
        type="button"
        onClick={() => dispatch(deleteCarThunk(car.id))}
        disabled={raceInProgress}
        className="rounded border border-border bg-surface-alt px-3 py-1 text-sm disabled:opacity-40"
      >
        Remove
      </button>
      <EngineButtons carId={car.id} engine={engine} />
      <span className="font-semibold" style={{ color: car.color }}>
        {car.name}
      </span>
    </div>
  );
}
