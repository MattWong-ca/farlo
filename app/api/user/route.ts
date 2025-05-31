import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');

    if (!fid) {
      return NextResponse.json({ error: 'FID is required' }, { status: 400 });
    }

    // Check if user exists
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('fid', fid)
      .single();

    if (userError) {
      console.error('Error checking user:', userError);
      return NextResponse.json({ error: 'Error checking user' }, { status: 500 });
    }

    const isExistingUser = !!userData;
    let callHistory = [];

    // If user exists, fetch their call history
    if (isExistingUser) {
      const { data: callData, error: callError } = await supabase
        .from('calls')
        .select('*')
        .eq('fid', fid)
        .order('created_at', { ascending: false });

      if (callError) {
        console.error('Error fetching call history:', callError);
        return NextResponse.json({ error: 'Error fetching call history' }, { status: 500 });
      }

      callHistory = callData || [];
    }

    return NextResponse.json({
      isExistingUser,
      callHistory
    });
  } catch (error) {
    console.error('Error in user check:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 