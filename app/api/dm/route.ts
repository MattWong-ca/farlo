import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { fid, summary } = await request.json();
    console.log('Sending DM to user:', { fid, summary });

    if (!fid || !summary) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.WARPCAST_API_KEY) {
      console.error('Missing WARPCAST_API_KEY environment variable');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Sanitize API key by removing any non-printable characters
    const apiKey = process.env.WARPCAST_API_KEY.replace(/[^\x20-\x7E]/g, '');
    console.log('API Key length:', apiKey.length);

    try {
      const response = await fetch('https://api.warpcast.com/v2/ext-send-direct-cast', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientFid: fid,
          message: 'nice to meet you!',
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
    } catch (fetchError) {
      console.error('Error making Warpcast API request:', fetchError);
      return NextResponse.json({ 
        error: 'Failed to connect to Warpcast API',
        details: fetchError instanceof Error ? fetchError.message : String(fetchError)
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in DM route:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 