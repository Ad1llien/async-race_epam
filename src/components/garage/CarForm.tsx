import type { FormEvent } from 'react';
import { CAR_NAME_MAX_LENGTH } from '../../utils/constants';

interface CarFormProps {
  title: string;
  name: string;
  color: string;
  submitLabel: string;
  disabled?: boolean;
  onNameChange: (name: string) => void;
  onColorChange: (color: string) => void;
  onSubmit: () => void;
}

function isValidName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length > 0 && trimmed.length <= CAR_NAME_MAX_LENGTH;
}

interface NameColorFieldsProps {
  name: string;
  color: string;
  disabled: boolean;
  onNameChange: (name: string) => void;
  onColorChange: (color: string) => void;
}

function NameColorFields({
  name,
  color,
  disabled,
  onNameChange,
  onColorChange,
}: NameColorFieldsProps) {
  return (
    <>
      <input
        type="text"
        value={name}
        maxLength={CAR_NAME_MAX_LENGTH}
        placeholder="Car brand"
        disabled={disabled}
        onChange={(event) => onNameChange(event.target.value)}
        className="min-w-30 flex-1 rounded border border-border bg-surface-alt px-3 py-2 text-text"
      />
      <input
        type="color"
        value={color}
        disabled={disabled}
        onChange={(event) => onColorChange(event.target.value)}
        className="h-9 w-10 rounded border border-border bg-surface-alt"
      />
    </>
  );
}

export default function CarForm({
  title,
  name,
  color,
  submitLabel,
  disabled = false,
  onNameChange,
  onColorChange,
  onSubmit,
}: CarFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isValidName(name)) {
      onSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center gap-2 rounded border border-border bg-surface p-2"
    >
      <span className="min-w-15 text-xs uppercase text-text-dim">{title}</span>
      <NameColorFields
        name={name}
        color={color}
        disabled={disabled}
        onNameChange={onNameChange}
        onColorChange={onColorChange}
      />
      <button
        type="submit"
        disabled={disabled || !isValidName(name)}
        className="rounded border border-accent-green px-4 py-2 text-sm uppercase text-accent-green disabled:opacity-40"
      >
        {submitLabel}
      </button>
    </form>
  );
}
