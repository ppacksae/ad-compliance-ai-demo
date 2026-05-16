import { useState, useEffect, useRef } from 'react'
import { Clock, CheckCircle2, AlertCircle, Search, Filter, X, User, MessageSquare, ArrowRight, AlertTriangle, Link2, XCircle, ArrowLeft } from 'lucide-react'
import BannerPreview from './BannerPreview'
import CitationCard from './CitationCard'
import RiskBadge from './RiskBadge'
import AgentFlow from './AgentFlow'
import { BANNERS, COMPLETION_HISTORY, BANNER_REVIEW_STEPS } from '../data/complianceData'

// 완료 이력 상세 콘텐츠 (패널에 표시)
const HISTORY_CONTENT = {
  h1: {
    ocrTexts: [
      { text: '수익률 200% 추구!', flagged: false },
      { text: '지금 바로 시작하세요', flagged: false },
      { text: '투자원금은 보장되지 않습니다', flagged: false },
    ],
    legalSummary: 'AI가 HIGH로 분류했으나, 제출자가 사전 협의를 통해 "보장" 표현을 "추구"로 수정한 최종안임을 확인. COMP-2025-0089 승인 선례와 동일 패턴으로 실질적 위반 소지 없다 판단하여 승인 처리. AI-법무 판단 불일치로 Knowledge Flywheel Tier 3에 자동 등재됨.',
    resolvedComment: 'AI HIGH 판정이었으나 제출자 사전 협의 내용 확인. "추구" 표현으로 수정된 최종안 — 기승인 선례(COMP-2025-0089)와 동일 패턴으로 승인.',
    colorScheme: 'orange',
  },
  h2: {
    ocrTexts: [
      { text: 'ETF 분산투자로 준비하세요', flagged: false },
      { text: '한가위 특별 이벤트', flagged: false },
      { text: '투자원금은 보장되지 않습니다', flagged: false },
    ],
    legalSummary: 'AI 검토 결과와 동일하게 위반 표현 없음 확인. 필수 고지 문구("투자원금은 보장되지 않습니다") 포함 확인. 이벤트 조건 명확히 기재되어 소비자 오해 소지 없음. 즉시 집행 승인.',
    resolvedComment: '위반 표현 없음. 필수 고지 문구 포함 확인. 즉시 집행 가능.',
    colorScheme: 'green',
  },
  h3: {
    ocrTexts: [
      { text: '연 12% 수익 기대!', flagged: true },
      { text: '겨울 한정 이벤트', flagged: false },
      { text: '투자원금은 보장되지 않습니다', flagged: false },
    ],
    legalSummary: '구체적 수익률 수치("연 12% 수익 기대")가 포함되어 금융소비자보호법 제21조에 따라 소비자 오해 유발 소지 있음. 수치를 제거하고 "수익 추구" 형태로 수정 후 재기안 요청. COMP-2025-0089 승인 선례 참고.',
    resolvedComment: '"연 12% 수익 기대" 수치 표현 삭제 후 "수익 추구"로 수정하여 재기안 바랍니다.',
    colorScheme: 'blue',
  },
  h4: {
    ocrTexts: [
      { text: 'ETF 분산투자 시작하기', flagged: false },
      { text: '글로벌 자산 한 번에', flagged: false },
      { text: '투자원금은 보장되지 않습니다', flagged: false },
    ],
    legalSummary: 'ETF 관련 중립 표현 사용, 과장·허위 표현 없음. 필수 고지 문구 포함 확인 완료. 사내 광고 심의 기준 v2.1 기준 위반 사항 없음. 즉시 집행 승인.',
    resolvedComment: '위반 사항 없음. 사내 기준 v2.1 충족 확인. 즉시 집행 가능.',
    colorScheme: 'green',
  },
  h5: {
    ocrTexts: [
      { text: '무조건 수익! 지금 가입하세요', flagged: true },
      { text: '신규 고객 100% 보장 혜택', flagged: true },
      { text: '투자원금은 보장되지 않습니다', flagged: false },
    ],
    legalSummary: '"무조건 수익", "100% 보장" 등 절대적 확실성 암시 표현 다수 검출. 자본시장법 제57조 위반 소지 명백. COMP-2025-0003 반려 선례와 동일 유형. 기획 전면 재검토 후 재기안 필요.',
    resolvedComment: '"무조건 수익", "100% 보장" 자본시장법 위반 소지 명백. 기획 전면 재검토 후 재기안 바랍니다.',
    colorScheme: 'orange',
  },
  h6: {
    ocrTexts: [
      { text: '대출 금리 최저 3.5% 비교', flagged: true },
      { text: '한도 최대 5천만원', flagged: false },
      { text: '실제 금리는 심사 결과에 따라 달라질 수 있습니다', flagged: false },
    ],
    legalSummary: 'AI가 MEDIUM으로 분류한 대출 금리 수치 표현을 검토한 결과, 조건부 금리를 명시하는 고지 문구가 포함되어 소비자 오해 소지 없음으로 판단. 내부 기준 충족 확인 후 승인. AI-법무 판단 불일치로 Flywheel Tier 3에 자동 등재됨.',
    resolvedComment: '금리 조건 고지 문구("심사 결과에 따라 달라질 수 있습니다") 확인 완료. 위반 소지 없음 — 승인.',
    colorScheme: 'blue',
  },
}

const INITIAL_ITEMS = [
  ...BANNERS,
  {
    id: 'bannerD',
    name: '신규 계좌 개설 이벤트',
    submitter: '마케팅팀 최준혁',
    submittedAt: '2026.04.07',
    channel: '앱 푸시',
    period: '2026.04.10 ~ 2026.04.20',
    target: '신규 고객',
    colorScheme: 'purple',
    ocrTexts: [
      { text: '수수료 0원! 지금 개설하세요', flagged: true },
      { text: '주식·ETF 수수료 무료', flagged: false },
      { text: '투자원금은 보장되지 않습니다', flagged: false },
    ],
    overallRisk: 'MEDIUM',
    riskSummary: { HIGH: 0, MEDIUM: 1 },
    summary: '전반적으로 안전한 소재이나, "수수료 0원" 표현에 이벤트 적용 조건이 부기되지 않아 소비자가 영구 혜택으로 오인할 소지가 있습니다. 조건 명시 후 재검토 시 빠른 승인이 가능합니다.',
    legalSummary: '신규 계좌 개설 이벤트 소재는 허위·과장 표현이 없어 전반적 리스크는 낮으나, "수수료 0원" 표현에 이벤트 적용 기간·한도 조건이 명시되지 않아 금융소비자에게 영구적 혜택으로 오인될 소지가 있습니다. 또한 "지금 개설하세요"는 사내 광고 심의 기준 v2.1 상 즉시성·긴박감 유발 표현으로 분류되어 부서장 전결 또는 조건부 승인이 요구됩니다. 조건 고지 문구 추가 및 표현 완화 후 빠른 트랙 처리를 권장합니다.',
    issues: [
      {
        id: 1, level: 'MEDIUM',
        flaggedText: "'수수료 0원! 지금 개설하세요'",
        flaggedWord: '수수료 0원 / 지금',
        rule: '이벤트 조건 미명시 및 긴박감 유발 표현',
        citations: [
          { type: 'policy', title: '사내 광고 심의 기준 v2.1', desc: '즉시성·긴박감을 조성하는 표현은 검토 필요', detail: '마케팅 집행 시 "지금 당장", "선착순 무조건 지급" 등의 표현은 소비자의 합리적 인식을 저해할 수 있어 부서장 전결로 승인하거나 조건부 승인을 득해야 함.', source: '마케팅 심의 가이드라인 (2024.09)' },
          { type: 'policy', title: '금융소비자보호법 제21조', desc: '이벤트·혜택 광고 시 적용 조건 명시 의무', detail: '이벤트성 혜택을 광고할 때 적용 기간, 대상 고객군, 한도 등 조건을 소비자가 인지할 수 있도록 명확히 표기하여야 하며, 조건 미명시 시 불완전판매로 간주될 수 있음.', source: '금융소비자보호 가이드라인 (2025.01)' },
        ],
        alternative: '수수료 0원* 지금 개설해보세요  (*이벤트 기간 한정)',
        alternativeNote: '이벤트 적용 조건(기간·한도)을 각주 또는 하단 고지로 추가 권장',
      },
    ],
    status: 'AI_FLAGGED',
  },
]

// --- Clean Formal Document View for AI Review ---
function AIReviewDocument({ ticket }) {
  return (
    <div className="space-y-10">
      {/* AI Report */}
      <div>
        <h3 className="text-[15px] font-black text-[#111827] mb-4 border-b flex items-center justify-between pb-3 border-[#111827]">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#111827] flex items-center justify-center text-[10px] text-[#FEE500] font-black">AI</span>
            사전 법무 검토 요약 리포트
          </div>
        </h3>
        <div className="pl-4 border-l-[3px] border-[#111827] py-1">
          <p className="text-[14px] text-[#374151] leading-loose break-keep">
            {ticket.legalSummary || ticket.summary}
          </p>
        </div>
      </div>

      {/* Citations */}
      {ticket.issues && ticket.issues.length > 0 && (
        <div>
          <h3 className="text-[15px] font-black text-[#111827] mb-5 border-b flex items-center gap-2 pb-3 border-[#111827]">
            상세 검출 내역 및 판단 근거 ({ticket.issues.length}건)
          </h3>
          <div className="space-y-8">
            {ticket.issues.map((issue, idx) => (
              <div key={idx} className="bg-white border text-left border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                 <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#F3F4F6]">
                   <span className="text-[14px] font-bold text-[#111827]">{idx + 1}. {issue.rule}</span>
                   {issue.level === 'HIGH' && <RiskBadge level={issue.level} size="sm" />}
                 </div>
                 
                 <div className="space-y-4">
                    <div>
                      <span className="text-[12px] font-bold text-[#9CA3AF] block mb-1">검출된 원문 표현:</span>
                      <span className="text-[13px] font-mono bg-[#F9FAFB] px-2 py-1 rounded border border-[#E5E7EB] text-[#111827]">"{issue.flaggedText}"</span>
                    </div>
                    
                    <div>
                      <span className="text-[12px] font-bold text-[#9CA3AF] block mb-1">법무팀 권장 수정안:</span>
                      <p className="text-[14px] font-bold text-[#064E3B]">"{issue.alternative}"</p>
                      <p className="text-[12px] text-[#6B7280] mt-1">{issue.alternativeNote}</p>
                    </div>
                    
                    {issue.citations && issue.citations.length > 0 && (
                      <div className="pt-3 mt-3 border-t border-[#F3F4F6]">
                        <span className="text-[12px] font-bold text-[#9CA3AF] block mb-3">적용된 내부 규정 및 유사 선례:</span>
                        <div className="space-y-2">
                          {issue.citations.map((cite, cIdx) => (
                            <CitationCard key={cIdx} citation={cite} />
                          ))}
                        </div>
                      </div>
                    )}
                 </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// --- Pending Full Screen View ---
function PendingTicketFullScreen({ ticket, onBack, onResolve }) {
  const [comment, setComment] = useState('')
  const [confirmAction, setConfirmAction] = useState(null)
  const [visibleSteps, setVisibleSteps] = useState(0)
  const [reportVisible, setReportVisible] = useState(false)
  const intervalRef = useRef(null)

  const STEPS = BANNER_REVIEW_STEPS || [
    { label: 'Master Agent — 실행 계획 수립 완료', sub: '이미지 첨부 감지 → OCR 포함 다중 실행 계획' },
    { label: '이미지 텍스트 추출 (OCR) + 금지어 체크', sub: 'Vision API → Compliance Ruleset AI 병렬 실행' },
    { label: '선례 검색 (RAG)', sub: 'OCR 추출 텍스트 기반 → 3-Tier VDB 검색' },
    { label: '리스크 등급 산출 중...', sub: 'Master Agent — 결과 종합 및 Citation 생성' },
  ]

  // 티켓이 바뀔 때마다 애니메이션을 처음부터 재실행
  useEffect(() => {
    setVisibleSteps(0)
    setReportVisible(false)

    let step = 0
    intervalRef.current = setInterval(() => {
      step += 1
      setVisibleSteps(step)
      if (step >= STEPS.length) {
        clearInterval(intervalRef.current)
        setTimeout(() => setReportVisible(true), 800)
      }
    }, 850)

    return () => clearInterval(intervalRef.current)
  }, [ticket?.id])

  const ACTION_CFG = {
    approved: { label: '승인 처리하시겠습니까?', desc: '마케터에게 승인 알림이 전달됩니다.', confirmLabel: '승인 확정', cls: 'bg-[#111827] text-white hover:bg-black' },
    revision: { label: '수정 요청하시겠습니까?', desc: '마케터에게 수정 요청 내용이 전달됩니다.', confirmLabel: '수정 요청 확정', cls: 'bg-amber-500 text-white hover:bg-amber-600' },
    rejected: { label: '반려 처리하시겠습니까?', desc: '반려 처리 후 되돌릴 수 없습니다.', confirmLabel: '반려 확정', cls: 'bg-red-600 text-white hover:bg-red-700' },
  }

  const handleConfirm = () => {
    onResolve(ticket.id, confirmAction, comment)
    setConfirmAction(null)
  }

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] font-pretendard">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB] flex-shrink-0 px-6 py-3">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] font-semibold text-[#6B7280] hover:text-[#111827] transition-colors mb-2">
          <ArrowLeft size={14} /> 목록으로
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-bold font-mono bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded">Ticket-{ticket.id}</span>
            <span className="bg-red-50 text-red-700 px-2 py-0.5 border border-red-200 rounded text-[10px] font-bold flex items-center gap-1"><AlertTriangle size={10}/> 조치 필요</span>
            <h1 className="text-[16px] font-black text-[#111827]">{ticket.name}</h1>
          </div>
          <RiskBadge level={ticket.overallRisk} />
        </div>
      </div>

      {/* Body: 좌우 분할 */}
      <div className="flex flex-1 min-h-0 divide-x divide-[#F3F4F6]">

        {/* 좌측: 소재 원본 고정 */}
        <div className="w-[300px] flex-shrink-0 bg-white overflow-y-auto scrollbar-thin">
          <div className="px-5 py-4 border-b border-[#F3F4F6]">
            <p className="text-xs font-semibold text-[#374151]">원본 소재</p>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">{ticket.name}</p>
          </div>
          <div className="p-4 space-y-3">
            {/* 배너 이미지 */}
            <div className="rounded-xl overflow-hidden border border-[#E5E7EB]">
              <BannerPreview colorScheme={ticket.colorScheme} />
            </div>

            {/* 소재 메타 */}
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3">
              <div className="space-y-1.5">
                {[['제출자', ticket.submitter], ['집행 채널', ticket.channel], ['기간', ticket.period], ['타겟', ticket.target], ['제출일', ticket.submittedAt]].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-baseline gap-2">
                    <span className="text-[10px] text-[#9CA3AF] flex-shrink-0">{k}</span>
                    <span className="text-[11px] text-[#374151] font-medium text-right">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* OCR 추출 텍스트 */}
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3">
              <p className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">OCR 추출 텍스트</p>
              <div className="space-y-1.5">
                {(ticket.ocrTexts || []).map((t, idx) => (
                  <div key={idx} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs border ${
                    t.flagged ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-[#E5E7EB] text-[#374151]'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${t.flagged ? 'bg-red-500' : 'bg-emerald-400'}`} />
                    {t.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 우측: AI 리포트 + 검토 결정 (스크롤) */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="px-5 py-4 border-b border-[#F3F4F6] bg-white">
            <p className="text-xs font-semibold text-[#374151]">AI 사전 검토 리포트 및 법무 결정</p>
          </div>
          <div className="p-6 space-y-6">

            {/* AgentFlow 애니메이션 */}
            <AgentFlow
              steps={STEPS}
              visibleCount={visibleSteps}
              extractedTexts={ticket.ocrTexts}
              payload={ticket.name}
            />

            {/* AI 리포트 — 애니메이션 완료 후 페이드인 */}
            <div className={`transition-all duration-700 ease-out ${reportVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
              <AIReviewDocument ticket={ticket} />

              {/* 검토 결정 */}
              <div className="bg-[#FFFDE7] border-2 border-[#FEE500] rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[14px] font-black text-[#111827]">검토 결정</h3>
                  <p className="text-[11px] text-[#6B7280]">결정 내용은 마케터에게 즉시 전달됩니다</p>
                </div>

                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="승인 또는 수정·반려 사유를 입력하세요..."
                  className="w-full h-20 p-3 bg-white border border-[#E5E7EB] rounded-lg text-[13px] outline-none focus:border-[#FEE500] resize-none mb-3"
                />

                {confirmAction ? (
                  <div className="bg-white border border-[#E5E7EB] rounded-lg p-4">
                    <p className="text-[13px] font-bold text-[#111827] mb-0.5">{ACTION_CFG[confirmAction].label}</p>
                    <p className="text-[11px] text-[#6B7280] mb-3">{ACTION_CFG[confirmAction].desc}</p>
                    {comment && (
                      <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 mb-3 text-[12px] text-[#374151]">
                        "{comment}"
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button onClick={handleConfirm}
                        className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-colors ${ACTION_CFG[confirmAction].cls}`}>
                        {ACTION_CFG[confirmAction].confirmLabel}
                      </button>
                      <button onClick={() => setConfirmAction(null)}
                        className="flex-1 py-2 text-[13px] font-bold bg-white border border-[#E5E7EB] text-[#374151] rounded-lg hover:border-[#9CA3AF] transition-colors">
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setConfirmAction('approved')}
                      className="flex-[1.5] flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-bold bg-[#111827] text-white rounded-lg hover:bg-black transition-colors">
                      <CheckCircle2 size={15}/> 승인
                    </button>
                    <button onClick={() => setConfirmAction('revision')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-bold bg-white text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors">
                      <MessageSquare size={15}/> 수정 요청
                    </button>
                    <button onClick={() => setConfirmAction('rejected')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-bold bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                      <XCircle size={15}/> 반려
                    </button>
                  </div>
                )}
              </div>
            </div> {/* reportVisible wrapper end */}

          </div>
        </div>

      </div>
    </div>
  )
}

// --- Ticket Detail Slide-out Panel ---
function TicketDetailPanel({ ticket, onClose, onResolve }) {
  const [panelComment, setPanelComment] = useState('')
  const [panelConfirmAction, setPanelConfirmAction] = useState(null)

  const PANEL_ACTION_CFG = {
    approved: { label: '승인 처리하시겠습니까?', desc: '마케터에게 승인 알림이 전달됩니다.', confirmLabel: '승인 확정', cls: 'bg-[#111827] text-white hover:bg-black' },
    revision: { label: '수정 요청하시겠습니까?', desc: '마케터에게 수정 요청 내용이 전달됩니다.', confirmLabel: '수정 요청 확정', cls: 'bg-amber-500 text-white hover:bg-amber-600' },
    rejected: { label: '반려 처리하시겠습니까?', desc: '반려 처리 후 되돌릴 수 없습니다.', confirmLabel: '반려 확정', cls: 'bg-red-600 text-white hover:bg-red-700' },
  }

  if (!ticket) return null

  const isResolved = ticket.dashStatus !== 'pending'

  return (
    <div className="absolute inset-0 z-50 flex justify-end overflow-hidden font-pretendard">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] transition-opacity" onClick={onClose}></div>
      
      {/* Slide Panel */}
      <div className="relative w-[540px] h-full bg-[#FAFAFA] shadow-2xl flex flex-col border-l border-[#E5E7EB] animate-in slide-in-from-right duration-300 ease-out">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex justify-between items-start bg-white">
          <div className="pr-4">
            <span className="text-xs font-bold font-mono text-[#9CA3AF] mb-1.5 flex items-center gap-2">
              Ticket-{ticket.id}
              {ticket.isFlywheel && <span className="bg-[#111827] text-white px-1.5 py-0.5 rounded text-[9px] tracking-wide">AUTO-SYNC (Tier 3)</span>}
            </span>
            <h2 className="text-[18px] font-bold text-[#111827] leading-snug">{ticket.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 -mr-2 hover:bg-[#F3F4F6] rounded-xl text-[#9CA3AF] hover:text-[#111827] transition-colors"><X size={18} /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-6">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-y-5 gap-x-4 bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-sm">
            <div>
              <span className="text-[#9CA3AF] block font-bold mb-1.5 text-[10px] uppercase tracking-wider">제출자 (Requester)</span>
              <span className="text-[#374151] text-sm font-semibold flex items-center gap-1.5"><User size={14} className="text-[#C4C4C4]"/> {ticket.submitter}</span>
            </div>
            <div>
              <span className="text-[#9CA3AF] block font-bold mb-1.5 text-[10px] uppercase tracking-wider">처리 상태</span>
              <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold leading-none ${
                ticket.dashStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                ticket.dashStatus === 'revision' ? 'bg-amber-100 text-amber-700' :
                ticket.dashStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-[#FEE500] text-[#92400E]'
              }`}>
                {ticket.dashStatus === 'approved' ? '승인 완료' : ticket.dashStatus === 'revision' ? '수정 요청됨' : ticket.dashStatus === 'rejected' ? '반려됨' : '법무 진단 대기 중'}
              </span>
            </div>
            <div>
              <span className="text-[#9CA3AF] block font-bold mb-1.5 text-[10px] uppercase tracking-wider">제출 일시</span>
              <span className="text-[#374151] font-mono text-[12px] font-medium">{ticket.submittedAt}</span>
            </div>
            <div>
              <span className="text-[#9CA3AF] block font-bold mb-1.5 text-[10px] uppercase tracking-wider">Agent AI 진단등급</span>
              <div className="mt-0.5"><RiskBadge level={ticket.overallRisk} /></div>
            </div>
          </div>

          <div className="w-full bg-[#E5E7EB] h-px my-6" />

          <AIReviewDocument ticket={ticket} />

          {/* Legal Manager Action / Comment Area */}
          <div className="pt-6 border-t border-[#E5E7EB] mt-8">
            <h3 className="text-[13px] font-bold text-[#111827] mb-4 flex items-center gap-2"><MessageSquare size={14} className="text-[#9CA3AF]"/> 담당자 검토 의견</h3>

            {isResolved ? (
              <div className="space-y-3">
                <div className="bg-white rounded-xl p-4 border border-[#E5E7EB] shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#6B7280]"><User size={12}/></div>
                    <span className="text-xs font-bold text-[#374151]">{ticket.resolvedBy}</span>
                    <span className="text-[10px] text-[#9CA3AF] ml-auto">{ticket.resolvedAt}</span>
                  </div>
                  <div className={`p-3 rounded-lg border ${ticket.dashStatus === 'approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : ticket.dashStatus === 'revision' ? 'bg-amber-50 border-amber-100 text-amber-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                    <p className="text-[13px] leading-relaxed font-medium">
                      {ticket.comment || (ticket.dashStatus === 'approved' ? '이상이 없어 승인합니다.' : '해당 내용을 확인 후 수정 또는 반려 처리했습니다.')}
                    </p>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-1.5 py-2 text-[12px] font-semibold text-[#6B7280] border border-[#E5E7EB] rounded-lg bg-white hover:bg-[#F9FAFB] hover:text-[#111827] hover:border-[#9CA3AF] transition-colors">
                  <Link2 size={12} /> 원문 보기
                </button>
              </div>
            ) : (
              <div className="bg-[#FFFDE7] p-5 rounded-xl border border-[#FEE500]/50 shadow-sm">
                <p className="text-[13px] font-bold text-[#111827] mb-3">코멘트 입력 후 최종 결정을 내려주세요. 결정 내용은 마케터에게 즉시 전달됩니다.</p>
                <textarea
                  value={panelComment}
                  onChange={e => setPanelComment(e.target.value)}
                  placeholder="승인 또는 수정·반려 사유를 입력하세요..."
                  className="w-full h-24 p-3 bg-white border border-[#E5E7EB] rounded-lg text-[13px] outline-none focus:border-[#FEE500] focus:ring-2 focus:ring-[#FEE500]/20 resize-none"
                />
                {panelConfirmAction ? (
                  <div className="mt-3 bg-white border border-[#E5E7EB] rounded-lg p-4">
                    <p className="text-[13px] font-bold text-[#111827] mb-0.5">{PANEL_ACTION_CFG[panelConfirmAction].label}</p>
                    <p className="text-[11px] text-[#6B7280] mb-3">{PANEL_ACTION_CFG[panelConfirmAction].desc}</p>
                    {panelComment && (
                      <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 mb-3 text-[12px] text-[#374151]">
                        "{panelComment}"
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button onClick={() => { onResolve(ticket.id, panelConfirmAction, panelComment); setPanelConfirmAction(null) }}
                        className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-colors ${PANEL_ACTION_CFG[panelConfirmAction].cls}`}>
                        {PANEL_ACTION_CFG[panelConfirmAction].confirmLabel}
                      </button>
                      <button onClick={() => setPanelConfirmAction(null)}
                        className="flex-1 py-2 text-[13px] font-bold bg-white border border-[#E5E7EB] text-[#374151] rounded-lg hover:border-[#9CA3AF] transition-colors">
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => setPanelConfirmAction('approved')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-bold bg-[#111827] text-white rounded-lg hover:bg-black transition-colors">
                      <CheckCircle2 size={15}/> 승인
                    </button>
                    <button onClick={() => setPanelConfirmAction('revision')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-bold bg-white text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors">
                      <MessageSquare size={15}/> 수정 요청
                    </button>
                    <button onClick={() => setPanelConfirmAction('rejected')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-bold bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                      <XCircle size={15}/> 반려
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  )
}


export default function ComplianceDashboard({ extraItems = [] }) {
  const allInitial = [
    ...INITIAL_ITEMS.map(b => ({ ...b, dashStatus: 'pending', comment: '' })),
    ...extraItems.map(b => ({ ...b, dashStatus: 'pending', comment: '' })),
    ...COMPLETION_HISTORY.map(h => {
      const c = HISTORY_CONTENT[h.id] || {}
      return {
        id: h.id,
        name: h.name,
        submitter: h.submitter,
        submittedAt: h.resolvedAt,
        channel: '이력 조회',
        period: h.resolvedAt,
        target: '전체',
        colorScheme: c.colorScheme || 'blue',
        ocrTexts: c.ocrTexts || [{ text: '이력 조회 항목입니다.', flagged: false }],
        overallRisk: h.aiRisk,
        legalSummary: c.legalSummary || '',
        riskSummary: { HIGH: 0, MEDIUM: 0 },
        issues: [],
        status: h.aiRisk === 'HIGH' || h.aiRisk === 'MEDIUM' ? 'AI_FLAGGED' : 'AI_APPROVED',
        dashStatus: h.legalResult === '승인' ? 'approved' : h.legalResult === '수정요청' ? 'revision' : 'rejected',
        comment: c.resolvedComment || h.flywheelNote || '처리 완료된 기존 이력입니다.',
        resolvedAt: h.resolvedAt,
        resolvedBy: h.legalManager,
        isFlywheel: h.isFlywheel,
      }
    })
  ]

  // deduplicate
  const deduped = allInitial.filter((item, idx, arr) => arr.findIndex(x => x.id === item.id) === idx)
  
  const [items, setItems] = useState(deduped)
  const [activeTab, setActiveTab] = useState('all') // all | pending | completed
  const [selectedTicketId, setSelectedTicketId] = useState(null)

  const selectedTicket = items.find(i => i.id === selectedTicketId)
  
  const pendingCount = items.filter(i => i.dashStatus === 'pending').length
  const revisionCount = items.filter(i => i.dashStatus === 'revision').length
  const rejectedCount = items.filter(i => i.dashStatus === 'rejected').length
  const approvedCount = items.filter(i => i.dashStatus === 'approved').length

  const displayItems = items.filter(i => {
    if (activeTab === 'all') return true
    if (activeTab === 'pending') return i.dashStatus === 'pending'
    if (activeTab === 'completed') return i.dashStatus !== 'pending'
    return true
  }).sort((a, b) => {
    // Sort logic: pending first, then by id string for simplicity
    if (a.dashStatus === 'pending' && b.dashStatus !== 'pending') return -1
    if (a.dashStatus !== 'pending' && b.dashStatus === 'pending') return 1
    return 0
  })

  const resolveTicket = (id, resultStatus, comment) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, dashStatus: resultStatus, comment, resolvedAt: '방금', resolvedBy: '현재 법무담당자' }
        : item
    ))
    setSelectedTicketId(null) // Slide panel closes or stays? Let it close to feel like done.
  }

  // If specifically viewing a pending ticket, go Full Screen!
  if (selectedTicket && selectedTicket.dashStatus === 'pending') {
    return (
      <PendingTicketFullScreen 
        ticket={selectedTicket} 
        onBack={() => setSelectedTicketId(null)} 
        onResolve={resolveTicket}
      />
    )
  }

  // Normal Dashboard Mode
  return (
    <div className="flex flex-col flex-1 h-full bg-[#FAFAFA] font-pretendard relative">
      {/* Sliding Details Overlay */}
      <TicketDetailPanel 
        ticket={selectedTicket} 
        onClose={() => setSelectedTicketId(null)} 
        onResolve={resolveTicket}
      />
      
      {/* Top Header */}
      <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">통합 워크플로우 보드 (심의 데스크)</h1>
          <p className="text-sm text-[#6B7280] mt-1">대기 중인 검토 요청과 히스토리를 한눈에 파악하고 결재를 진행합니다.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-[#E5E7EB] text-[#374151] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#F9FAFB] shadow-sm transition-colors">
            <Filter size={16} /> 조건 필터
          </button>
          <div className="bg-white border border-[#E5E7EB] rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm focus-within:border-[#FEE500] focus-within:ring-2 focus-within:ring-[#FEE500]/20 transition-all">
            <Search size={16} className="text-[#9CA3AF]" />
            <input type="text" placeholder="티켓 ID 또는 배너명 검색..." className="bg-transparent border-none outline-none text-sm text-[#111827] w-48 placeholder:text-[#9CA3AF]" />
          </div>
        </div>
      </div>

      {/* Main Board */}
      <div className="flex-1 overflow-auto p-8 scrollbar-thin">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: '법무 검토 대기', count: pendingCount, icon: Clock, color: 'text-[#92400E]', alert: true },
              { label: '승인 완료', count: approvedCount, icon: CheckCircle2, color: 'text-emerald-600' },
              { label: '수정 요청', count: revisionCount, icon: MessageSquare, color: 'text-amber-600' },
              { label: '기각 / 반려', count: rejectedCount, icon: XCircle, color: 'text-red-500' },
            ].map((stat, i) => (
              <div key={i} className={`rounded-2xl p-5 shadow-sm transition-transform hover:scale-[1.01] ${stat.bg || 'bg-white'} border ${stat.alert ? 'border-red-300 shadow-red-100' : stat.border || 'border-[#E5E7EB]'}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[13px] font-bold ${stat.alert ? 'text-[#92400E]' : stat.text || 'text-[#6B7280]'}`}>{stat.label}</span>
                  <div className={`relative p-1.5 rounded-lg ${stat.alert ? 'bg-[#FEE500]/20' : stat.iconBg || 'bg-[#F3F4F6]'}`}>
                    {stat.alert && (
                      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                      </span>
                    )}
                    <stat.icon size={18} className={stat.color} />
                  </div>
                </div>
                <div className={`text-3xl font-black ${stat.alert ? 'text-[#92400E]' : stat.text || 'text-[#111827]'}`}>{stat.count}</div>
              </div>
            ))}
          </div>

          {/* Ticket Table */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-6 px-6 py-4 border-b border-[#F3F4F6] bg-[#F9FAFB]">
              {['all', 'pending', 'completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[13px] font-bold pb-4 -mb-[17px] border-b-[3px] transition-all px-1 outline-none ${
                    activeTab === tab ? 'text-[#111827] border-[#111827]' : 'text-[#9CA3AF] border-transparent hover:text-[#374151]'
                  }`}
                >
                  {tab === 'all' ? '모든 워크플로우' : tab === 'pending' ? `검토 대기 (${pendingCount})` : `처리 완료 (${approvedCount + rejectedCount})`}
                </button>
              ))}
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-[#F3F4F6] text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">
                  <th className="px-6 py-4">Ticket</th>
                  <th className="px-6 py-4">AI Risk</th>
                  <th className="px-6 py-4">소재명 / 처리 내용</th>
                  <th className="px-6 py-4">제출자 / 담당자</th>
                  <th className="px-6 py-4">일시</th>
                  <th className="px-6 py-4 text-right">Action Status</th>
                </tr>
              </thead>
              <tbody>
                {displayItems.flatMap((ticket, index) => {
                  const prevTicket = displayItems[index - 1]
                  const isFirstCompleted = activeTab === 'all'
                    && ticket.dashStatus !== 'pending'
                    && (!prevTicket || prevTicket.dashStatus === 'pending')
                  const isFirstPending = activeTab === 'all' && index === 0 && ticket.dashStatus === 'pending'

                  const rows = []

                  if (isFirstPending) {
                    rows.push(
                      <tr key="sep-pending">
                        <td colSpan={6} className="px-6 py-2 bg-[#FEF08A] border-y border-[#FDE047]">
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2 mr-1">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            <span className="text-[11px] font-bold text-[#854D0E] uppercase tracking-wider">법무 검토 대기 ({pendingCount}건)</span>
                          </div>
                        </td>
                      </tr>
                    )
                  }

                  if (isFirstCompleted) {
                    rows.push(
                      <tr key="sep-completed">
                        <td colSpan={6} className="px-6 py-2 bg-[#F9FAFB] border-y border-[#E5E7EB]">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={11} className="text-[#6B7280]" />
                            <span className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">처리 완료 ({approvedCount + revisionCount + rejectedCount}건)</span>
                          </div>
                        </td>
                      </tr>
                    )
                  }

                  rows.push(
                    <tr key={ticket.id} onClick={() => setSelectedTicketId(ticket.id)}
                      className={`group transition-all cursor-pointer border-b border-[#F3F4F6] border-l-4 ${
                        ticket.dashStatus === 'pending' ? 'border-l-[#111827] hover:bg-[#F9FAFB]' : 'border-l-transparent hover:bg-[#F9FAFB]'
                      }`}>
                      <td className="px-6 py-3.5">
                        <span className="text-[13px] font-bold font-mono text-[#374151]">T-{ticket.id.slice(-4).padStart(4, '0')}</span>
                        {ticket.isFlywheel && <span className="block text-[9px] font-bold text-amber-600 mt-0.5">⚡ Flywheel</span>}
                      </td>
                      <td className="px-6 py-3.5">
                        <RiskBadge level={ticket.overallRisk} size="sm" />
                      </td>
                      <td className="px-6 py-3.5 max-w-xs">
                        <p className="text-[13px] font-bold text-[#111827] truncate">{ticket.name}</p>
                        {ticket.dashStatus !== 'pending' && ticket.comment && (
                          <p className="text-[11px] text-[#6B7280] mt-0.5 truncate">{ticket.comment}</p>
                        )}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-[12px] text-[#6B7280] flex items-center gap-1"><User size={11}/>{ticket.submitter.split(' ').slice(-1)[0]}</span>
                        {ticket.resolvedBy && ticket.dashStatus !== 'pending' && (
                          <span className="text-[11px] text-[#9CA3AF] mt-0.5 block">처리: {ticket.resolvedBy}</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="text-[12px] font-mono text-[#111827]">{ticket.submittedAt}</div>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        {ticket.dashStatus === 'pending' ? (
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-[#E8E8E8] group-hover:bg-[#111827] group-hover:border-[#111827] transition-colors shadow-sm ml-auto">
                            <ArrowRight size={14} className="text-[#9CA3AF] group-hover:text-white transition-colors" />
                          </div>
                        ) : ticket.dashStatus === 'approved' ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-[11px] font-bold border border-emerald-200">
                            <CheckCircle2 size={10}/> 승인 완료
                          </span>
                        ) : ticket.dashStatus === 'revision' ? (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-md text-[11px] font-bold border border-amber-200">
                            <MessageSquare size={10}/> 수정 요청
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-[11px] font-bold border border-gray-200">
                            <XCircle size={10}/> 검토 반려
                          </span>
                        )}
                      </td>
                    </tr>
                  )

                  return rows
                })}
              </tbody>
            </table>
            
            {displayItems.length === 0 && (
              <div className="text-center py-16">
                <AlertCircle size={24} className="mx-auto text-[#D1D5DB] mb-3" />
                <p className="text-sm font-bold text-[#9CA3AF]">해당 상태의 티켓이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
