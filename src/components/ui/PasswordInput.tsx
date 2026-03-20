import * as React from 'react'

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export type PasswordInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  label?: string
  hint?: string
  error?: string
}

export function PasswordInput({
  className,
  label,
  hint,
  error,
  id,
  ...props
}: PasswordInputProps) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const hintId = hint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}

      <div className="relative">
        <input
          id={inputId}
          type={isVisible ? 'text' : 'password'}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          aria-invalid={error ? true : undefined}
          className={cx(
            'h-11 w-full rounded-xl border bg-white px-3 pr-12 text-sm text-slate-900 shadow-sm',
            'border-slate-200 placeholder:text-slate-400',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-50',
            error ? 'border-red-300 focus:ring-red-500' : 'hover:border-slate-300',
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setIsVisible((v) => !v)}
          className={cx(
            'absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold',
            'text-slate-600 hover:bg-slate-100',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
          )}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
        >
          {isVisible ? 'Hide' : 'Show'}
        </button>
      </div>

      {hint ? <p id={hintId} className="text-xs text-slate-500">{hint}</p> : null}
      {error ? <p id={errorId} className="text-xs text-red-600">{error}</p> : null}
    </div>
  )
}

