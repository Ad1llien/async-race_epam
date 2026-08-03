import { useEffect, useState, type KeyboardEvent } from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  disabled?: boolean;
  onPageChange: (page: number) => void;
}

function clampPage(value: number, totalPages: number): number {
  return Math.min(Math.max(1, value), totalPages);
}

function usePageInput(page: number, totalPages: number, onPageChange: (page: number) => void) {
  const [inputValue, setInputValue] = useState(String(page));

  useEffect(() => {
    setInputValue(String(page));
  }, [page]);

  const commitPage = (): void => {
    const parsed = Number.parseInt(inputValue, 10);
    const nextPage = Number.isNaN(parsed) ? page : clampPage(parsed, totalPages);
    setInputValue(String(nextPage));
    if (nextPage !== page) {
      onPageChange(nextPage);
    }
  };

  const handleChange = (rawValue: string): void => {
    setInputValue(rawValue.replace(/[^0-9]/g, ''));
  };

  return { inputValue, commitPage, handleChange };
}

interface PageInputProps {
  page: number;
  totalPages: number;
  disabled: boolean;
  onPageChange: (page: number) => void;
}

function PageInput({ page, totalPages, disabled, onPageChange }: PageInputProps) {
  const { inputValue, commitPage, handleChange } = usePageInput(page, totalPages, onPageChange);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      commitPage();
    }
  };

  return (
    <span className="flex items-center gap-1 text-sm text-text-dim">
      Page
      <input
        type="text"
        inputMode="numeric"
        disabled={disabled}
        value={inputValue}
        onChange={(event) => handleChange(event.target.value)}
        onBlur={commitPage}
        onKeyDown={handleKeyDown}
        className="w-12 rounded border border-border bg-surface-alt px-2 py-1 text-center text-text disabled:opacity-40"
      />
      / {totalPages}
    </span>
  );
}

export default function Pagination({
  page,
  totalPages,
  disabled = false,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button
        type="button"
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="rounded border border-accent-cyan px-3 py-1 text-accent-cyan disabled:opacity-40"
      >
        Prev
      </button>
      <PageInput
        page={page}
        totalPages={totalPages}
        disabled={disabled}
        onPageChange={onPageChange}
      />
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
