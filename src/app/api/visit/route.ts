import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || '';
  const user_agent = req.headers.get('user-agent') || '';
  await supabase.from('visit_logs').insert([{ ip, user_agent }]);
  return NextResponse.json({ ok: true });
} 