import Anthropic from '@anthropic-ai/sdk'
import { InputSchema } from '@/lib/schema'
import { systemPrompt, userPrompt } from '@/lib/prompt'

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const parsed = InputSchema.safeParse(body)
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? 'Invalid input.'
    return Response.json({ error: msg }, { status: 400 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: 'Server is missing an ANTHROPIC_API_KEY. Add one to .env.local.' },
      { status: 500 },
    )
  }

  const { job, cv, tone } = parsed.data

  try {
    const client = new Anthropic() // reads ANTHROPIC_API_KEY from the environment
    const stream = client.messages.stream({
      model: 'claude-opus-4-8',
      max_tokens: 16000,
      system: systemPrompt(tone),
      messages: [{ role: 'user', content: userPrompt(job, cv) }],
    })

    // stream plain text chunks to the client as they arrive
    const encoder = new TextEncoder()
    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              controller.enqueue(encoder.encode(event.delta.text))
            }
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return Response.json({ error: 'Server API key is invalid.' }, { status: 500 })
    }
    if (error instanceof Anthropic.RateLimitError) {
      return Response.json({ error: 'Rate limited. Try again in a minute.' }, { status: 429 })
    }
    if (error instanceof Anthropic.APIError) {
      return Response.json({ error: `Claude API error (${error.status}).` }, { status: 502 })
    }
    return Response.json({ error: 'Something went wrong. Try again.' }, { status: 500 })
  }
}
