import * as React from 'react'

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  hint?: string
  error?: string
}

export function Input({ className, label, hint, error, id, ...props }: InputProps) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const hintId = hint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
        aria-invalid={error ? true : undefined}
        className={cx(
          'h-11 w-full rounded-xl border bg-white px-3 text-sm text-slate-900 shadow-sm',
          'border-slate-200 placeholder:text-slate-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-50',
          error ? 'border-red-300 focus:ring-red-500' : 'hover:border-slate-300',
          className,
        )}
        {...props}
      />
      {hint ? <p id={hintId} className="text-xs text-slate-500">{hint}</p> : null}
      {error ? <p id={errorId} className="text-xs text-red-600">{error}</p> : null}
    </div>
  )
}

