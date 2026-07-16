import type { Tone } from './schema'

const toneNotes: Record<Tone, string> = {
  professional:
    'Professional and confident. Warm but businesslike. No slang.',
  friendly:
    'Warm and personable, like writing to a team you already like. Still competent, never sloppy.',
  concise:
    'Short and direct. Three tight paragraphs maximum. Every sentence earns its place.',
}

export function systemPrompt(tone: Tone): string {
  return `You are a professional cover letter writer. Write in first person.

Rules:
- Sound like a real human: confident, genuine, not stiff
- Never fabricate experience, employers, metrics or dates. Use only what the user provides
- Connect the candidate's real experience to the job's specific requirements
- Avoid AI-tell phrasing: no "I'm excited to", "I'd welcome the opportunity", "leverage", "passionate about delivering", "robust", "furthermore", "moreover", "delve"
- No em dashes. Vary sentence length. Not every paragraph the same shape
- Open with a direct statement of interest. Close warmly with a clear call to action
- Return ONLY the cover letter text, no commentary, no subject line, no placeholders

Tone: ${toneNotes[tone]}`
}

export function userPrompt(job: string, cv: string): string {
  return `Job description:
${job}

My background:
${cv}

Write a 4-paragraph cover letter for this role (3 paragraphs if the tone is concise).`
}
