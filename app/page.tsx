'use client'

import { useState } from 'react'
import { Loader2, Feather } from 'lucide-react'
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
  const field =
    'w-full resize-y rounded-sm border border-line bg-paper p-4 text-[15px] leading-relaxed text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-wine'

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-16">
      {/* centered serif masthead with rule */}
      <header className="mx-auto max-w-2xl text-center">
        <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-gold text-wine">
          <Feather size={20} />
        </span>
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          The Cover Letter Desk
        </h1>
        <div className="mx-auto my-4 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-gold/50" />
          <span className="font-display text-sm italic text-wine">written to sound like you, not a bot</span>
          <span className="h-px w-12 bg-gold/50" />
        </div>
        <p className="text-[15px] leading-relaxed text-ink-soft">
          Give it the role and your background. It composes a tailored letter, one line at a time.
        </p>
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        {/* inputs */}
        <div className="space-y-5">
          <div>
            <label htmlFor="job" className="mb-1.5 block font-display text-sm font-semibold text-ink">
              The role
            </label>
            <textarea
              id="job"
              value={job}
              onChange={(e) => setJob(e.target.value)}
              placeholder="Paste the full job posting…"
              rows={7}
              className={field}
            />
          </div>
          <div>
            <label htmlFor="cv" className="mb-1.5 block font-display text-sm font-semibold text-ink">
              Your background
            </label>
            <textarea
              id="cv"
              value={cv}
              onChange={(e) => setCv(e.target.value)}
              placeholder="Paste your CV or a summary of your experience…"
              rows={7}
              className={field}
            />
          </div>

          <div>
            <span className="mb-2 block font-display text-sm font-semibold text-ink">Tone</span>
            <ToneSelector value={tone} onChange={setTone} />
          </div>

          {error && (
            <p className="rounded-sm border-l-4 border-wine bg-wine/8 px-4 py-3 text-sm text-wine-2" role="alert">
              {error}
            </p>
          )}

          <button
            onClick={generate}
            disabled={!canSubmit}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-wine px-6 py-4 font-display text-[16px] font-semibold text-paper transition-colors hover:bg-wine-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {streaming ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Composing…
              </>
            ) : (
              <>
                <Feather size={17} /> Write my letter
              </>
            )}
          </button>
          <p className="text-center text-xs text-ink-soft">
            Nothing is stored. The letter only exists in your browser.
          </p>
        </div>

        {/* output */}
        <OutputPanel letter={letter} streaming={streaming} />
      </div>

      <footer className="mt-16 text-center font-display text-sm italic text-ink-soft">
        A concept project by Sam Madni.
      </footer>
    </main>
  )
}
