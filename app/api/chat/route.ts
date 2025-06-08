import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { input, previousChatId } = await request.json();

    if (!input) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 });
    }

    const response = await fetch('https://api.vapi.ai/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        assistantId: "f169e7e7-3c14-4f10-adfa-1efe00219990",
        input,
        ...(previousChatId && { previousChatId })
      })
    });

    if (!response.ok) {
      console.error('Vapi API error:', response.status);
      return NextResponse.json({ error: 'Failed to get response from Vapi' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 