import CarForm from './CarForm';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  clearEditingCar,
  createCarThunk,
  setCreateForm,
  setUpdateForm,
  updateCarThunk,
} from '../../features/garage/garageSlice';

interface CarFormsPanelProps {
  raceInProgress: boolean;
}

export default function CarFormsPanel({ raceInProgress }: CarFormsPanelProps) {
  const dispatch = useAppDispatch();
  const { createForm, updateForm, editingCarId } = useAppSelector((state) => state.garage);

  const handleUpdate = () => {
    if (editingCarId !== null) {
      dispatch(updateCarThunk({ id: editingCarId, car: updateForm }));
      dispatch(clearEditingCar());
    }
  };

  return (
    <div className="mb-3 flex flex-wrap gap-3">
      <CarForm
        title="Create"
        name={createForm.name}
        color={createForm.color}
        submitLabel="Create"
        disabled={raceInProgress}
        onNameChange={(name) => dispatch(setCreateForm({ name }))}
        onColorChange={(color) => dispatch(setCreateForm({ color }))}
        onSubmit={() => dispatch(createCarThunk(createForm))}
      />
      <CarForm
        title="Update"
        name={updateForm.name}
        color={updateForm.color}
        submitLabel="Update"
        disabled={raceInProgress || editingCarId === null}
        onNameChange={(name) => dispatch(setUpdateForm({ name }))}
        onColorChange={(color) => dispatch(setUpdateForm({ color }))}
        onSubmit={handleUpdate}
      />
    </div>
  );
}
