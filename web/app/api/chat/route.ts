import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { content, conversationId } = await req.json();
  const url = process.env.CHAT_SERVICE_URL;
  const key = process.env.CHAT_SERVICE_KEY;

  if (!url || !key) {
    // Mocked response when external service not configured
    return new Response(JSON.stringify({ role: 'assistant', content: `Echo: ${content}` }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({ content, conversationId }),
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' }, status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message ?? 'failed' }), { status: 500 });
  }
}
