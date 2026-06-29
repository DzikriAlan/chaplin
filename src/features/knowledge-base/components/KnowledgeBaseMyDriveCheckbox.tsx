import { useEffect, useRef } from 'react'

interface CheckboxProps {
  checked: boolean
  indeterminate: boolean
  onChange: () => void
  label?: string
}

export function KnowledgeBaseMyDriveCheckbox({ checked, indeterminate, onChange, label }: Readonly<CheckboxProps>) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label={label}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-border accent-primary cursor-pointer shrink-0"
    />
  )
}
