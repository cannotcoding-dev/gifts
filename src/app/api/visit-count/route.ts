import { NextResponse } from 'next/server';

export async function GET() {
  // 임시로 더미 데이터 반환 (Supabase 설정 완료 후 실제 데이터로 교체)
  return NextResponse.json({ total: 1234, today: 56 });
} 