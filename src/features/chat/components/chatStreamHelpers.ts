import type { DataChatMessage } from '../types/chatTypes'

export function parseSSELine(line: string): { text?: string; done?: boolean; sources?: DataChatMessage['sources'] } | null {
  if (!line.startsWith('data: ')) return null
  try {
    return JSON.parse(line.slice(6)) as { text?: string; done?: boolean; sources?: DataChatMessage['sources'] }
  } catch {
    return null
  }
}

export async function consumeStream(
  body: ReadableStream<Uint8Array>,
  onChunk: (text: string) => void,
  onDone: (sources: DataChatMessage['sources']) => void,
) {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      const data = parseSSELine(line)
      if (!data) continue
      if (data.text) onChunk(data.text)
      if (data.done) onDone(data.sources ?? null)
    }
  }
}
