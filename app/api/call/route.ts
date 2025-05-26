import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_SUPABASE_ANON_KEY || ''
);

export async function POST(request: Request) {
  try {
    const { fid, username, displayName, location, callId } = await request.json();
    console.log('Received data:', { fid, username, displayName, location, callId });

    if (!callId) {
      return NextResponse.json({ error: 'No call ID provided' }, { status: 400 });
    }

    // Fetch summary from Vapi API
    const summaryResponse = await fetch(`https://api.vapi.ai/call/${callId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_API_KEY}`
      }
    });

    if (!summaryResponse.ok) {
      console.error('Failed to fetch summary:', summaryResponse.status);
      return NextResponse.json({ error: 'Failed to fetch summary' }, { status: 500 });
    }

    const summaryData = await summaryResponse.json();
    console.log('Summary data:', summaryData);

    // If call is still in progress, retry with exponential backoff
    if (summaryData.status === 'in-progress') {
      console.log('Call still in progress, starting retry mechanism...');
      
      let retryCount = 0;
      const maxRetries = 5;
      const baseDelay = 1000; // 1 second
      
      while (retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount); // Exponential backoff
        console.log(`Retry attempt ${retryCount + 1}, waiting ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        const retryResponse = await fetch(`https://api.vapi.ai/call/${callId}`, {
          headers: {
            'Authorization': `Bearer ${process.env.VAPI_API_KEY}`
          }
        });
        
        if (!retryResponse.ok) {
          console.error('Failed to fetch summary on retry:', retryResponse.status);
          return NextResponse.json({ error: 'Failed to fetch summary' }, { status: 500 });
        }
        
        const retryData = await retryResponse.json();
        console.log('Retry summary data:', retryData.summary);
        
        if (retryData.status !== 'in-progress') {
          summaryData.summary = retryData.summary;
          break;
        }
        
        retryCount++;
      }
      
      if (retryCount === maxRetries) {
        return NextResponse.json({ error: 'Call still in progress after max retries' }, { status: 400 });
      }
    }

    // Store user data in users table
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        fid: fid,
        username: username,
        display_name: displayName,
        location: location
      }, {
        onConflict: 'fid'
      });

    if (userError) {
      console.error('Error storing user data:', userError);
      return NextResponse.json({ error: 'Failed to store user data' }, { status: 500 });
    }

    // Store call data in calls table
    const { error: callError } = await supabase
      .from('calls')
      .insert({
        fid: fid,
        call_id: callId,
        call_summary: summaryData.summary || ''
      });

    if (callError) {
      console.error('Error storing call data:', callError);
      return NextResponse.json({ error: 'Failed to store call data' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in call API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 