'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import Image from 'next/image';
import { Range } from 'react-range';

interface FormData {
  relationship: string;
  gender: string;
  age: number;
  mbti: string;
  note: string;
  minPrice: number;
  maxPrice: number;
}

const relationships = [
  { value: 'family', label: '가족' },
  { value: 'friend', label: '친구' },
  { value: 'lover', label: '연인' },
  { value: 'colleague', label: '동료' }
];

const genders = [
  { value: 'male', label: '남성' },
  { value: 'female', label: '여성' }
];

const inputBoxStyle: CSSProperties = {
  width: '100%',
  marginTop: 6,
  padding: '12px 10px',
  borderRadius: 10,
  border: '1.5px solid #e9d5ff',
  fontSize: 15,
  background: '#f5f3ff',
  color: '#4b2997',
  outline: 'none',
  transition: 'border 0.2s',
  marginBottom: 2,
  boxSizing: 'border-box',
  height: 44
};

async function fetchGiftRecommendation(formData: FormData): Promise<string> {
  const res = await fetch('/api/gemini-gift', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  if (!res.ok) return '추천 결과를 불러오지 못했습니다.';
  const data = await res.json();
  return data.result || '추천 결과를 불러오지 못했습니다.';
}

function parseGeminiResult(result: string): { rank: string; name: string; desc: string }[] {
  const lines = result.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const cards = [];
  for (let i = 0; i < lines.length - 1; i += 2) {
    const rankMatch = lines[i].match(/(TOP\d)/i);
    const name = lines[i].replace(/TOP\d\s*[\S\s]*?\s*/i, '').trim() || lines[i].replace(/TOP\d\s*/i, '').trim();
    const desc = lines[i + 1].replace(/^이유:?\s*/, '').trim();
    if (rankMatch && name && desc) {
      cards.push({ rank: rankMatch[1], name, desc });
    }
  }
  return cards;
}

export default function Home() {
  const [step, setStep] = useState<'form' | 'loading' | 'result'>('form');
  const [formData, setFormData] = useState<FormData>({
    relationship: '',
    gender: '',
    age: 0,
    mbti: '',
    note: '',
    minPrice: 0,
    maxPrice: 100000
  });
  const [result, setResult] = useState<string>('');
  const [visitCount, setVisitCount] = useState({ today: 0, total: 0 });

  useEffect(() => {
    // 방문 기록 저장
    fetch('/api/visit', { method: 'POST' });
    // 방문자 카운트 가져오기
    fetch('/api/visit-count')
      .then(res => res.json())
      .then(data => setVisitCount(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');
    const res = await fetchGiftRecommendation(formData);
    setResult(res);
    setStep('result');
  };

  const cards = parseGeminiResult(result);
  if (typeof window !== 'undefined') {
    console.log('Gemini result:', result);
    console.log('Parsed cards:', cards);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'url("/background.png") center/cover no-repeat', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}>
        <div style={{ maxWidth: 400, margin: '0 auto', padding: '40px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* 일러스트/캐릭터 자리 */}
          <div style={{ width: 120, height: 120, marginBottom: 24, background: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #e0e0e0' }}>
            {/* 여기에 직접 이미지를 넣으세요 */}
            <span style={{ color: '#a78bfa', fontSize: 32 }}>★</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, textAlign: 'center', color: '#312e81' }}>
            {step === 'result' ? '기프티가 추천한 선물 결과입니다!' : '선물 뭐 해야 할지 고민이신가요?'}
          </h1>
          <p style={{ fontSize: 16, color: '#6d28d9', marginBottom: 32, textAlign: 'center' }}>
            {step === 'result'
              ? '아래에서 추천 선물과 이유를 확인해보세요.'
              : '몇 가지만 알려주세요.\n감성 요정이 대신 고민해드립니다.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, margin: '0 0 18px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#ede9fe', borderRadius: 8, padding: '4px 14px', boxShadow: '0 1px 4px #e9d5ff', fontSize: 13, color: '#7c3aed', fontWeight: 600, letterSpacing: '0.2px' }}>
              <span style={{ marginRight: 6, fontSize: 15 }}>📅</span>Today&nbsp;<span style={{ color: '#4b2997', fontWeight: 700, marginLeft: 2 }}>{visitCount.today.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', background: '#ede9fe', borderRadius: 8, padding: '4px 14px', boxShadow: '0 1px 4px #e9d5ff', fontSize: 13, color: '#7c3aed', fontWeight: 600, letterSpacing: '0.2px' }}>
              <span style={{ marginRight: 6, fontSize: 15 }}>👥</span>Total&nbsp;<span style={{ color: '#4b2997', fontWeight: 700, marginLeft: 2 }}>{visitCount.total.toLocaleString()}</span>
            </div>
          </div>

          {step === 'form' && (
            <form
              onSubmit={handleSubmit}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.85)',
                borderRadius: 20,
                padding: 28,
                boxShadow: '0 4px 24px 0 rgba(160, 120, 255, 0.10)',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                backdropFilter: 'blur(2px)',
                border: '1.5px solid #e9d5ff',
                marginBottom: 16
              }}
            >
              <label style={{ fontWeight: 600, color: '#7c3aed', fontSize: 15, marginBottom: 2 }}>
                상대방과의 관계
                <select
                  value={formData.relationship}
                  onChange={e => setFormData({ ...formData, relationship: e.target.value })}
                  style={inputBoxStyle}
                >
                  <option value="">선택하세요</option>
                  {relationships.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </label>
              <label style={{ fontWeight: 600, color: '#7c3aed', fontSize: 15, marginBottom: 2 }}>
                상대방 성별
                <select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value })}
                  style={inputBoxStyle}
                >
                  <option value="">선택하세요</option>
                  {genders.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </label>
              <label style={{ fontWeight: 600, color: '#7c3aed', fontSize: 15, marginBottom: 2 }}>
                상대방 나이
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={formData.age || ''}
                  onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) })}
                  style={inputBoxStyle}
                  placeholder="예: 25"
                />
              </label>
              <label style={{ fontWeight: 600, color: '#7c3aed', fontSize: 15, marginBottom: 2 }}>
                상대방 MBTI
                <input
                  type="text"
                  maxLength={4}
                  value={formData.mbti}
                  onChange={e => setFormData({ ...formData, mbti: e.target.value.toUpperCase() })}
                  style={inputBoxStyle}
                  placeholder="예: ENFP"
                />
              </label>
              <label style={{ fontWeight: 600, color: '#7c3aed', fontSize: 15, marginBottom: 2 }}>
                가격 범위 (₩)
                <div style={{ marginTop: 12, marginBottom: 8 }}>
                  <Range
                    step={10000}
                    min={0}
                    max={1000000}
                    values={[formData.minPrice, formData.maxPrice]}
                    onChange={values => {
                      const [a, b] = values;
                      setFormData({ ...formData, minPrice: Math.min(a, b), maxPrice: Math.max(a, b) });
                    }}
                    renderTrack={({ props, children }) => (
                      <div
                        {...props}
                        style={{
                          ...props.style,
                          height: '6px',
                          width: '100%',
                          backgroundColor: '#e9d5ff',
                          borderRadius: '3px',
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            height: '6px',
                            width: `${((formData.maxPrice - formData.minPrice) / 1000000) * 100}%`,
                            left: `${(formData.minPrice / 1000000) * 100}%`,
                            backgroundColor: '#7c3aed',
                            borderRadius: '3px',
                          }}
                        />
                        {children}
                      </div>
                    )}
                    renderThumb={({ props }) => (
                      <div
                        {...props}
                        style={{
                          ...props.style,
                          height: '20px',
                          width: '20px',
                          backgroundColor: '#fff',
                          border: '2px solid #7c3aed',
                          borderRadius: '50%',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                      />
                    )}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6d28d9' }}>
                  <span>최소: {formData.minPrice.toLocaleString()}원</span>
                  <span>최대: {formData.maxPrice.toLocaleString()}원</span>
                </div>
              </label>
              <label style={{ fontWeight: 600, color: '#7c3aed', fontSize: 15, marginBottom: 2 }}>
                기타사항
                <textarea
                  value={formData.note}
                  onChange={e => setFormData({ ...formData, note: e.target.value })}
                  style={{ ...inputBoxStyle, resize: 'none' }}
                  rows={3}
                  placeholder="선물 받는 분의 취향이나 상황 등"
                />
              </label>
              <button
                type="submit"
                style={{
                  marginTop: 10,
                  background: 'linear-gradient(90deg, #a78bfa 0%, #7c3aed 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 17,
                  border: 'none',
                  borderRadius: 10,
                  padding: '14px 0',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px #e9d5ff',
                  letterSpacing: '0.5px',
                  transition: 'background 0.2s, transform 0.1s',
                }}
                onMouseOver={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)')}
                onMouseOut={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #a78bfa 0%, #7c3aed 100%)')}
                onFocus={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)')}
                onBlur={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #a78bfa 0%, #7c3aed 100%)')}
              >
                선물 추천받기
              </button>
            </form>
          )}

          {step === 'loading' && (
            <div style={{ width: '100%', background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 2px 8px #e0e0e0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Image src="/loading.gif" alt="로딩중" width={80} height={80} style={{ marginBottom: 16 }} />
              <div style={{ color: '#a78bfa', fontWeight: 600, fontSize: 18 }}>감성 요정이 선물을 고민중이에요...</div>
            </div>
          )}

          {step === 'result' && (
            <div style={{ width: '100%', background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 4px 24px 0 rgba(160, 120, 255, 0.10)', display: 'flex', flexDirection: 'column', gap: 28 }}>
              {/* Gemini 결과 카드 출력 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                {parseGeminiResult(result).map((item, idx) => (
                  <div key={idx} style={{ borderRadius: 16, background: '#f5f3ff', padding: '22px 20px', color: '#4b2997', fontSize: 16, boxShadow: '0 2px 12px #e9d5ff', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#fff', background: '#a78bfa', borderRadius: 8, padding: '2px 12px', marginBottom: 4, marginLeft: -4, letterSpacing: '0.5px', boxShadow: '0 1px 4px #e9d5ff', display: 'inline-block' }}>{item.rank}</div>
                    <div style={{ fontWeight: 700, color: '#6d28d9', fontSize: 19, marginBottom: 2, lineHeight: 1.3 }}>{item.name}</div>
                    <div style={{ color: '#4b2997', fontSize: 15, lineHeight: 1.7, marginBottom: 8 }}>{item.desc}</div>
                    <a
                      href={`/api/go?query=${encodeURIComponent(item.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginTop: 4,
                        background: 'linear-gradient(90deg, #a78bfa 0%, #7c3aed 100%)',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 15,
                        border: 'none',
                        borderRadius: 8,
                        padding: '10px 0',
                        textAlign: 'center',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px #e9d5ff',
                        letterSpacing: '0.5px',
                        transition: 'background 0.2s, transform 0.1s',
                        width: '100%'
                      }}
                      onMouseOver={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)')}
                      onMouseOut={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #a78bfa 0%, #7c3aed 100%)')}
                    >
                      선물 구매하러 가기
                    </a>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 18, justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ relationship: '', gender: '', age: 0, mbti: '', note: '', minPrice: 0, maxPrice: 100000 });
                    setResult('');
                    setStep('form');
                  }}
                  style={{
                    flex: 1,
                    background: '#ede9fe',
                    color: '#7c3aed',
                    fontWeight: 700,
                    fontSize: 16,
                    border: 'none',
                    borderRadius: 10,
                    padding: '15px 0',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px #e9d5ff',
                    letterSpacing: '0.5px',
                    transition: 'background 0.2s, color 0.2s',
                    maxWidth: 220
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = '#d1c4e9';
                    e.currentTarget.style.color = '#4b2997';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = '#ede9fe';
                    e.currentTarget.style.color = '#7c3aed';
                  }}
                >
                  한번 더하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <footer style={{ width: '100%', textAlign: 'center', color: '#a78bfa', fontSize: 14, padding: '32px 0 18px 0', letterSpacing: '0.2px' }}>
        © 2025 코딩모르는개발자. All rights reserved.
      </footer>
    </div>
  );
}
