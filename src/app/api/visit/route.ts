import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // 임시로 성공 응답만 반환 (Supabase 설정 완료 후 실제 로깅으로 교체)
  return NextResponse.json({ ok: true });
} 