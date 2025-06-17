import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const query = url.searchParams.get('query');
  if (!query) {
    return new Response('❌ query 파라미터가 필요합니다.', { status: 400 });
  }

  const partnerCode = process.env.COUPANG_PROFIT_CODE; // 예: czgrWq
  if (!partnerCode) {
    return new Response('❌ COUPANG_PROFIT_CODE 환경 변수가 설정되지 않았습니다.', { status: 500 });
  }

  const encodedQuery = encodeURIComponent(query);
  const searchUrl = `https://www.coupang.com/np/search?q=${encodedQuery}`;
  const trackingImgUrl = `https://link.coupang.com/a/${partnerCode}?subId=${encodedQuery}`;

  const html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8" />
      <title>쿠팡으로 이동 중...</title>
      <meta http-equiv="refresh" content="0; url='${searchUrl}'" />
      <style>
        body { font-family: sans-serif; padding: 2rem; text-align: center; }
      </style>
    </head>
    <body>
      <p>쿠팡 검색 페이지로 이동 중입니다... 🛍️</p>
      <img src="${trackingImgUrl}" width="1" height="1" alt="." />
    </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
