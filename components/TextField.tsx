import { useId, type ComponentProps } from 'react';

interface TextFieldProps extends ComponentProps<'input'> {
  label: string;
  error?: string | undefined;
}

export const TextField = ({ label, error, id, className = '', ...props }: TextFieldProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`min-h-12 rounded-[14px] border bg-surface px-3.5 text-base text-alta-plum placeholder:text-alta-plum/50 focus:border-accent-tan focus:outline-none focus:ring-[3px] focus:ring-accent-tan/25 ${
          error ? 'border-danger' : 'border-alta-plum/20'
        } ${className}`.trim()}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
};
