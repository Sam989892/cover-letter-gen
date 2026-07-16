'use client'

import { TONES, type Tone } from '@/lib/schema'

const labels: Record<Tone, string> = {
  professional: 'Professional',
  friendly: 'Friendly',
  concise: 'Concise',
}

type Props = { value: Tone; onChange: (tone: Tone) => void }

export default function ToneSelector({ value, onChange }: Props) {
  return (
    <div role="radiogroup" aria-label="Letter tone" className="flex gap-2">
      {TONES.map((tone) => (
        <button
          key={tone}
          type="button"
          role="radio"
          aria-checked={value === tone}
          onClick={() => onChange(tone)}
          className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            value === tone
              ? 'bg-teal-600 text-white'
              : 'border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          {labels[tone]}
        </button>
      ))}
    </div>
  )
}
