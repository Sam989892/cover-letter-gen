'use client'

import { useState } from 'react'
import { Copy, Check, Download, FileText } from 'lucide-react'

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
      <div className="flex h-full min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400 dark:border-slate-800">
        <FileText size={32} className="mb-3 opacity-40" />
        <p className="text-sm">Your letter will stream in here as it&apos;s written.</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3 dark:border-slate-800">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {streaming ? 'Writing…' : 'Your cover letter'}
        </span>
        <div className="flex gap-2">
          <button
            onClick={copy}
            disabled={streaming}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {copied ? <Check size={14} className="text-teal-600" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={download}
            disabled={streaming}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Download size={14} /> .txt
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto whitespace-pre-wrap p-6 text-[15px] leading-relaxed text-slate-800 dark:text-slate-200">
        {letter}
        {streaming && <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-teal-500 align-middle" />}
      </div>
    </div>
  )
}
