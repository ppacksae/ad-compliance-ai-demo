import { Sparkles, Upload, LayoutList, Clock, CheckSquare, BarChart2, HelpCircle, ShieldCheck } from 'lucide-react'

const MARKETER_ITEMS = [
  { key: 'chat',     icon: Sparkles,     label: 'AI 사전검토', sub: '문구·이미지 선검토', badge: 'Beta' },
  { key: 'submit',   icon: Upload,       label: '소재 제출',   sub: '최종 시안 OCR 검토' },
  { key: 'progress', icon: LayoutList,   label: '내 진행 현황', sub: null },
]
const LEGAL_ITEMS = [
  { key: 'pending',  icon: Clock,        label: '통합 심의 데스크',   sub: '대기 및 이력 통합 뷰' },
  { key: 'stats',    icon: BarChart2,    label: '처리 현황',   sub: 'SLA 및 지표 대시보드' },
]

function NavItem({ item, active, countBadge, subOverride, onClick }) {
  const { icon: Icon, label, sub, badge } = item
  return (
    <div className="px-3 mb-1">
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group ${
          active ? 'bg-[#111827] text-white shadow-md shadow-gray-900/10' : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]'
        }`}
      >
        <Icon
          size={16}
          className={`flex-shrink-0 transition-colors ${active ? 'text-[#FEE500]' : 'text-[#9CA3AF] group-hover:text-[#111827]'}`}
          strokeWidth={active ? 2.5 : 2}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`text-[13px] ${active ? 'font-bold text-white' : 'font-semibold text-[#4B5563] group-hover:text-[#111827]'}`}>
              {label}
            </span>
            {badge && (
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${active ? 'bg-white/20 text-white' : 'bg-[#E5E7EB] text-[#6B7280]'}`}>{badge}</span>
            )}
            {countBadge != null && countBadge > 0 && (
              <span className={`ml-auto text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                active ? 'bg-[#FEE500] text-[#92400E]' : 'bg-[#FEE500] text-[#92400E]'
              }`}>
                {countBadge}
              </span>
            )}
          </div>
          {(subOverride || sub) && (
            <p className={`text-[10px] mt-0.5 truncate ${active ? 'text-white/60' : 'text-[#A1A1AA]'}`}>
              {subOverride || sub}
            </p>
          )}
        </div>
      </button>
    </div>
  )
}

function SectionLabel({ label }) {
  return (
    <p className="px-6 pt-5 pb-2 text-[10px] font-black text-[#A1A1AA] uppercase tracking-wider">{label}</p>
  )
}

export default function Sidebar({ activeMenu, onMenuSelect, pendingCount = 4, progressSub }) {
  return (
    <aside className="w-[240px] flex-shrink-0 bg-[#FAFAFA] flex flex-col border-r border-[#E5E7EB] select-none">

      {/* 로고 영역 */}
      <div className="flex items-center gap-3 px-6 py-6 pb-5">
        <div className="w-8 h-8 bg-[#111827] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#FEE500]/20 to-transparent" />
          <ShieldCheck size={16} className="text-[#FEE500] relative z-10" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-[15px] font-black tracking-tight text-[#111827] leading-none mb-1">Compliance AI</h1>
          <p className="text-[10px] text-[#6B7280] font-semibold tracking-wide uppercase leading-none">KakaoPay Sec.</p>
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 overflow-y-auto py-2">
        {/* 마케터 영역 */}
        <SectionLabel label="Marketer" />
        {MARKETER_ITEMS.map(item => (
          <NavItem
            key={item.key}
            item={item}
            active={activeMenu === item.key}
            subOverride={item.key === 'progress' ? (progressSub || '진행중 2건 · 승인결과 1건') : null}
            onClick={() => onMenuSelect(item.key)}
          />
        ))}

        <div className="h-px bg-[#E5E7EB] mx-6 my-3 opacity-50" />

        {/* 법무/컴플 영역 */}
        <SectionLabel label="Legal & Compliance" />
        {LEGAL_ITEMS.map(item => (
          <NavItem
            key={item.key}
            item={item}
            active={activeMenu === item.key}
            countBadge={item.key === 'pending' ? pendingCount : undefined}
            onClick={() => onMenuSelect(item.key)}
          />
        ))}
      </nav>

      {/* 하단 영역 */}
      <div className="border-t border-[#E5E7EB] bg-white">
        <div className="px-3 py-2">
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-semibold text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors">
            <HelpCircle size={14} />이용 안내 가이드
          </button>
        </div>

        {/* SSO 사용자 */}
        <div className="mx-4 mb-4 bg-white border border-[#E5E7EB] rounded-xl p-3 flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 bg-[#111827] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-[13px] font-black text-[#FEE500]">춘</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-[13px] font-bold text-[#111827] leading-none">춘시리</p>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
            </div>
            <p className="text-[10px] text-[#6B7280] font-medium leading-tight truncate">마케팅플랫폼팀<br/>SSO 인증됨</p>
          </div>
        </div>

        <div className="px-5 pb-5 pt-0">
          <p className="text-[10px] text-[#A1A1AA] leading-relaxed font-medium">© 2026 KakaoPay Sec.<br />Compliance Validation v1.2.0</p>
        </div>
      </div>
    </aside>
  )
}

