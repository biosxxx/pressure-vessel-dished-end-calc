import type { ChangeEventHandler, ReactNode } from 'react';

interface FieldProps {
  label: string;
  error?: string;
  children: ReactNode;
  hint?: string;
}

export function Field({ label, error, children, hint }: FieldProps) {
  return (
    <label className="field">
      <span className="field__label">
        <span>{label}</span>
        {hint ? <span className="field__hint">{hint}</span> : null}
      </span>
      {children}
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  );
}

interface NumberFieldProps {
  label: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}

export function NumberField({ label, value, onChange, error, min, max, step = 1, suffix }: NumberFieldProps) {
  return (
    <Field label={label} error={error}>
      <div className="input-with-suffix">
        <input className="input" type="number" value={value} onChange={onChange} min={min} max={max} step={step} />
        {suffix ? <span className="input-suffix">{suffix}</span> : null}
      </div>
    </Field>
  );
}
