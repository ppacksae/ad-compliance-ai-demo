import { useRef, useState } from 'react'
import { Search, User, ArrowUp, Sparkles } from 'lucide-react'

// ── 카테고리별 질문 세트 ───────────────────────────────────────────────────────
const CATEGORY_QUESTIONS = {
  전자결재: {
    row1: ['연차 신청하고 싶어요', '출장비 정산 도와줘', '반차 신청할게요', '인프라 증설 결재 요청', '휴가 잔여일수 확인해줘', '결재 상신 현황 보여줘'],
    row2: ['연차 3일 내일부터 써도 되나요?', '출장비 영수증 처리해줘', '해외 출장 신청서 작성해줘', '연차 촉진 대상인지 확인해줘', '반반차 신청 가능한가요?', '결재 취소 요청할게요'],
  },
  인프라점검: {
    row1: ['VDB 스토리지 현황 알려줘', 'k8s v1.28 EOL 언제인가요?', 'GPU 사용률 확인해줘', 'k8s 업그레이드 호환성 체크해줘', '네임스페이스 추가 요청할게요', 'Memory 쿼터 조정 요청'],
    row2: ['스토리지 증설 결재 요청', '방화벽 포트 허용 요청', 'nvidia-driver 업데이트 현황', 'CUDA 호환성 검토해줘', '운영 클러스터 리소스 현황', 'VDB 임계치 예측 보여줘'],
  },
  업무현황: {
    row1: ['내 승인 대기 건 보여줘', '진행중인 인프라 요청 현황', 'k8s 배포 현황 보여줘', 'VDB 증설 결재 진행 상황', '최근 완료된 결재 목록', '오늘 처리할 업무 알려줘'],
    row2: ['팀 전체 업무 현황 보여줘', '이번 주 승인 대기 목록', '인프라 요청 완료 현황', '결재 지연 건 확인해줘', '자동 감지 알림 현황', '미처리 업무 요약해줘'],
  },
}

const CATEGORIES = [
  {
    key: '전자결재',
    title: '전자결재',
    desc: '휴가·연차 신청, 출장비,\n인프라 증설 결재 처리',
  },
  {
    key: '인프라점검',
    title: '인프라 점검',
    desc: 'k8s EOL, 스토리지 현황,\n리소스 모니터링 조회',
  },
  {
    key: '업무현황',
    title: '업무 현황',
    desc: '진행 중인 요청 및\n승인 대기 현황 확인',
  },
]

function MarqueeRow({ items, reverse, onSelect, animKey }) {
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden w-full">
      <div
        key={animKey}   // key 변경 시 애니메이션 재시작
        className={`flex gap-3 w-max marquee-track ${reverse ? 'animate-marqueeRev' : 'animate-marquee'}`}
      >
        {doubled.map((item, i) => (
          <button
            key={i}
            onClick={() => onSelect(item)}
            className="whitespace-nowrap text-sm text-[#374151] bg-white border border-[#E8E8E8] rounded-xl px-4 py-2.5 hover:border-[#FEE500] hover:bg-[#FEE500]/5 transition-all flex-shrink-0 shadow-sm"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function HomePage({ onSend, onMenuSelect }) {
  const [input, setInput] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전자결재')
  const textareaRef = useRef(null)

  const submit = (text) => {
    const t = (text || input).trim()
    if (!t) return
    onSend(t)
    setInput('')
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
  }

  const questions = CATEGORY_QUESTIONS[selectedCategory]

  return (
    <div
      className="flex flex-col flex-1 min-h-0 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FFFDE7 0%, #FFFBF0 35%, #FFFFFF 75%)' }}
    >
      {/* 우상단 유저 영역 */}
      <div className="absolute top-0 right-0 flex items-center gap-2 px-6 py-4 z-10">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-[#9CA3AF] hover:text-[#374151] hover:bg-black/5 transition-colors">
          <Search size={16} />
        </button>
        <button className="flex items-center gap-2 text-sm text-[#374151] bg-white/80 border border-[#E8E8E8] rounded-xl px-3 py-1.5 hover:bg-white transition-colors shadow-sm">
          <User size={14} className="text-[#9CA3AF]" />
          <span className="font-medium">홍길동</span>
        </button>
      </div>

      {/* 스크롤 가능한 메인 영역 */}
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto scrollbar-thin">
        <div className="flex flex-col items-center pt-14 pb-10 px-6">

          {/* 아이콘 + 헤드라인 */}
          <div className="relative mb-4">
            <div className="w-13 h-13 w-14 h-14 bg-[#FEE500] rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-[#191919] font-black text-base tracking-tighter">AI</span>
            </div>
            <Sparkles size={15} className="absolute -top-2 -right-3 text-[#FEE500]" strokeWidth={2.5} />
          </div>

          <h1 className="text-[28px] font-bold text-[#191919] text-center leading-snug mb-2">
            AI로 업무를 더{' '}
            <span className="relative inline-block">
              <span className="relative z-10">빠르게</span>
              <span className="absolute bottom-0.5 left-0 right-0 h-[9px] bg-[#FEE500]/60 rounded-sm -z-0" />
            </span>
          </h1>
          <p className="text-sm text-[#9CA3AF] text-center mb-8">
            전자결재, 인프라 점검, 업무 현황을 채팅 한 줄로 처리하세요
          </p>

          {/* ── 카테고리 카드 ── */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-lg mb-6">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.key
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`text-left rounded-2xl p-4 border transition-all
                    ${active
                      ? 'border-[#FEE500] bg-white shadow-md ring-1 ring-[#FEE500]/30'
                      : 'border-[#E8E8E8] bg-white/70 hover:bg-white hover:border-[#FEE500]/40 hover:shadow-sm'
                    }`}
                >
                  <p className={`text-sm font-bold mb-1 ${active ? 'text-[#191919]' : 'text-[#374151]'}`}>
                    {cat.title}
                  </p>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed whitespace-pre-line">{cat.desc}</p>
                </button>
              )
            })}
          </div>

          {/* ── 마키 질문 칩 (카테고리 선택에 따라 교체) ── */}
          <div className="w-full max-w-3xl space-y-3 mb-8">
            <MarqueeRow
              items={questions.row1}
              reverse={false}
              onSelect={submit}
              animKey={`${selectedCategory}-r1`}
            />
            <MarqueeRow
              items={questions.row2}
              reverse={true}
              onSelect={submit}
              animKey={`${selectedCategory}-r2`}
            />
          </div>

          {/* ── 입력창 ── */}
          <div className="w-full max-w-xl">
            <div className="flex items-end gap-3 bg-white rounded-2xl px-4 py-3.5 border border-[#E8E8E8] shadow-md focus-within:border-[#FEE500]/60 focus-within:shadow-lg transition-all">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="어떤 업무가 필요하세요?"
                rows={1}
                className="flex-1 bg-transparent text-sm text-[#191919] resize-none outline-none placeholder:text-[#C4C4C4] leading-relaxed max-h-28"
                style={{ minHeight: '22px' }}
                onInput={(e) => {
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 112) + 'px'
                }}
              />
              <button
                onClick={() => submit()}
                disabled={!input.trim()}
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  input.trim()
                    ? 'bg-[#FEE500] text-[#191919] hover:bg-yellow-300'
                    : 'bg-[#F3F4F6] text-[#C4C4C4] cursor-not-allowed'
                }`}
              >
                <ArrowUp size={15} strokeWidth={2.5} />
              </button>
            </div>
            <p className="text-center text-xs text-[#D1D5DB] mt-2.5">
              AI가 생성한 답변은 실제와 다를 수 있으니 참고용으로만 활용하세요
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
