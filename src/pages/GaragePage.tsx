import { useEffect } from 'react';
import CarFormsPanel from '../components/garage/CarFormsPanel';
import CarRow from '../components/garage/CarRow';
import GarageActionsBar from '../components/garage/GarageActionsBar';
import WinnerBanner from '../components/garage/WinnerBanner';
import Pagination from '../components/common/Pagination';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadCarsPage, setPage } from '../features/garage/garageSlice';
import { GARAGE_PAGE_SIZE } from '../utils/constants';
import { getTotalPages } from '../utils/pagination';

export default function GaragePage() {
  const dispatch = useAppDispatch();
  const { cars, totalCount, page } = useAppSelector((state) => state.garage);
  const isRacing = useAppSelector((state) => state.race.raceStatus === 'racing');

  useEffect(() => {
    dispatch(loadCarsPage(page));
  }, [dispatch, page]);

  return (
    <section>
      <h1 className="text-2xl font-bold text-accent-pink">Garage ({totalCount})</h1>
      <CarFormsPanel raceInProgress={isRacing} />
      <GarageActionsBar cars={cars} isRacing={isRacing} />
      <WinnerBanner />
      {cars.length === 0 ? (
        <p className="py-8 text-center text-text-dim">No cars in the garage yet.</p>
      ) : (
        cars.map((car) => <CarRow key={car.id} car={car} raceInProgress={isRacing} />)
      )}
      <Pagination
        page={page}
        totalPages={getTotalPages(totalCount, GARAGE_PAGE_SIZE)}
        disabled={isRacing}
        onPageChange={(nextPage) => dispatch(setPage(nextPage))}
      />
    </section>
  );
}
