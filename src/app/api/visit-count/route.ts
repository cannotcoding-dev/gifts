import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  // 누적 방문자
  const { count: total } = await supabase
    .from('visit_logs')
    .select('id', { count: 'exact', head: true });

  // 오늘 방문자
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { count: todayCount } = await supabase
    .from('visit_logs')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', today.toISOString());

  return NextResponse.json({ total: total || 0, today: todayCount || 0 });
} 