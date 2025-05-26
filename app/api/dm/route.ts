import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { fid, summary } = await request.json();
    console.log('Sending DM to user:', { fid, summary });

    if (!fid || !summary) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const response = await fetch('https://api.warpcast.com/v2/ext-send-direct-cast', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.WARPCAST_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientFid: fid,
        message: summary,
        idempotencyKey: uuidv4()
      })
    });

    if (!response.ok) {
      console.error('Failed to send DM:', response.status);
      return NextResponse.json({ error: 'Failed to send DM' }, { status: response.status });
    }

    const result = await response.json();
    console.log('DM sent successfully:', result);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending DM:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 