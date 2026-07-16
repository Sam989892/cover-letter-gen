'use client'

import { useState } from 'react'
import { Loader2, PenLine } from 'lucide-react'
import ToneSelector from '@/components/ToneSelector'
import OutputPanel from '@/components/OutputPanel'
import type { Tone } from '@/lib/schema'

export default function Home() {
  const [job, setJob] = useState('')
  const [cv, setCv] = useState('')
  const [tone, setTone] = useState<Tone>('professional')
  const [letter, setLetter] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState('')

  const generate = async () => {
    setStreaming(true)
    setError('')
    setLetter('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job, cv, tone }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Something went wrong.')
      }

      // read the plain-text stream chunk by chunk
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setLetter((prev) => prev + decoder.decode(value, { stream: true }))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setStreaming(false)
    }
  }

  const canSubmit = job.trim().length >= 80 && cv.trim().length >= 80 && !streaming

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-12 sm:py-16">
      <header className="mb-10 text-center">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white">
          <PenLine size={24} />
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Cover letters that don&apos;t sound like a robot
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Paste the job and your background. Watch a tailored, human-sounding letter stream in.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* inputs */}
        <div className="space-y-4">
          <div>
            <label htmlFor="job" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Job description
            </label>
            <textarea
              id="job"
              value={job}
              onChange={(e) => setJob(e.target.value)}
              placeholder="Paste the full job posting…"
              rows={8}
              className="w-full resize-y rounded-2xl border border-slate-200 bg-white p-4 text-[15px] leading-relaxed text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-teal-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label htmlFor="cv" className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Your background
            </label>
            <textarea
              id="cv"
              value={cv}
              onChange={(e) => setCv(e.target.value)}
              placeholder="Paste your CV or a summary of your experience and skills…"
              rows={8}
              className="w-full resize-y rounded-2xl border border-slate-200 bg-white p-4 text-[15px] leading-relaxed text-slate-900 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-teal-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Tone</span>
            <ToneSelector value={tone} onChange={setTone} />
          </div>

          {error && (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600 dark:bg-rose-500/10 dark:text-rose-400" role="alert">
              {error}
            </p>
          )}

          <button
            onClick={generate}
            disabled={!canSubmit}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-teal-600 px-6 py-4 font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {streaming ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Writing…
              </>
            ) : (
              <>
                <PenLine size={18} /> Write my cover letter
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-400">
            Nothing is stored. The letter only exists in your browser.
          </p>
        </div>

        {/* output */}
        <OutputPanel letter={letter} streaming={streaming} />
      </div>

      <footer className="mt-16 text-center text-xs text-slate-400">
        Concept project by Sam Madni · Next.js + Claude API
      </footer>
    </main>
  )
}
