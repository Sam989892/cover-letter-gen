import { z } from 'zod'

export const TONES = ['professional', 'friendly', 'concise'] as const
export type Tone = (typeof TONES)[number]

export const InputSchema = z.object({
  job: z
    .string()
    .min(80, 'Paste the full job description (80+ characters).')
    .max(25_000, 'Keep the job description under 25,000 characters.'),
  cv: z
    .string()
    .min(80, 'Paste your CV or a summary of it (80+ characters).')
    .max(25_000, 'Keep your background under 25,000 characters.'),
  tone: z.enum(TONES),
})

export type Input = z.infer<typeof InputSchema>
