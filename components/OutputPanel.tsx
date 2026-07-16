'use client'

import { useState } from 'react'
import { Copy, Check, Download } from 'lucide-react'

type Props = { letter: string; streaming: boolean }

export default function OutputPanel({ letter, streaming }: Props) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(letter)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const download = () => {
    const blob = new Blob([letter], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cover-letter.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!letter) {
    return (
      <div className="flex h-full min-h-96 flex-col items-center justify-center rounded-sm border border-line bg-paper/60 p-10 text-center">
        <div className="font-display text-2xl italic text-line">Dear Hiring Manager…</div>
        <p className="mt-3 text-sm text-ink-soft">Your letter will appear here, written line by line.</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* the letter, on paper */}
      <div className="relative flex-1 overflow-hidden rounded-sm border border-line bg-paper shadow-[0_2px_20px_rgba(36,28,26,0.08)]">
        {/* letterhead */}
        <div className="flex items-center justify-between border-b border-double border-gold/40 px-8 py-4">
          <span className="font-display text-lg italic tracking-tight text-wine">Cover Letter</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
            {streaming ? 'writing…' : 'draft'}
          </span>
        </div>
        <div className="max-h-[28rem] overflow-y-auto whitespace-pre-wrap px-8 py-7 font-display text-[16px] leading-[1.9] text-ink">
          {letter}
          {streaming && <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-wine align-middle" />}
        </div>
      </div>

      {/* actions */}
      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={copy}
          disabled={streaming}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-paper px-4 py-2 text-sm text-ink-soft transition-colors hover:border-wine hover:text-wine disabled:opacity-40"
        >
          {copied ? <Check size={14} className="text-wine" /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        <button
          onClick={download}
          disabled={streaming}
          className="flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-paper px-4 py-2 text-sm text-ink-soft transition-colors hover:border-wine hover:text-wine disabled:opacity-40"
        >
          <Download size={14} /> .txt
        </button>
      </div>
    </div>
  )
}
