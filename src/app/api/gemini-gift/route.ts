import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { relationship, gender, age, mbti, note, minPrice, maxPrice } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ result: 'API 키가 설정되지 않았습니다.' }, { status: 500 });
  }

  // Gemini 프롬프트: 실물 선물만, 2줄씩 3세트, 이유는 150자 내외, 예시 명확히
  const prompt = `아래 정보를 참고해서 해당 유저에게 가장 적절한 선물 3개를 추천해줘.\n- 관계: ${relationship || '미입력'}\n- 성별: ${gender || '미입력'}\n- 나이: ${age || '미입력'}\n- MBTI: ${mbti || '미입력'}\n- 비고: ${note || '미입력'}\n- 최소 가격: ${minPrice || 0}원\n- 최대 가격: ${maxPrice || 1000000}원\n\n쿠팡 등 온라인몰에서 현금으로 바로 구매할 수 있는 실물 선물(예: 가전, 패션, 뷰티, 식품, 도서, 취미용품 등)만 추천해줘. 체험권, 클래스, 여행, 티켓 등은 제외해줘. 반드시 위 가격 범위 내에서만 추천해줘.\n\n각 선물은 아래와 같은 2줄 형식으로, TOP1, TOP2, TOP3 순서로 3개만 출력해줘. 각 선물의 이유는 150자 내외로, 왜 이 선물이 어울리는지 구체적으로 써줘. 불필요한 설명, 배열 기호, 줄바꿈 등은 금지.\n\n예시:\nTOP1 무선 이어폰\n이유: 음악을 좋아하고 활동적인 분께 실용적이면서도 감각적인 선물이에요. 일상에서 자주 사용할 수 있어 만족도가 높아요.\nTOP2 디퓨저 세트\n이유: 집이나 사무실에서 은은한 향기로 힐링할 수 있어요. 감성적인 분위기를 좋아하는 분께 추천해요.\nTOP3 베스트셀러 에세이\n이유: 책을 좋아하는 분께 마음을 전할 수 있는 선물이에요. 따뜻한 글귀가 위로와 영감을 줄 거예요.`;

  try {
    const geminiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    const data = await geminiRes.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '추천 결과를 불러오지 못했습니다.';
    return NextResponse.json({ result: text });
  } catch {
    return NextResponse.json({ result: '추천 결과를 불러오지 못했습니다.' }, { status: 500 });
  }
} 