import { NextResponse } from 'next/server';

export async function POST() {
  try {
    console.log('Making request to Neynar API...');
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/frame/catalog?limit=3&time_window=7d`,
      {
        headers: {
          'x-api-key': 'NEYNAR_API_DOCS'
        }
      }
    );

    console.log('Neynar API response status:', response.status);
    const responseText = await response.text();
    console.log('Neynar API response:', responseText);

    if (!response.ok) {
      console.error('Failed to fetch frames:', {
        status: response.status,
        statusText: response.statusText,
        response: responseText
      });
      return NextResponse.json({ 
        error: 'Failed to fetch frames',
        details: responseText
      }, { 
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      return NextResponse.json({ 
        error: 'Invalid response format',
        details: responseText
      }, { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error fetching frames:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
} 