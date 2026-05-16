import { useState, useRef } from 'react'
import { ArrowUp, ChevronRight, Clock, CheckCircle2, XCircle, Plus, Sparkles } from 'lucide-react'

// ── 메뉴별 페이지 설정 ────────────────────────────────────────────────────────
const PAGE_CONFIG = {
  전자결재: {
    title: '전자결재',
    subtitle: '결재 요청, 진행 현황, 완료 내역을 관리하세요',
    actions: [
      { label: '연차 신청',   hint: '연차 신청하고 싶어요',     desc: '연차·반차 결재 신청' },
      { label: '출장 신청',   hint: '출장비 정산 도와줘',       desc: '출장비 정산·신청' },
      { label: '인프라 결재', hint: 'VDB 스토리지 증설 결재 요청해줘', desc: '인프라 증설·구매' },
      { label: '기타 결재',   hint: '전자결재 신청하고 싶어요', desc: '기타 업무 결재' },
    ],
    items: [
      { id: 1, title: '연차 신청 — 3일',            team: '개발팀 홍길동', date: '2025.04.03', status: 'pending' },
      { id: 2, title: 'VDB 스토리지 증설 결재',     team: 'DevOps팀 홍길동', date: '2025.04.02', status: 'inprogress' },
      { id: 3, title: '출장비 정산 — 3월',          team: '개발팀 홍길동', date: '2025.04.01', status: 'done' },
      { id: 4, title: '노트북 구매 결재',            team: '개발팀 홍길동', date: '2025.03.28', status: 'done' },
    ],
    placeholder: '결재 요청 내용을 입력하세요. (예: 연차 3일 신청)',
  },
  휴가신청: {
    title: '휴가 신청',
    subtitle: '연차·반차·특별 휴가를 신청하고 잔여 현황을 확인하세요',
    actions: [
      { label: '연차 신청',   hint: '연차 신청하고 싶어요',   desc: '연차 사용 신청' },
      { label: '반차 신청',   hint: '반차 신청하고 싶어요',   desc: '오전/오후 반차' },
      { label: '잔여 확인',   hint: '연차 잔여일수 확인해줘', desc: '현재 잔여 연차 조회' },
      { label: '휴가 규정',   hint: '휴가 규정 알고 싶어요',  desc: '휴가 정책 안내' },
    ],
    stats: [
      { label: '총 부여', value: '15일' },
      { label: '사용', value: '5일' },
      { label: '잔여', value: '10일', highlight: true },
    ],
    items: [
      { id: 1, title: '연차 — 2025.04.07 ~ 04.09',  team: '3일', date: '2025.04.03', status: 'pending' },
      { id: 2, title: '반차 — 2025.03.21 오후',      team: '0.5일', date: '2025.03.20', status: 'done' },
      { id: 3, title: '연차 — 2025.03.10 ~ 03.12',  team: '3일', date: '2025.03.09', status: 'done' },
    ],
    placeholder: '휴가 신청 내용을 입력하세요. (예: 다음 주 수요일 반차)',
  },
  출장비정산: {
    title: '출장비 정산',
    subtitle: '출장비 영수증을 제출하고 정산 현황을 확인하세요',
    actions: [
      { label: '정산 신청',   hint: '출장비 정산 도와줘',          desc: '영수증 기반 정산' },
      { label: '출장 신청',   hint: '출장 신청서 작성해줘',         desc: '출장 사전 신청' },
      { label: '정산 기준',   hint: '출장비 정산 기준 알려줘',      desc: '숙박·식대 기준' },
      { label: '한도 확인',   hint: '출장비 지원 한도 확인해줘',    desc: '지역별 한도 조회' },
    ],
    items: [
      { id: 1, title: '2025년 3월 출장비 정산',      team: '서울 → 판교', date: '2025.04.02', status: 'done' },
      { id: 2, title: '2025년 2월 출장비 정산',      team: '서울 → 부산', date: '2025.03.05', status: 'done' },
    ],
    placeholder: '출장비 관련 내용을 입력하세요.',
  },
  인사규정: {
    title: '인사 규정',
    subtitle: '복지·규정·정책을 AI에게 질문하고 빠르게 답변 받으세요',
    actions: [
      { label: '복리후생',    hint: '복리후생 혜택 알려줘',      desc: '사내 복지 혜택' },
      { label: '휴가 정책',   hint: '휴가 정책 알고 싶어요',     desc: '연차·특별휴가 규정' },
      { label: '평가 기준',   hint: '성과 평가 기준 알려줘',     desc: '인사 평가 체계' },
      { label: '채용 규정',   hint: '내부 추천 채용 규정 알려줘', desc: '내부 추천 프로세스' },
    ],
    faqItems: [
      '연차는 몇 일부터 자유롭게 사용할 수 있나요?',
      '재택근무 신청은 어떻게 하나요?',
      '경조사 휴가는 며칠인가요?',
      '출산·육아휴직 기간은 얼마나 되나요?',
    ],
    placeholder: '인사·복지·정책에 대해 질문하세요.',
  },
}

// ── 상태 뱃지 ─────────────────────────────────────────────────────────────────
const STATUS = {
  pending:    { label: '승인 대기', icon: Clock,        color: 'text-[#92400E]', bg: 'bg-[#FEF3C7]' },
  inprogress: { label: '진행중',   icon: Clock,         color: 'text-blue-600',  bg: 'bg-blue-50' },
  done:       { label: '완료',     icon: CheckCircle2,  color: 'text-[#6B7280]', bg: 'bg-[#F3F4F6]' },
  rejected:   { label: '반려',     icon: XCircle,       color: 'text-red-500',   bg: 'bg-red-50' },
}

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.done
  const Icon = s.icon
  return (
    <span className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${s.bg} ${s.color}`}>
      <Icon size={10} />
      {s.label}
    </span>
  )
}

// ── AI 입력 바 ────────────────────────────────────────────────────────────────
function AiInputBar({ placeholder, onSend, isProcessing }) {
  const [input, setInput] = useState('')
  const ref = useRef(null)

  const submit = () => {
    const t = input.trim()
    if (!t || isProcessing) return
    onSend(t)
    setInput('')
    if (ref.current) ref.current.style.height = 'auto'
  }

  return (
    <div className="flex-shrink-0 px-6 pb-5 pt-3 bg-white border-t border-[#F0F0F0]">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 bg-[#FFFDE7]/60 border border-[#FEE500]/30 rounded-2xl px-4 py-3 focus-within:border-[#FEE500]/60 focus-within:bg-[#FFFDE7]/80 transition-all">
          <Sparkles size={14} className="text-[#FEE500] flex-shrink-0" strokeWidth={2} />
          <input
            ref={ref}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit() }}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-[#374151] outline-none placeholder:text-[#C4C4C4]"
          />
          <button
            onClick={submit}
            disabled={!input.trim() || isProcessing}
            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
              input.trim() && !isProcessing ? 'bg-[#FEE500] text-[#191919] hover:bg-yellow-300' : 'text-[#C4C4C4] cursor-not-allowed'
            }`}
          >
            <ArrowUp size={13} strokeWidth={2.5} />
          </button>
        </div>
        <p className="text-[11px] text-[#C4C4C4] text-center mt-2">AI가 처리하고 채팅 화면으로 이동합니다</p>
      </div>
    </div>
  )
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function BusinessPage({ menu, onAiSend, onQuickAction, isProcessing }) {
  const cfg = PAGE_CONFIG[menu]
  if (!cfg) return null

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[#FAFAFA]">
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-2xl mx-auto px-8 pt-8 pb-6">

          {/* 페이지 헤더 */}
          <div className="mb-6">
            <h1 className="text-xl font-bold text-[#191919] mb-1">{cfg.title}</h1>
            <p className="text-sm text-[#9CA3AF]">{cfg.subtitle}</p>
          </div>

          {/* 연차 잔여 현황 (휴가신청만) */}
          {cfg.stats && (
            <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 mb-5 flex items-center gap-6">
              {cfg.stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className={`text-2xl font-bold ${s.highlight ? 'text-[#191919]' : 'text-[#9CA3AF]'}`}>
                    {s.value}
                  </p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">{s.label}</p>
                </div>
              ))}
              {cfg.stats.length > 0 && (
                <div className="flex-1 ml-2">
                  <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                    <div className="h-full bg-[#FEE500] rounded-full" style={{ width: '33%' }} />
                  </div>
                  <p className="text-[11px] text-[#C4C4C4] mt-1">2025년 연차 사용 현황</p>
                </div>
              )}
            </div>
          )}

          {/* 퀵 액션 */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">AI로 바로 처리</p>
            <div className="grid grid-cols-2 gap-2.5">
              {cfg.actions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => onQuickAction(action.hint)}
                  className="flex items-center justify-between text-left bg-white border border-[#E8E8E8] rounded-xl px-4 py-3.5 hover:border-[#FEE500]/60 hover:bg-[#FFFDE7]/30 hover:shadow-sm transition-all group"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#191919] group-hover:text-[#191919]">{action.label}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{action.desc}</p>
                  </div>
                  <ChevronRight size={14} className="text-[#C4C4C4] group-hover:text-[#FEE500] transition-colors flex-shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>

          {/* FAQ (인사규정만) */}
          {cfg.faqItems && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">자주 묻는 질문</p>
              <div className="space-y-2">
                {cfg.faqItems.map((faq) => (
                  <button
                    key={faq}
                    onClick={() => onQuickAction(faq)}
                    className="w-full flex items-center justify-between text-left bg-white border border-[#E8E8E8] rounded-xl px-4 py-3 hover:border-[#FEE500]/60 hover:bg-[#FFFDE7]/20 transition-all group"
                  >
                    <span className="text-sm text-[#374151] group-hover:text-[#191919]">{faq}</span>
                    <ChevronRight size={13} className="text-[#C4C4C4] group-hover:text-[#FEE500] flex-shrink-0 ml-3 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 최근 내역 */}
          {cfg.items && cfg.items.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">최근 내역</p>
                <button className="text-xs text-[#9CA3AF] hover:text-[#374151] transition-colors">전체 보기</button>
              </div>
              <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden">
                {cfg.items.map((item, i) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-4 px-5 py-3.5 hover:bg-[#F9F9F9] transition-colors cursor-pointer ${i < cfg.items.length - 1 ? 'border-b border-[#F3F4F6]' : ''}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#374151] truncate">{item.title}</p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">{item.team} · {item.date}</p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI 입력 바 */}
      <AiInputBar
        placeholder={cfg.placeholder}
        onSend={onAiSend}
        isProcessing={isProcessing}
      />
    </div>
  )
}
