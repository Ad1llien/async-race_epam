interface RaceControlsProps {
  isRacing: boolean;
  onStartRace: () => void;
  onResetRace: () => void;
}

export default function RaceControls({ isRacing, onStartRace, onResetRace }: RaceControlsProps) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        disabled={isRacing}
        onClick={onStartRace}
        className="rounded border border-accent-pink px-4 py-2 text-sm uppercase text-accent-pink disabled:opacity-40"
      >
        Race
      </button>
      <button
        type="button"
        onClick={onResetRace}
        className="rounded border border-accent-cyan px-4 py-2 text-sm uppercase text-accent-cyan"
      >
        Reset
      </button>
    </div>
  );
}
