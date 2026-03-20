import * as React from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md'

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition active:translate-y-px disabled:opacity-60 disabled:pointer-events-none'

  const sizes: Record<Size, string> = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
  }

  const variants: Record<Variant, string> = {
    primary:
      'bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus-visible:ring-blue-500',
    secondary:
      'bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:ring-blue-500',
    ghost:
      'bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-blue-500',
  }

  return (
    <button
      type={type}
      className={cx(base, sizes[size], variants[variant], className)}
      {...props}
    />
  )
}

