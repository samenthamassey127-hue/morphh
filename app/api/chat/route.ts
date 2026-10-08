import { NextRequest, NextResponse } from 'next/server';
import { buildSystemPrompt } from '@/lib/prompt';
import { StudentProfile, LearningFingerprint } from '@/lib/types';

// Ollama runs locally — do NOT use edge runtime (no Node.js net in edge)
export const runtime = 'nodejs';

const OLLAMA_BASE = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:1b';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages,
      profile,
      fingerprint,
    } = body as {
      messages: Array<{ role: 'user' | 'assistant'; content: string }>;
      profile: StudentProfile;
      fingerprint?: LearningFingerprint;
    };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 });
    }

    const systemPrompt = buildSystemPrompt(profile, fingerprint);

    // Build Ollama chat messages
    const ollamaMessages = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ];

    // Call Ollama streaming endpoint
    const ollamaRes = await fetch(`${OLLAMA_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: ollamaMessages,
        stream: true,
      }),
    });

    if (!ollamaRes.ok) {
      const errText = await ollamaRes.text();
      console.error('Ollama error:', errText);
      return NextResponse.json(
        { error: `Ollama returned ${ollamaRes.status}: ${errText}` },
        { status: 502 }
      );
    }

    // Stream tokens back to the client
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = ollamaRes.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }
        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const raw = decoder.decode(value, { stream: true });
            // Ollama sends newline-delimited JSON objects
            for (const line of raw.split('\n')) {
              if (!line.trim()) continue;
              try {
                const json = JSON.parse(line);
                const token = json?.message?.content ?? '';
                if (token) controller.enqueue(encoder.encode(token));
                if (json?.done) {
                  controller.close();
                  return;
                }
              } catch {
                // partial JSON — skip
              }
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Model': OLLAMA_MODEL,
      },
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
