import { useState } from 'react'
import {
  CalendarDays, Plane, ShoppingCart, Receipt, Server, GitBranch,
  ChevronRight, X, CheckCircle2, Clock, AlertCircle, User, Building2, ArrowRight,
} from 'lucide-react'

// ── 서비스 카드 정의 ──────────────────────────────────────────────────────────
const SERVICES = [
  {
    key: '휴가신청',
    icon: CalendarDays, label: '휴가 신청',
    desc: '연차·반차·특별 휴가',
    pending: 1, color: '#FEE500', bg: '#FFFDE7',
  },
  {
    key: '출장신청',
    icon: Plane, label: '출장 신청',
    desc: '국내·해외 출장 신청',
    pending: 0, color: '#93C5FD', bg: '#EFF6FF',
  },
  {
    key: '구매요청',
    icon: ShoppingCart, label: '구매 요청',
    desc: '장비·소프트웨어 구매',
    pending: 0, color: '#6EE7B7', bg: '#F0FDF4',
  },
  {
    key: '개인경비',
    icon: Receipt, label: '개인경비 신청',
    desc: '업무 관련 경비 청구',
    pending: 0, color: '#C4B5FD', bg: '#F5F3FF',
  },
  {
    key: '인프라요청',
    icon: Server, label: '인프라 요청',
    desc: '서버·스토리지·네트워크',
    pending: 1, color: '#FCA5A5', bg: '#FEF2F2',
  },
  {
    key: 'k8s배포',
    icon: GitBranch, label: 'k8s / 배포',
    desc: '클러스터·네임스페이스·배포',
    pending: 0, color: '#86EFAC', bg: '#F0FDF4',
  },
]

// ── 워크플로우 정의 ──────────────────────────────────────────────────────────
const WORKFLOWS = {
  휴가신청: {
    title: '휴가 신청',
    fields: [
      { key: 'type',  label: '휴가 종류',  type: 'select', options: ['연차', '반차(오전)', '반차(오후)', '공가', '특별휴가'] },
      { key: 'start', label: '시작일',     type: 'date',   placeholder: '2025.04.07' },
      { key: 'end',   label: '종료일',     type: 'date',   placeholder: '2025.04.09' },
      { key: 'days',  label: '신청일수',   type: 'text',   placeholder: '자동 계산' },
      { key: 'reason',label: '사유',       type: 'textarea', placeholder: '개인 사정' },
    ],
    approvers: ['김팀장', '이본부장'],
    balance: { total: 15, used: 5, remain: 10 },
  },
  출장신청: {
    title: '출장 신청',
    fields: [
      { key: 'dest',    label: '목적지',    type: 'text',   placeholder: '서울 → 판교' },
      { key: 'start',   label: '출발일',    type: 'date',   placeholder: '2025.04.10' },
      { key: 'end',     label: '귀환일',    type: 'date',   placeholder: '2025.04.12' },
      { key: 'purpose', label: '출장 목적', type: 'textarea', placeholder: '고객사 미팅' },
      { key: 'budget',  label: '예상 경비', type: 'text',   placeholder: '₩350,000' },
    ],
    approvers: ['김팀장', '이본부장'],
  },
  구매요청: {
    title: '구매 요청',
    fields: [
      { key: 'item',    label: '품목명',  type: 'text',     placeholder: 'MacBook Pro 16"' },
      { key: 'qty',     label: '수량',    type: 'text',     placeholder: '1' },
      { key: 'price',   label: '견적 금액', type: 'text',   placeholder: '₩3,500,000' },
      { key: 'reason',  label: '구매 사유', type: 'textarea', placeholder: '노후 장비 교체' },
    ],
    approvers: ['김팀장', '구매팀'],
  },
  개인경비: {
    title: '개인경비 신청',
    fields: [
      { key: 'date',    label: '지출일',    type: 'date',   placeholder: '2025.04.05' },
      { key: 'amount',  label: '금액',      type: 'text',   placeholder: '₩85,000' },
      { key: 'category',label: '비용 항목', type: 'select', options: ['식대', '교통비', '숙박비', '기타'] },
      { key: 'desc',    label: '내용',      type: 'textarea', placeholder: '팀 회식' },
    ],
    approvers: ['김팀장'],
  },
  인프라요청: {
    title: '인프라 리소스 요청',
    fields: [
      { key: 'type',    label: '요청 유형', type: 'select', options: ['스토리지 증설', '서버 증설', '네트워크 허용', '방화벽 설정', '기타'] },
      { key: 'spec',    label: '사양/규모', type: 'text',   placeholder: '+5TB, CPU 8core 등' },
      { key: 'env',     label: '환경',      type: 'select', options: ['Production', 'Staging', 'Dev'] },
      { key: 'reason',  label: '요청 사유', type: 'textarea', placeholder: '배치 데이터 적재 증가로 인한 스토리지 부족' },
    ],
    approvers: ['김팀장', '인프라위원회'],
  },
  k8s배포: {
    title: 'k8s 배포 요청',
    fields: [
      { key: 'service', label: '서비스명',   type: 'text',   placeholder: 'recommendation-service' },
      { key: 'image',   label: '컨테이너 이미지', type: 'text', placeholder: 'gcr.io/kpay/rec-svc:v2.3.1' },
      { key: 'ns',      label: '네임스페이스', type: 'text', placeholder: 'production' },
      { key: 'replicas',label: 'Replica 수',  type: 'text',   placeholder: '3' },
      { key: 'reason',  label: '배포 목적',   type: 'textarea', placeholder: '신규 추천 알고리즘 적용' },
    ],
    approvers: ['김팀장', '인프라팀'],
  },
}

// ── 최근 결재 내역 ─────────────────────────────────────────────────────────────
const RECENT_APPROVALS = [
  { id: 1, type: '휴가신청',  title: '연차 3일',                 status: 'pending',    date: '2025.04.03', approver: '김팀장' },
  { id: 2, type: '인프라요청', title: 'VDB 스토리지 증설 (+5TB)', status: 'inprogress', date: '2025.04.02', approver: '인프라위원회' },
  { id: 3, type: '개인경비',  title: '3월 식대',                 status: 'done',       date: '2025.04.01', approver: '김팀장' },
  { id: 4, type: '구매요청',  title: '노트북 구매',              status: 'done',       date: '2025.03.28', approver: '구매팀' },
]

const STATUS = {
  pending:    { label: '승인 대기', icon: Clock,        color: 'text-[#92400E]', bg: 'bg-[#FEF3C7]' },
  inprogress: { label: '진행중',   icon: AlertCircle,  color: 'text-blue-600',  bg: 'bg-blue-50' },
  done:       { label: '완료',     icon: CheckCircle2, color: 'text-[#6B7280]', bg: 'bg-[#F3F4F6]' },
}

function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.done
  const Icon = s.icon
  return (
    <span className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${s.bg} ${s.color}`}>
      <Icon size={10} strokeWidth={2} />{s.label}
    </span>
  )
}

// ── 워크플로우 패널 ────────────────────────────────────────────────────────────
function WorkflowPanel({ serviceKey, onClose, onSubmit }) {
  const wf = WORKFLOWS[serviceKey]
  const svc = SERVICES.find((s) => s.key === serviceKey)
  const [form, setForm] = useState({})
  const [submitted, setSubmitted] = useState(false)

  if (!wf) return null

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => { onSubmit(serviceKey, wf.title); }, 1200)
  }

  return (
    <div className="w-[400px] flex-shrink-0 bg-white border-l border-[#F0F0F0] flex flex-col overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0F0F0]">
        <div className="flex items-center gap-2.5">
          {svc && (
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: svc.bg }}>
              <svc.icon size={15} style={{ color: svc.color === '#FEE500' ? '#92400E' : svc.color }} strokeWidth={2} />
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-[#191919]">{wf.title}</p>
            <p className="text-[11px] text-[#9CA3AF]">결재라인: {wf.approvers.join(' → ')}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#374151] transition-colors">
          <X size={14} />
        </button>
      </div>

      {/* 연차 잔여 (휴가만) */}
      {wf.balance && (
        <div className="mx-6 mt-4 bg-[#FFFDE7] border border-[#FEE500]/30 rounded-xl px-4 py-3 flex items-center gap-4">
          {[['총 부여', wf.balance.total + '일'], ['사용', wf.balance.used + '일'], ['잔여', wf.balance.remain + '일']].map(([l, v]) => (
            <div key={l} className="text-center">
              <p className="text-base font-bold text-[#191919]">{v}</p>
              <p className="text-[10px] text-[#9CA3AF]">{l}</p>
            </div>
          ))}
          <div className="flex-1 ml-2">
            <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
              <div className="h-full bg-[#FEE500] rounded-full" style={{ width: `${(wf.balance.used / wf.balance.total) * 100}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* 폼 */}
      {!submitted ? (
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-4 space-y-4">
          {wf.fields.map((field) => (
            <div key={field.key}>
              <label className="text-xs font-semibold text-[#374151] block mb-1.5">{field.label}</label>
              {field.type === 'select' ? (
                <select
                  value={form[field.key] || ''}
                  onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                  className="w-full text-sm border border-[#E8E8E8] rounded-xl px-3 py-2.5 text-[#374151] outline-none focus:border-[#FEE500]/60 bg-white transition-colors appearance-none"
                >
                  <option value="">선택하세요</option>
                  {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  value={form[field.key] || ''}
                  onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full text-sm border border-[#E8E8E8] rounded-xl px-3 py-2.5 text-[#374151] outline-none focus:border-[#FEE500]/60 resize-none placeholder:text-[#C4C4C4] transition-colors"
                />
              ) : (
                <input
                  type="text" value={form[field.key] || ''}
                  onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full text-sm border border-[#E8E8E8] rounded-xl px-3 py-2.5 text-[#374151] outline-none focus:border-[#FEE500]/60 placeholder:text-[#C4C4C4] transition-colors"
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-12 h-12 bg-[#FEF3C7] rounded-2xl flex items-center justify-center mb-3">
            <CheckCircle2 size={22} className="text-[#92400E]" />
          </div>
          <p className="text-sm font-bold text-[#191919] mb-1">결재 요청 완료</p>
          <p className="text-xs text-[#9CA3AF]">{wf.approvers[0]}에게 알림이 발송되었습니다</p>
        </div>
      )}

      {/* 제출 버튼 */}
      {!submitted && (
        <div className="px-6 pb-6 pt-3 border-t border-[#F0F0F0]">
          {/* 결재라인 미리보기 */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF] mb-3">
            <span className="font-medium text-[#374151]">홍길동</span>
            {wf.approvers.map((a, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ArrowRight size={10} />
                <span>{a}</span>
              </span>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 bg-[#FEE500] text-[#191919] py-3 rounded-xl font-bold text-sm hover:bg-yellow-300 transition-colors"
          >
            <CheckCircle2 size={15} />결재 상신
          </button>
        </div>
      )}
    </div>
  )
}

// ── 메인 대시보드 ─────────────────────────────────────────────────────────────
export default function BusinessDashboard({ onAddCard }) {
  const [activeService, setActiveService] = useState(null)
  const [completedServices, setCompletedServices] = useState(new Set())

  const totalPending = RECENT_APPROVALS.filter((a) => a.status === 'pending').length

  const handleSubmit = (key, title) => {
    setCompletedServices((p) => new Set([...p, key]))
    setActiveService(null)
    onAddCard({ label: title, statusType: 'pending', category: 'approval', isNew: true })
  }

  return (
    <div className="flex flex-1 min-h-0 min-w-0">
      {/* 메인 영역 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin bg-[#FAFAFA]">
        <div className="max-w-2xl mx-auto px-8 pt-8 pb-10">

          {/* 사용자 프로필 카드 */}
          <div className="bg-white border border-[#E8E8E8] rounded-2xl p-5 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FEE500] rounded-2xl flex items-center justify-center">
                <User size={20} className="text-[#191919]" strokeWidth={2} />
              </div>
              <div>
                <p className="text-base font-bold text-[#191919]">홍길동</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Building2 size={11} className="text-[#9CA3AF]" />
                  <span className="text-xs text-[#9CA3AF]">개발팀 · DevOps그룹</span>
                  <span className="text-[#E8E8E8]">·</span>
                  <span className="text-xs text-[#9CA3AF]">KPS-2021-042</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 text-center">
              {[['결재 대기', totalPending, 'text-[#92400E]'], ['진행중', 1, 'text-blue-600'], ['이번달 완료', 5, 'text-[#6B7280]']].map(([l, v, c]) => (
                <div key={l}>
                  <p className={`text-xl font-bold ${c}`}>{v}</p>
                  <p className="text-[10px] text-[#9CA3AF]">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 서비스 카드 그리드 */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">업무 신청</p>
            <div className="grid grid-cols-3 gap-3">
              {SERVICES.map((svc) => {
                const isActive = activeService === svc.key
                const isDone = completedServices.has(svc.key)
                return (
                  <button
                    key={svc.key}
                    onClick={() => setActiveService(isActive ? null : svc.key)}
                    className={`relative text-left rounded-2xl p-4 border transition-all
                      ${isActive
                        ? 'border-[#FEE500] bg-white shadow-md ring-1 ring-[#FEE500]/30'
                        : 'border-[#E8E8E8] bg-white hover:border-[#FEE500]/40 hover:shadow-sm'
                      }`}
                  >
                    {svc.pending > 0 && !isDone && (
                      <span className="absolute top-3 right-3 w-4 h-4 bg-[#FEE500] rounded-full text-[9px] font-black text-[#191919] flex items-center justify-center">
                        {svc.pending}
                      </span>
                    )}
                    {isDone && (
                      <span className="absolute top-3 right-3">
                        <CheckCircle2 size={14} className="text-[#6B7280]" />
                      </span>
                    )}
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: svc.bg }}>
                      <svc.icon size={16} style={{ color: svc.color === '#FEE500' ? '#92400E' : svc.color }} strokeWidth={2} />
                    </div>
                    <p className="text-sm font-bold text-[#191919] mb-0.5">{svc.label}</p>
                    <p className="text-[11px] text-[#9CA3AF]">{svc.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 최근 결재 내역 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">최근 결재 내역</p>
              <button className="text-xs text-[#9CA3AF] hover:text-[#374151] transition-colors">전체 보기</button>
            </div>
            <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden">
              {RECENT_APPROVALS.map((item, i) => (
                <div key={item.id}
                  className={`flex items-center gap-4 px-5 py-3.5 hover:bg-[#F9F9F9] cursor-pointer transition-colors ${i < RECENT_APPROVALS.length - 1 ? 'border-b border-[#F3F4F6]' : ''}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[11px] text-[#9CA3AF] bg-[#F3F4F6] px-1.5 py-0.5 rounded">{item.type}</span>
                    </div>
                    <p className="text-sm font-medium text-[#374151] truncate">{item.title}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{item.date} · {item.approver}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 워크플로우 패널 */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${activeService ? 'w-[400px]' : 'w-0'}`}>
        {activeService && (
          <WorkflowPanel
            serviceKey={activeService}
            onClose={() => setActiveService(null)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  )
}
