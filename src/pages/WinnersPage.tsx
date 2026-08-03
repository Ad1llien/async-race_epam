import { useEffect } from 'react';
import WinnersTable from '../components/winners/WinnersTable';
import Pagination from '../components/common/Pagination';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadWinnersPage, setWinnersPage } from '../features/winners/winnersSlice';
import { WINNERS_PAGE_SIZE } from '../utils/constants';
import { getTotalPages } from '../utils/pagination';

export default function WinnersPage() {
  const dispatch = useAppDispatch();
  const { totalCount, page, sortBy, sortOrder } = useAppSelector((state) => state.winners);

  useEffect(() => {
    dispatch(loadWinnersPage());
  }, [dispatch, page, sortBy, sortOrder]);

  return (
    <section>
      <h1 className="text-2xl font-bold text-accent-pink">Winners ({totalCount})</h1>
      <WinnersTable />
      <Pagination
        page={page}
        totalPages={getTotalPages(totalCount, WINNERS_PAGE_SIZE)}
        onPageChange={(nextPage) => dispatch(setWinnersPage(nextPage))}
      />
    </section>
  );
}
