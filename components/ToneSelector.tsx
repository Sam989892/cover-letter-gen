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
          className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            value === tone
              ? 'border-wine bg-wine text-paper'
              : 'border-line bg-paper text-ink-soft hover:border-gold hover:text-ink'
          }`}
        >
          {labels[tone]}
        </button>
      ))}
    </div>
  )
}
