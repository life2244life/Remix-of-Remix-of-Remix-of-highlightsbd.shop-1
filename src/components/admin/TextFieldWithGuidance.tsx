import React from 'react';

type Unit = 'chars' | 'words';

const countValue = (value: string, unit: Unit) => {
  if (unit === 'words') {
    const t = value.trim();
    return t ? t.split(/\s+/).length : 0;
  }
  return value.length;
};

const stateColor = (count: number, min?: number, max?: number) => {
  if (count === 0) return 'text-muted-foreground';
  if (min != null && count < min) return 'text-amber-600 dark:text-amber-400';
  if (max != null && count > max) return 'text-red-500 dark:text-red-400';
  return 'text-emerald-600 dark:text-emerald-400';
};

const recLabel = (min?: number, max?: number, unit: Unit = 'chars') => {
  const word = unit === 'words' ? 'words' : 'characters';
  if (min != null && max != null) return `${min}–${max} recommended ${word}`;
  if (min != null) return `at least ${min} recommended ${word}`;
  if (max != null) return `up to ${max} recommended ${word}`;
  return '';
};

/** Live character/word counter shown on the right of a field label. */
export const FieldCounter = ({
  value, recommendedMin, recommendedMax, unit = 'chars', tooltipText,
}: {
  value: string;
  recommendedMin?: number;
  recommendedMax?: number;
  unit?: Unit;
  tooltipText?: string;
}) => {
  const count = countValue(value, unit);
  if (count === 0) return null;
  const tip = tooltipText || recLabel(recommendedMin, recommendedMax, unit);
  return (
    <span
      title={tip}
      className={`text-[10px] font-medium tabular-nums cursor-help ${stateColor(count, recommendedMin, recommendedMax)}`}
    >
      ({count})
    </span>
  );
};

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  recommendedMin?: number;
  recommendedMax?: number;
  unit?: Unit;
  showCounter?: boolean;
  tooltipText?: string;
  multiline?: boolean;
  rows?: number;
  type?: string;
  mono?: boolean;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  hint?: React.ReactNode;
  action?: React.ReactNode;
};

/** Reusable text field with recommended-length guidance, live counter, color states & tooltip. */
const TextFieldWithGuidance = ({
  label, value, onChange, placeholder, recommendedMin, recommendedMax,
  unit = 'chars', showCounter = true, tooltipText, multiline = false, rows,
  type = 'text', mono = false, maxLength, disabled = false,
  className = '', inputClassName = '', onBlur, hint, action,
}: Props) => {
  const rec = recLabel(recommendedMin, recommendedMax, unit);
  const hasRec = recommendedMin != null || recommendedMax != null;
  const fullPlaceholder = placeholder && hasRec
    ? `${placeholder} — ${rec}`
    : placeholder;
  const tip = tooltipText || rec;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <label className="text-[10px] text-muted-foreground tracking-widest uppercase block">
          {label}
        </label>
        <div className="flex items-center gap-2">
          {showCounter && (
            <FieldCounter
              value={value}
              recommendedMin={recommendedMin}
              recommendedMax={recommendedMax}
              unit={unit}
              tooltipText={tip}
            />
          )}
          {action}
        </div>
      </div>
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={fullPlaceholder}
          maxLength={maxLength}
          disabled={disabled}
          rows={rows}
          className={`luxury-input ${rows ? '' : 'min-h-[70px]'} ${mono ? 'font-mono text-xs' : ''} ${inputClassName}`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={fullPlaceholder}
          maxLength={maxLength}
          disabled={disabled}
          className={`luxury-input ${mono ? 'font-mono text-xs' : ''} ${inputClassName}`}
        />
      )}
      {hint}
    </div>
  );
};

export default TextFieldWithGuidance;
