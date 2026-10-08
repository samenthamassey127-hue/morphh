import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * GET /api/ollama-status
 * Pings the local Ollama server and returns { ok: boolean, model: string }
 */
export async function GET(_req: NextRequest) {
  const base = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL || 'llama3.2:1b';
  try {
    const res = await fetch(`${base}/api/tags`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) return NextResponse.json({ ok: false, model });
    return NextResponse.json({ ok: true, model });
  } catch {
    return NextResponse.json({ ok: false, model });
  }
}
