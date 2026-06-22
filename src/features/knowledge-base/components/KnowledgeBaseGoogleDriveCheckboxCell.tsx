import { Check } from 'lucide-react'

interface CheckboxCellProps {
  checked: boolean
  onChange: () => void
}

export default function CheckboxCell({ checked, onChange }: Readonly<CheckboxCellProps>) {
  return (
    <label className="relative flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        className={`flex h-4 w-4 items-center justify-center rounded border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50 ${
          checked
            ? 'border-primary bg-primary'
            : 'border-border bg-background hover:border-primary/60'
        }`}
      >
        {checked && <Check className="h-2.5 w-2.5 text-white stroke-[3]" />}
      </span>
    </label>
  )
}
