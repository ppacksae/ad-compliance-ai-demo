// ── Citation 상수 ────────────────────────────────────────────────────────────
export const C_POLICY_57 = {
  type: 'policy',
  title: '자본시장법 제57조',
  desc: '허위·과장 표현 금지 — 확실성을 보증하는 표현 사용 불가',
  detail: '제57조 제1항: 금융투자업자는 금융투자상품에 관한 광고를 하는 경우 수익률, 투자위험 등 투자자의 합리적 판단에 영향을 미칠 수 있는 중요 사항을 누락하거나 왜곡하여서는 아니 되며, 특히 미래의 수익률을 단정적으로 보장하거나 오인하게 할 우려가 있는 표현을 사용하여서는 아니 된다.',
  source: '사내 광고 심의 기준 v2.1 (2024.09)',
}
export const C_REJECTED_0071 = {
  type: 'rejected',
  title: "'보장' 표현 포함 소재 반려",
  desc: '자본시장법 위반 소지 — 수익률 수치와 함께 사용 시 반려',
  detail: "2024년 11월 배포 예정이던 'VIP 펀드' 사전검토안에서 수익 100% 보장 단어를 사용해 권고 1차 기각. 강도 높은 수정 지시 후 '수익 추구'로 완화하여 최종 컨펌됨.",
  date: '2024.11.20', approver: '컴플팀 이민준', caseId: 'COMP-2024-0071',
}
export const C_APPROVED_0089 = {
  type: 'approved',
  title: "'수익률 추구' 표현 승인",
  desc: "'보장' → '추구' 변경 후 법무팀 최종 승인",
  detail: "수치적 보장 표현이 제거되고 펀드가 지향하는 목표치로서 '목표 수익 추구' 형태로 풀어서 기재해 내부 가이드라인 심의 통과 (기각 사례 인용).",
  date: '2025.03.15', approver: '법무팀 김민호', caseId: 'COMP-2025-0089',
}
export const C_CONSUMER_21 = {
  type: 'policy',
  title: '금융소비자보호법 제21조',
  desc: '수익률 예시 제시 시 표준 표현 준수 및 부연 설명 필요',
  detail: '제21조 (부당권유행위 금지): 과거의 수익률이나 미래의 예상 수익률을 제시할 때, 해당 수치가 확정적인 것처럼 오인하게 하거나 사실과 다르게 부풀려 설명하는 행위를 엄격히 금지함.',
  source: '금융소비자보호 가이드라인 (2025.01)',
}
export const C_INTERNAL_GUIDE = {
  type: 'policy',
  title: '사내 광고 심의 기준 v2.1',
  desc: '즉시성·긴박감을 조성하는 표현은 검토 필요',
  detail: '마케팅 집행 시 "지금 당장", "선착순 무조건 지급" 등의 표현은 소비자의 합리적 인식을 저해할 수 있어 부서장 전결로 승인하거나 조건부 승인을 득해야 함.',
  source: '마케팅 심의 가이드라인 (2024.09)',
}
export const C_REJECTED_MUJO = {
  type: 'rejected',
  title: "'무조건' 표현 포함 소재 반려",
  desc: '자본시장법 위반 — 절대적 확실성 암시 표현',
  detail: "'주식 하락장에도 무조건 수익' 문구가 발견되어 금융소비자보호 위원회 직권 취소. 절대성을 띄는 표현은 예외 없이 삭제해야 함.",
  date: '2025.01.08', approver: '법무팀 이민준', caseId: 'COMP-2025-0003',
}

// ── 배너 시나리오 ────────────────────────────────────────────────────────────
export const BANNERS = [
  {
    id: 'bannerA',
    name: '봄 캠페인 배너 v1.2',
    submitter: '마케팅팀 박지영',
    submittedAt: '2026.04.10',
    channel: '앱 메인 배너',
    period: '2026.04.15 ~ 2026.04.30',
    target: '30-40대 직장인',
    colorScheme: 'orange',
    ocrTexts: [
      { text: '수익률 200% 보장!', flagged: true },
      { text: '지금 당장 가입하세요', flagged: true },
      { text: '투자원금은 보장되지 않습니다', flagged: false },
    ],
    overallRisk: 'HIGH',
    summary: '제출하신 배너 소재에서 자본시장법 위반 가능성이 가장 높은 "보장" 이라는 절대적 확실성 암시 키워드가 발견되었습니다. 긴박감을 조성하는 단어도 함께 포함되어 있어 컴플라이언스 리스크가 매우 높은 상태입니다. 아래 제안해 드린 완화된 표현으로 수정하신 후 재검토를 요청해주시면 빠른 승인이 가능합니다.',
    legalSummary: '마케팅팀에서 제출한 설계안에서 자본시장법 제57조(허위·과장 표현 금지)를 정면으로 배제할 소지가 짙은 "보장" 키워드가 직접 식별되었습니다. 또한 긴급 액션을 유도하는 표현이 결합되어 있어 불완전판매 리스크 요인이 강합니다. 과거 COMP-2024-0071 반려 선례의 핵심 논점과 정확히 일치하므로 반려 혹은 강경한 수정 지시 후 재기안을 요청하실 것을 제언합니다.',
    riskSummary: { HIGH: 1, MEDIUM: 1 },
    issues: [
      {
        id: 1, level: 'HIGH',
        flaggedText: "'수익률 200% 보장!'",
        flaggedWord: '보장',
        rule: '허위·과장 표현 금지',
        citations: [C_POLICY_57, C_REJECTED_0071],
        alternative: '수익률 200% 추구! 지금 바로 확인해보세요',
        alternativeNote: "'보장' → '추구' 변경 시 승인 가능성이 높습니다",
      },
      {
        id: 2, level: 'MEDIUM',
        flaggedText: "'지금 당장 가입하세요'",
        flaggedWord: '당장',
        rule: '충동 유발 표현 — 맥락 검토 필요',
        citations: [C_INTERNAL_GUIDE],
        alternative: '지금 시작해보세요',
        alternativeNote: '즉시성 표현 완화 권장',
      },
    ],
    status: 'AI_FLAGGED',
  },
  {
    id: 'bannerB',
    name: '여름 이벤트 배너 v2.0',
    submitter: '디지털마케팅팀 김수현',
    submittedAt: '2026.04.09',
    channel: 'SNS 피드 광고',
    period: '2026.05.01 ~ 2026.05.31',
    target: '20-30대',
    colorScheme: 'blue',
    ocrTexts: [
      { text: '연 8% 수익 기대', flagged: true },
      { text: '국내 ETF로 스마트하게', flagged: false },
      { text: '투자원금은 보장되지 않습니다', flagged: false },
    ],
    overallRisk: 'MEDIUM',
    summary: '제출하신 SNS 소재는 전반적으로 깔끔하게 잘 기획되었으나, "연 8% 수익 기대"라는 구체적 수치 표현이 포함되어 있어 금융소비자에게 오해를 유발할 소지가 감지되었습니다. 불필요한 수치를 제외하고 중립적 표현으로 다듬으시면 훨씬 안전하게 캠페인을 집행하실 수 있습니다.',
    legalSummary: '제출된 SNS 캠페인 소재는 전반적 맥락에서 결격 사유가 크게 없으나, "연 8% 수익 기대"라는 구체적 수익률 명시가 포함되어 있습니다. 이는 금융소비자보호법 제21조에 기반하여 소비자에게 확정된 수익으로 오인될 수 있는 고질적 리스크 포인트입니다. 과거 COMP-2025-0089 승인 선례를 바탕으로 수치를 제거하고 "수익 추구"로 우회할 수 있도록 안전한 수정 가이드를 내리시는 것이 좋습니다.',
    riskSummary: { HIGH: 0, MEDIUM: 1 },
    issues: [
      {
        id: 1, level: 'MEDIUM',
        flaggedText: "'연 8% 수익 기대'",
        flaggedWord: '수익 기대',
        rule: '수익률 예시 표현 — 오해 소지 가능',
        citations: [C_CONSUMER_21, C_APPROVED_0089],
        alternative: '국내 ETF 분산투자로 수익 추구',
        alternativeNote: "수치 제거 후 '수익 추구' 사용 시 승인 이력 있음",
      },
    ],
    status: 'AI_FLAGGED',
  },
  {
    id: 'bannerC',
    name: '추석 이벤트 배너 v1.0',
    submitter: '브랜드팀 이소연',
    submittedAt: '2026.04.08',
    channel: '앱 팝업',
    period: '2026.04.01 ~ 2026.04.07',
    target: '전 연령',
    colorScheme: 'green',
    ocrTexts: [
      { text: 'ETF 분산투자 시작하세요', flagged: false },
      { text: '다양한 자산에 한 번에 투자', flagged: false },
      { text: '투자원금은 보장되지 않습니다', flagged: false },
    ],
    overallRisk: 'LOW',
    summary: '제출하신 기획안에서는 금지어나 과장된 표현이 전혀 감지되지 않았으며, 필수 고지 문구(투자원금 보장 불가)도 누락 없이 깨끗하게 포함되어 있어 매우 훌륭합니다. 이 소재는 당장 집행해도 문제가 없을 것으로 보이며, 법무팀 빠른 승인(Fast-track)으로 전송해 드릴 수 있습니다.',
    legalSummary: '해당 기획안의 OCR 분석 결과, 주요 리스크 문구나 과장 표기(절대적 긍정, 손실 회피 암시 등)가 일절 검출되지 않았습니다. 아울러 상품 노출에 따른 법적 필수 고지 사항("투자원금은 보장되지 않습니다")이 명확히 식별되었습니다. 당사 컴플라이언스 가이드라인 v2.1에 오차 없이 부합하므로 담당자님의 승인 검토에 소요될 시간을 대폭 단축해 Fast-track 처리할 것을 권장합니다.',
    riskSummary: { HIGH: 0, MEDIUM: 0 },
    issues: [],
    status: 'AI_APPROVED',
  },
]

export const EXTRA_BANNERS = [
  {
    id: 'bannerD',
    name: '가을 ETF 기획전',
    submitter: '박준실',
    submittedAt: '2026.04.11',
    channel: '앱 메인 배너',
    period: '2026.04.15 ~ 2026.04.30',
    target: '전 연령',
    colorScheme: 'orange',
    ocrTexts: [
      { text: '안전한 자산관리 플랫폼', flagged: false },
    ],
    overallRisk: 'MEDIUM',
    summary: 'AI 사전 진단 결과, 원금 손실 가능성을 고지하는 필수안내 문구가 누락되었습니다. 관련 문구를 추가하여 재업로드 해주세요.',
    legalSummary: 'AI가 진단한 대로 원금손실 고지 문구를 추가해서 수정안으로 재상신해 주세요.',
    riskSummary: { HIGH: 0, MEDIUM: 1 },
    issues: [
      {
        id: 1, level: 'MEDIUM',
        flaggedText: '고지 문구 누락 확인',
        flaggedWord: '원금보장 고지 부재',
        rule: '필수 고지 문구 누락',
        citations: [C_CONSUMER_21],
        alternative: "하단에 '투자원금은 보장되지 않습니다' 고지 문구 추가",
        alternativeNote: "금융투자상품 광고 시 해당 고지 문구는 필수입니다."
      }
    ],
    status: 'AI_FLAGGED',
  },
  {
    id: 'bannerE',
    name: '해외주식 100% 당첨 이벤트',
    submitter: '최법무',
    submittedAt: '2026.04.12',
    channel: '이벤트 페이지',
    period: '2026.05.01 ~ 2026.05.31',
    target: '신규 고객',
    colorScheme: 'blue',
    ocrTexts: [
      { text: '100% 당첨 보장', flagged: true },
    ],
    overallRisk: 'HIGH',
    summary: '100% 당첨 보장이라는 표현은 심각한 소비자 기만 행위 및 자본시장법 위반 요소를 내포하고 있습니다.',
    legalSummary: '해당 이벤트 메인 문구의 100% 당첨 보장이라는 표현은 현행 자본시장법 위반 소지가 명백합니다. 기획안의 당첨 로직을 다시 점검하시고, 절대적 확실성을 암시하는 표현을 삭제하시기 바랍니다.',
    riskSummary: { HIGH: 1, MEDIUM: 0 },
    issues: [
      {
        id: 1, level: 'HIGH',
        flaggedText: "'100% 당첨 보장'",
        flaggedWord: '보장',
        rule: '절대적 확실성 표현 불가',
        citations: [C_POLICY_57, C_REJECTED_MUJO],
        alternative: "전원 증정 이벤트",
        alternativeNote: "보장이라는 단어를 삭제하고, 증정 조건이 있다면 반드시 명시해야 합니다."
      }
    ],
    status: 'AI_FLAGGED',
  },
]

// Agent 실행 단계 — 배너 업로드
export const BANNER_STEPS = [
  { tool: 'OCR_Tool', icon: 'scan', desc: '배너 이미지 텍스트 추출 중...' },
  { tool: 'Compliance_Check_Tool', icon: 'check', desc: '금지어 및 필수 고지 문구 검토 중...' },
  { tool: 'RAG_Search_Tool', icon: 'search', desc: '유사 선례 검색 중 (3-Tier VDB)...' },
  { tool: 'Risk_Scoring_Tool', icon: 'score', desc: '리스크 등급 산출 및 수정 가이드 생성 중...' },
]

// Agent 실행 단계 — 챗봇
export const CHAT_STEPS = [
  { tool: 'Compliance_Check_Tool', icon: 'check', desc: '금지어 및 필수 고지 문구 검토 중...' },
  { tool: 'RAG_Search_Tool', icon: 'search', desc: '유사 선례 검색 중 (3-Tier VDB)...' },
  { tool: 'Risk_Scoring_Tool', icon: 'score', desc: '리스크 등급 산출 중...' },
]

export const BANNER_REVIEW_STEPS = [
  { tool: 'Plan_Tool', icon: 'plan', desc: 'Master Agent — 실행 계획 수립 완료' },
  { tool: 'OCR_Tool', icon: 'ocr', desc: '이미지 텍스트 추출 (OCR) + 금지어 체크' },
  { tool: 'RAG_Search_Tool', icon: 'search', desc: '선례 검색 (RAG) — 3-Tier VDB 검색' },
  { tool: 'Risk_Scoring_Tool', icon: 'score', desc: '리스크 등급 산출 중...' },
]

// ── 채팅 시나리오 분기 ────────────────────────────────────────────────────────
export function buildChatResponse(input) {
  const t = input

  if (/보장|원금 보장|손실 없음|100% 안전/.test(t)) {
    const flagged = t.match(/보장|원금 보장|손실 없음|100% 안전/g) || []
    return {
      risk: 'HIGH',
      summary: `'${flagged[0]}' 표현이 포함되어 있습니다. 자본시장법 제57조 위반 소지가 높으며, 동일 표현 소재의 반려 이력이 있습니다. 즉시 수정이 필요합니다.`,
      flaggedTerms: [...new Set(flagged)],
      citations: [C_POLICY_57, C_REJECTED_0071],
      alternative: t.replace(/보장/g, '추구').replace(/원금 보장/g, '').replace(/손실 없음/g, '').trim(),
      alternativeNote: "'보장' → '추구' 변경 시 승인 가능성이 높습니다 (선례 COMP-2025-0089 참조)",
    }
  }

  if (/무조건|확실한 수익|절대/.test(t)) {
    return {
      risk: 'HIGH',
      summary: '절대적 확실성을 암시하는 표현이 포함되어 있습니다. 금융 광고에서 사용이 금지된 표현입니다.',
      flaggedTerms: (t.match(/무조건|확실한 수익|절대/g) || []),
      citations: [C_POLICY_57, C_REJECTED_MUJO],
      alternative: t.replace(/무조건/g, '').replace(/확실한 수익/g, '수익 추구').replace(/절대/g, '').trim(),
      alternativeNote: '해당 표현을 삭제하거나 중립적 표현으로 교체하세요',
    }
  }

  if (/연 \d+%|월 \d+%|수익률 \d+%|2배/.test(t)) {
    const matched = t.match(/(?:연|월|수익률) \d+%|시장 평균 \d+배/)?.[0] || '수익률 수치'
    return {
      risk: 'MEDIUM',
      summary: `구체적 수익률 수치(${matched}) 표현은 오해를 유발할 수 있습니다. 표준 부연 설명 추가 또는 수치 없이 표현하는 것을 권장합니다.`,
      flaggedTerms: [matched],
      citations: [C_CONSUMER_21, C_APPROVED_0089],
      alternative: t.replace(/연 \d+%|월 \d+%|수익률 \d+%/, '수익 추구').replace(/시장 평균 \d+배 수익률 달성 가능한/, '분산투자 중심의').trim(),
      alternativeNote: "수치 제거 후 '수익 추구' 표현 사용 시 승인 이력 있음",
    }
  }

  if (/추구/.test(t)) {
    return {
      risk: 'LOW',
      summary: "'추구' 표현은 과거 승인 선례가 있으며 자본시장법 기준을 충족합니다. 필수 고지 문구 포함 여부를 최종 확인하세요.",
      flaggedTerms: [],
      citations: [C_APPROVED_0089],
      alternative: null, alternativeNote: null,
    }
  }

  if (/ETF|분산|적립|인덱스|펀드|이벤트|혜택|계좌/.test(t)) {
    return {
      risk: 'LOW',
      summary: "위험 표현이 감지되지 않았습니다. '투자원금은 보장되지 않습니다' 고지 문구 포함 여부를 반드시 확인하세요.",
      flaggedTerms: [],
      citations: [{
        type: 'approved', title: 'ETF 관련 광고 문구 승인',
        desc: '분산투자·인덱스 관련 중립 표현 — 다수 승인 이력 있음',
        date: '2025.02.20', approver: '법무팀 정현수', caseId: 'COMP-2025-0056',
      }],
      alternative: null, alternativeNote: null,
    }
  }

  return {
    risk: 'MEDIUM',
    summary: '명확한 위반은 감지되지 않았으나, 유사 선례 검토 및 법무 확인이 필요합니다.',
    flaggedTerms: [],
    citations: [C_INTERNAL_GUIDE],
    alternative: null, alternativeNote: null,
  }
}

// ── 챗봇 예시 카드 ───────────────────────────────────────────────────────────
export const CHAT_EXAMPLES = [
  { text: '수익률 200% 보장! 지금 당장 가입하세요 — 한정 혜택',  risk: 'HIGH',   tag: '위반 예시' },
  { text: '원금 손실 없는 무조건 수익! 지금 바로 시작하세요',     risk: 'HIGH',   tag: '위반 예시' },
  { text: '연 8% 수익 기대, 국내 ETF로 스마트하게 투자하세요',   risk: 'MEDIUM', tag: '검토 필요' },
  { text: '시장 평균 2배 수익률 달성 가능한 포트폴리오',          risk: 'MEDIUM', tag: '검토 필요' },
  { text: 'ETF 분산투자로 안정적인 미래를 준비하세요',           risk: 'LOW',    tag: '승인 가능' },
  { text: '카카오페이증권 봄 이벤트 — 신규 계좌 개설 혜택',      risk: 'LOW',    tag: '승인 가능' },
]

// ── 내 진행 현황 데이터 ──────────────────────────────────────────────────────
export const MY_PROGRESS_ITEMS = [
  {
    id: 'p1', name: '봄 캠페인 배너 v1.2', submittedAt: '2026.04.10',
    status: '법무 검토중', statusType: 'review',
    aiRisk: 'HIGH', legalManager: '김법무', elapsed: '2일',
    bannerId: 'bannerA',
  },
  {
    id: 'p2', name: '여름 이벤트 배너 v2.0', submittedAt: '2026.04.08',
    status: 'AI 검토완료', statusType: 'ai_done',
    aiRisk: 'MEDIUM', legalManager: null, elapsed: '4일',
    bannerId: 'bannerB',
  },
  {
    id: 'p3', name: '추석 이벤트 배너 v1.0', submittedAt: '2026.03.20',
    status: '승인완료', statusType: 'approved',
    aiRisk: 'LOW', legalManager: '이컴플', elapsed: '완료',
    bannerId: 'bannerC', legalComment: 'ETF 관련 중립 표현 사용, 과장·허위 표현 없음. 필수 고지 문구 포함 확인 완료. 사내 광고 심의 기준 v2.1 기준 위반 사항 없음. 즉시 집행 승인.',
  },
  {
    id: 'p4', name: '가을 ETF 기획전', submittedAt: '2026.04.11',
    status: '수정 요청', statusType: 'revision',
    aiRisk: 'MEDIUM', legalManager: '박준실', elapsed: '완료',
    bannerId: 'bannerD', legalComment: 'AI 사전 진단 결과대로 \'투자원금은 보장되지 않습니다\'라는 필수 고지 문구가 누락되었습니다. 관련 규정에 의거하여 투자 위험성을 하단에 명시해야 하므로 해당 문구를 추가한 뒤 재검토를 요청하시기 바랍니다.',
  },
  {
    id: 'p5', name: '해외주식 100% 당첨 이벤트', submittedAt: '2026.04.12',
    status: '반려', statusType: 'rejected',
    aiRisk: 'HIGH', legalManager: '최법무', elapsed: '완료',
    bannerId: 'bannerE', legalComment: '\'해외주식 100% 당첨 보장\'이라는 문구는 명백한 과장 광고 및 불법적인 손실 보전/이익 보장 약속으로 비춰질 수 있어 현행 자본시장법 제57조 위반 소지가 다분합니다. 절대적 확실성을 암시하는 표현(\'100% 보장\')은 사용할 수 없으므로 기획 자체를 전면 재검토하시기 바랍니다.',
  },
]

// ── 완료 이력 데이터 ─────────────────────────────────────────────────────────
export const COMPLETION_HISTORY = [
  {
    id: 'h1', name: '봄 캠페인 v1.1', submitter: '박지영',
    aiRisk: 'HIGH', legalResult: '승인', legalManager: '김법무',
    resolvedAt: '2026.04.08', isFlywheel: true,
    flywheelNote: 'AI HIGH → 법무 승인 (불일치) — Tier 3 적재',
    legalComment: 'AI 진단 시 \'보장\' 키워드가 검출되어 HIGH 리스크로 분류되었으나, 제출된 기획의 전체 맥락상 보험 상품 가입에 따른 일반적 리워드 지급 명시로 확인되어 불완전판매 소지가 없다고 판단, 예외적 조건부 승인(즉시 집행 가능) 처리합니다.',
  },
  {
    id: 'h2', name: '추석 이벤트 v1.0', submitter: '이소연',
    aiRisk: 'LOW', legalResult: '승인', legalManager: '이컴플',
    resolvedAt: '2026.03.20', isFlywheel: false,
    flywheelNote: null,
    legalComment: '투자 관련 중립 표현 사용 완료. 과장·허위 표현 없음. 투자 필수 고지 문구 포함 확인. 사내 광고 심의 기준 v2.1에 오차 없이 부합하며 리스크 요인이 일절 발견되지 않았으므로 원안 그대로 즉시 집행을 최종 승인합니다.',
  },
  {
    id: 'h3', name: '겨울 이벤트 배너', submitter: '최준혁',
    aiRisk: 'MEDIUM', legalResult: '수정요청', legalManager: '이컴플',
    resolvedAt: '2026.03.15', isFlywheel: false,
    flywheelNote: null,
    legalComment: '\'연 12% 수익 기대\'라는 직접적 수익률 수치가 포함되어 있어 금융소비자보호법 제21조 규정에 따라 소비자에게 확정적 이익으로 오인될 우려가 농후합니다. 해당 수치를 삭제하거나 \'수익 추구\' 등의 완화된 표현으로 전면 수정하여 재상신하시기 바랍니다.',
  },
  {
    id: 'h4', name: 'ETF 소개 배너 v2', submitter: '박지영',
    aiRisk: 'LOW', legalResult: '승인', legalManager: '김법무',
    resolvedAt: '2026.03.10', isFlywheel: false,
    flywheelNote: null,
    legalComment: '펀드 상품에 대한 위험 등급 명시 및 원금 손실 가능성 안내 문구가 정상적으로 모두 포함된 것을 확인했습니다. 컴플라이언스 기준 가이드라인 100% 충족 상태이므로 즉시 집행 승인합니다.',
  },
  {
    id: 'h5', name: '신규 고객 유치 배너', submitter: '김수현',
    aiRisk: 'HIGH', legalResult: '반려', legalManager: '이컴플',
    resolvedAt: '2026.03.05', isFlywheel: false,
    flywheelNote: null,
    legalComment: '캠페인 내 \'무조건 수익 달성\', \'100% 보장\' 문구는 중대한 소비자 기만 행위에 해당하며 과거 동종 취소 선례(COMP-2025-0003)가 명백히 존재합니다. 자본시장법 상 확정적 보장성 표현을 전면 금지하고 있으므로 즉각 기안을 파기하고 재기획하시기 바랍니다.',
  },
  {
    id: 'h6', name: '대출 비교 배너', submitter: '정민재',
    aiRisk: 'MEDIUM', legalResult: '승인', legalManager: '김법무',
    resolvedAt: '2026.02.28', isFlywheel: true,
    flywheelNote: 'AI MEDIUM → 법무 승인 (불일치) — Tier 3 적재',
    legalComment: 'AI가 MEDIUM 등급으로 판단하였으나, 대출 금리 단순 비교 표현은 자본시장법 적용을 받는 투자 상품군 대비 규제 요건이 상이합니다. 이율 혼동을 유도하지 않는 수준에서 합리적 비교 정보 제공으로 간주되므로 이상 없이 최종 승인 처리합니다.',
  },
]

// ── 처리 현황 지표 ───────────────────────────────────────────────────────────
export const STATS_KPI = [
  { label: '이번 주 처리 건수', value: '12건', delta: '+3 vs 지난주', positive: true },
  { label: '평균 처리 시간', value: '1.8일', delta: '–0.4일 개선', positive: true },
  { label: 'AI-법무 판단 일치율', value: '78%', delta: '↑ 지난달 대비 +12%', positive: true },
  { label: '승인률', value: '67%', delta: '지난달 61%', positive: true },
]

export const STATS_MONTHLY = [
  { month: '1월', rate: 54 },
  { month: '2월', rate: 59 },
  { month: '3월', rate: 66 },
  { month: '4월', rate: 78 },
]

export const STATS_RISK_BREAKDOWN = [
  { level: 'HIGH',   total: 7, approved: 2, revision: 2, rejected: 3 },
  { level: 'MEDIUM', total: 5, approved: 3, revision: 2, rejected: 0 },
  { level: 'LOW',    total: 5, approved: 5, revision: 0, rejected: 0 },
]
