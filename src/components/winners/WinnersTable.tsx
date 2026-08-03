import CarIcon from '../garage/CarIcon';
import { setWinnersSort } from '../../features/winners/winnersSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { WINNERS_PAGE_SIZE } from '../../utils/constants';
import type { WinnerRow } from '../../features/winners/winnersSlice';
import type { WinnerSortField } from '../../types/winner';

function sortIndicator(active: boolean, order: 'ASC' | 'DESC'): string {
  if (!active) {
    return '';
  }
  return order === 'ASC' ? ' ▲' : ' ▼';
}

interface SortableHeaderProps {
  field: WinnerSortField;
  label: string;
}

function SortableHeader({ field, label }: SortableHeaderProps) {
  const dispatch = useAppDispatch();
  const { sortBy, sortOrder } = useAppSelector((state) => state.winners);

  return (
    <th className="p-2 text-left">
      <button
        type="button"
        onClick={() => dispatch(setWinnersSort(field))}
        className="text-accent-cyan uppercase text-sm"
      >
        {label}
        {sortIndicator(sortBy === field, sortOrder)}
      </button>
    </th>
  );
}

interface WinnerTableRowProps {
  row: WinnerRow;
  rowNumber: number;
}

function WinnerTableRow({ row, rowNumber }: WinnerTableRowProps) {
  return (
    <tr className="border-b border-border">
      <td className="p-2">{rowNumber}</td>
      <td className="p-2">{row.car ? <CarIcon color={row.car.color} /> : '—'}</td>
      <td className="p-2">{row.car ? row.car.name : 'Unknown'}</td>
      <td className="p-2">{row.wins}</td>
      <td className="p-2">{row.time.toFixed(2)}</td>
    </tr>
  );
}

export default function WinnersTable() {
  const { rows, page } = useAppSelector((state) => state.winners);

  if (rows.length === 0) {
    return <p className="py-8 text-center text-text-dim">No winners yet.</p>;
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-border">
          <th className="p-2 text-left text-sm uppercase text-text-dim">#</th>
          <th className="p-2 text-left text-sm uppercase text-text-dim">Car</th>
          <th className="p-2 text-left text-sm uppercase text-text-dim">Name</th>
          <SortableHeader field="wins" label="Wins" />
          <SortableHeader field="time" label="Best time (s)" />
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <WinnerTableRow
            key={row.id}
            row={row}
            rowNumber={(page - 1) * WINNERS_PAGE_SIZE + index + 1}
          />
        ))}
      </tbody>
    </table>
  );
}
