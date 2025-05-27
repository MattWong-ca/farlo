import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // if (!process.env.NEYNAR_API_KEY) {
    //   console.error('Missing NEYNAR_API_KEY environment variable');
    //   return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    // }

    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/frame/catalog?limit=3&time_window=7d`,
      {
        headers: {
          'x-api-key': 'NEYNAR_API_DOCS'
        }
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch frames:', response.status);
      return NextResponse.json({ error: 'Failed to fetch frames' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error fetching frames:', error);
    return NextResponse.json({ error: 'Internal server error' }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
} 