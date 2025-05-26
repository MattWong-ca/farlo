import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_SUPABASE_ANON_KEY || ''
);

export async function POST(request: Request) {
  try {
    const { fid, username, displayName, location, callId, summary } = await request.json();

    // Store user data in users table
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        fid: fid,
        username: username,
        display_name: displayName,
        location: location,
        updated_at: new Date().toISOString()
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
        summary: summary || '',
        created_at: new Date().toISOString()
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