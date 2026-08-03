interface PaginationProps {
  page: number;
  totalPages: number;
  disabled?: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  disabled = false,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <button
        type="button"
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded border border-accent-cyan px-3 py-1 text-accent-cyan disabled:opacity-40"
      >
        Prev
      </button>
      <span className="text-sm text-text-dim">
        Page {page} / {totalPages}
      </span>
      <button
        type="button"
        disabled={disabled || page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded border border-accent-cyan px-3 py-1 text-accent-cyan disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
