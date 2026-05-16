import { useState, useRef } from 'react'
import { ArrowRight, Plus, AlertTriangle, CheckCircle2, RefreshCw, Filter, ChevronLeft } from 'lucide-react'
import { ChatInput } from './ChatView'

const TYPE_BADGE = {
  auto:     { label: '자동 감지', style: 'bg-blue-50 text-blue-600 border-blue-100' },
  request:  { label: '요청',     style: 'bg-[#F9F9F9] text-[#6B7280] border-[#E8E8E8]' },
  infra:    { label: '인프라',   style: 'bg-purple-50 text-purple-600 border-purple-100' },
  approval: { label: '결재',     style: 'bg-[#FFFDE7] text-[#92400E] border-[#FEE500]/30' },
  k8s:      { label: 'k8s',     style: 'bg-green-50 text-green-700 border-green-100' },
}

const STATUS_CONFIG = {
  alert:      { label: '처리 필요', dot: 'bg-amber-400', border: 'border-amber-200',   bg: 'bg-amber-50/20' },
  inprogress: { label: '진행중',   dot: 'bg-blue-400',  border: 'border-[#E8E8E8]',  bg: '' },
  pending:    { label: '승인 대기', dot: 'bg-[#FEE500]', border: 'border-[#FEE500]/40', bg: 'bg-[#FFFDE7]/30' },
  done:       { label: '완료',     dot: 'bg-[#D1D5DB]', border: 'border-[#E8E8E8]',  bg: '' },
}

export const INITIAL_PLATFORM_CARDS = [
  {
    id: 'alert-vdb', type: 'auto', category: 'infra',
    title: 'VDB 스토리지 임계치 예측',
    desc: '현재 71% 적재 (7.1TB / 10TB) — 일평균 80GB 증가, 11일 내 80% 임계치 도달 예측',
    status: 'alert', team: 'DevOps팀', assignedTo: '인프라위원회', createdAt: '방금',
    scenarioKey: 'vdb스토리지', triggerText: 'VDB 스토리지 증설 결재를 요청하고 싶어요', actionLabel: '증설 결재 요청',
  },
  {
    id: 'alert-k8s', type: 'auto', category: 'k8s',
    title: 'k8s EOL 감지 — D-180',
    desc: 'v1.28.6 지원 종료 2025.10.28 예정. nvidia-driver 호환성 확인 및 v1.30 업그레이드 검토 필요',
    status: 'inprogress', team: '인프라팀', assignedTo: '박인프라', createdAt: '방금',
    scenarioKey: 'k8s점검', triggerText: 'k8s EOL 현황 확인하고 담당자 검토 요청해줘', actionLabel: '검토 요청',
  },
  {
    id: 'pending-ns', type: 'request', category: 'infra',
    title: 'k8s 네임스페이스 추가 요청',
    desc: 'ml-pipeline-prod 신규 생성 — CPU 16core / Memory 32GB 쿼터 요청',
    status: 'pending', team: 'ML팀', assignedTo: '인프라팀', createdAt: '2025.04.03',
    scenarioKey: null, triggerText: null, actionLabel: null,
  },
  {
    id: 'done-fw', type: 'infra', category: 'infra',
    title: '방화벽 허용 요청 완료',
    desc: '외부 API 서버(203.x.x.x) → 운영 클러스터 443포트 허용 처리 완료',
    status: 'done', team: '개발팀', assignedTo: '보안팀', createdAt: '2025.04.02',
    scenarioKey: null, triggerText: null, actionLabel: null,
  },
  {
    id: 'done-exp', type: 'approval', category: 'approval',
    title: '출장비 정산 완료',
    desc: '2025년 3월 출장비 정산 (서울 → 판교 2박 3일)',
    status: 'done', team: '개발팀', assignedTo: '경영지원팀', createdAt: '2025.04.02',
    scenarioKey: null, triggerText: null, actionLabel: null,
  },
]

function WorkCard({ card, onAction, isNew }) {
  const st = STATUS_CONFIG[card.status] || STATUS_CONFIG.inprogress
  const ty = TYPE_BADGE[card.type] || TYPE_BADGE.request
  return (
    <div className={`bg-white border ${st.border} ${st.bg} rounded-xl p-4 hover:shadow-sm transition-all ${isNew ? 'step-enter' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${ty.style}`}>{ty.label}</span>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
            <span className="text-xs text-[#9CA3AF]">{st.label}</span>
          </div>
        </div>
        <span className="text-xs text-[#C4C4C4] flex-shrink-0">{card.createdAt}</span>
      </div>
      <h4 className="font-semibold text-[#191919] text-sm mb-1">{card.title}</h4>
      <p className="text-xs text-[#6B7280] leading-relaxed mb-3">{card.desc}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
          <span>{card.team}</span>
          {card.assignedTo && <><ArrowRight size={11} /><span>{card.assignedTo}</span></>}
        </div>
        {card.actionLabel && (
          <button
            onClick={() => onAction(card.scenarioKey, card.triggerText)}
            className="flex items-center gap-1 text-xs font-medium text-[#374151] border border-[#E8E8E8] bg-white px-3 py-1.5 rounded-lg hover:border-[#FEE500] hover:bg-[#FEE500]/10 transition-all"
          >
            {card.actionLabel}<ArrowRight size={11} />
          </button>
        )}
      </div>
    </div>
  )
}

function Section({ title, icon, count, faded, children }) {
  return (
    <div className={`mb-5 ${faded ? 'opacity-60' : ''}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">{title}</span>
        <span className="text-xs text-[#C4C4C4]">({count})</span>
      </div>
      <div className="space-y-2.5">{children}</div>
    </div>
  )
}

const MENU_LABELS = { 업무현황: '업무 현황', 인프라요청: '인프라 요청', 'k8s배포': 'k8s / 배포 관리' }
const MENU_DESC = {
  업무현황: '자동 감지 알림과 각 팀의 업무 요청을 한눈에 확인하세요',
  인프라요청: '서버, 스토리지, 네트워크 관련 요청 현황',
  'k8s배포': 'k8s 클러스터 관리 및 배포 요청 현황',
}
const CATEGORY_FILTER = { 업무현황: null, 인프라요청: 'infra', 'k8s배포': 'k8s' }

export default function PlatformView({ activeMenu, cards, onTrigger, onSend, isProcessing, onBack }) {
  const [input, setInput] = useState('')
  const textareaRef = useRef(null)

  const catFilter = CATEGORY_FILTER[activeMenu]
  const filtered = catFilter ? cards.filter((c) => c.category === catFilter) : cards
  const urgent     = filtered.filter((c) => c.status === 'alert')
  const active     = filtered.filter((c) => c.status === 'inprogress' || c.status === 'pending')
  const done       = filtered.filter((c) => c.status === 'done')

  const stats = {
    alert: filtered.filter((c) => c.status === 'alert').length,
    inprogress: filtered.filter((c) => c.status === 'inprogress').length,
    pending: filtered.filter((c) => c.status === 'pending').length,
    done: done.length,
  }

  const handleSend = () => {
    const t = input.trim(); if (!t || isProcessing) return
    onSend(t); setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }
  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[#F9F9F9]">
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-3xl mx-auto px-8 pt-6 pb-6">
          {/* 상단 네비 */}
          <div className="flex items-center gap-2 mb-5">
            <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-[#9CA3AF] hover:text-[#374151] transition-colors">
              <ChevronLeft size={15} />홈
            </button>
            <span className="text-[#E8E8E8]">/</span>
            <span className="text-sm font-medium text-[#374151]">{MENU_LABELS[activeMenu]}</span>
          </div>

          {/* 헤더 */}
          <div className="mb-5">
            <h1 className="text-xl font-bold text-[#191919] mb-1">{MENU_LABELS[activeMenu]}</h1>
            <p className="text-sm text-[#9CA3AF]">{MENU_DESC[activeMenu]}</p>
          </div>

          {/* 스탯 */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { label: '처리 필요', count: stats.alert,     color: 'text-amber-500' },
              { label: '진행중',   count: stats.inprogress, color: 'text-blue-500'  },
              { label: '승인 대기', count: stats.pending,    color: 'text-[#B45309]' },
              { label: '완료',     count: stats.done,       color: 'text-[#9CA3AF]' },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-[#E8E8E8] rounded-xl px-4 py-3.5">
                <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* AI 요청 배너 */}
          <div className="bg-white border border-[#FEE500]/30 rounded-xl px-5 py-3.5 mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#374151]">AI로 새 요청 만들기</p>
              <p className="text-xs text-[#9CA3AF] mt-0.5">아래 입력창에 요청하면 업무 카드가 자동 생성됩니다</p>
            </div>
            <Plus size={16} className="text-[#FEE500]" strokeWidth={2.5} />
          </div>

          {urgent.length > 0 && (
            <Section title="처리 필요" icon={<AlertTriangle size={13} className="text-amber-400" />} count={urgent.length}>
              {urgent.map((c) => <WorkCard key={c.id} card={c} onAction={onTrigger} isNew={c.isNew} />)}
            </Section>
          )}
          {active.length > 0 && (
            <Section title="진행 중" icon={<RefreshCw size={12} className="text-blue-400" />} count={active.length}>
              {active.map((c) => <WorkCard key={c.id} card={c} onAction={onTrigger} isNew={c.isNew} />)}
            </Section>
          )}
          {done.length > 0 && (
            <Section title="완료" icon={<CheckCircle2 size={12} className="text-[#9CA3AF]" />} count={done.length} faded>
              {done.map((c) => <WorkCard key={c.id} card={c} onAction={onTrigger} />)}
            </Section>
          )}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-[#C4C4C4]">
              <Filter size={24} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">해당 카테고리의 업무가 없습니다</p>
            </div>
          )}
        </div>
      </div>

      <ChatInput
        input={input} setInput={setInput}
        onSend={handleSend} onKeyDown={handleKey}
        isProcessing={isProcessing} textareaRef={textareaRef}
        placeholder="업무 요청을 입력하면 AI가 처리하고 업무 카드를 생성합니다..."
      />
    </div>
  )
}
