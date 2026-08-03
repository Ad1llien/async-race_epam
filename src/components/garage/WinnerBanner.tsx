import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dismissWinnerBanner } from '../../features/race/raceSlice';

export default function WinnerBanner() {
  const dispatch = useAppDispatch();
  const { winner, raceNotice } = useAppSelector((state) => state.race);

  if (!winner && !raceNotice) {
    return null;
  }

  return (
    <div
      className={`mb-3 flex items-center justify-between gap-3 rounded border p-3 ${
        winner ? 'border-accent-green text-accent-green' : 'border-accent-red text-accent-red'
      }`}
      role="alert"
    >
      <span>
        {winner
          ? `🏆 ${winner.name} won the race with a time of ${winner.time.toFixed(2)}s!`
          : `⚠️ ${raceNotice}`}
      </span>
      <button type="button" onClick={() => dispatch(dismissWinnerBanner())}>
        ✕
      </button>
    </div>
  );
}
