import { TrendingUp, ArrowUp, Clock, CheckCircle2, Calendar, Filter, ChevronDown } from 'lucide-react'
import { STATS_KPI, STATS_MONTHLY, STATS_RISK_BREAKDOWN } from '../data/complianceData'

// ── 라인 차트 (월별 AI-법무 판단 일치율) ─────────────────────────────────────
function TrendChart() {
  const W = 480, H = 160
  const PL = 44, PR = 20, PT = 20, PB = 36
  const PW = W - PL - PR
  const PH = H - PT - PB

  const data = STATS_MONTHLY
  const yMin = 40, yMax = 100
  const toX = (i) => PL + (i / (data.length - 1)) * PW
  const toY = (v) => PT + PH - ((v - yMin) / (yMax - yMin)) * PH

  const points = data.map((d, i) => [toX(i), toY(d.rate)])
  const polyline = points.map(p => p.join(',')).join(' ')

  // Area fill path
  const areaPath = [
    `M ${points[0][0]} ${PT + PH}`,
    ...points.map(p => `L ${p[0]} ${p[1]}`),
    `L ${points[points.length - 1][0]} ${PT + PH}`,
    'Z',
  ].join(' ')

  const gridYs = [50, 60, 70, 80, 90, 100]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }}>
      {/* Grid lines */}
      {gridYs.map(v => (
        <g key={v}>
          <line x1={PL} y1={toY(v)} x2={W - PR} y2={toY(v)} stroke="#F3F4F6" strokeWidth={1} />
          <text x={PL - 6} y={toY(v) + 4} fontSize={9} fill="#C4C4C4" textAnchor="end">{v}%</text>
        </g>
      ))}
      {/* Area */}
      <path d={areaPath} fill="#FEE500" opacity={0.08} />
      {/* Line */}
      <polyline points={polyline} fill="none" stroke="#111827" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots + labels */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r={4} fill="#111827" />
          <circle cx={p[0]} cy={p[1]} r={2} fill="white" />
          <text x={p[0]} y={p[1] - 9} fontSize={10} fill="#374151" textAnchor="middle" fontWeight="600">
            {data[i].rate}%
          </text>
          <text x={p[0]} y={H - 4} fontSize={10} fill="#9CA3AF" textAnchor="middle">{data[i].month}</text>
        </g>
      ))}
    </svg>
  )
}

// ── 리스크 등급별 바 차트 ─────────────────────────────────────────────────────
function RiskBarChart() {
  const data = STATS_RISK_BREAKDOWN
  const maxTotal = Math.max(...data.map(d => d.total))

  const RISK_COLORS = {
    HIGH:   { bar: '#EF4444', light: '#FEF2F2', label: 'text-red-600' },
    MEDIUM: { bar: '#F59E0B', light: '#FFFBEB', label: 'text-amber-600' },
    LOW:    { bar: '#10B981', light: '#ECFDF5', label: 'text-emerald-600' },
  }
  const RESULT_COLORS = {
    approved: { fill: '#111827', label: '승인' },
    revision: { fill: '#9CA3AF', label: '수정요청' },
    rejected: { fill: '#E5E7EB', label: '반려' },
  }

  return (
    <div className="space-y-3">
      {data.map(row => {
        const cfg = RISK_COLORS[row.level]
        const barW = (row.total / maxTotal) * 100
        const approvedPct = (row.approved / row.total) * 100
        const revisionPct = (row.revision / row.total) * 100
        const rejectedPct = (row.rejected / row.total) * 100

        return (
          <div key={row.level}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-bold ${cfg.label}`}>{row.level}</span>
                <span className="text-[11px] text-[#9CA3AF]">{row.total}건</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-[#9CA3AF]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#111827] inline-block" />승인 {row.approved}</span>
                {row.revision > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#9CA3AF] inline-block" />수정 {row.revision}</span>}
                {row.rejected > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#E5E7EB] border border-[#D1D5DB] inline-block" />반려 {row.rejected}</span>}
              </div>
            </div>
            <div className="h-6 rounded-lg overflow-hidden bg-[#F3F4F6]" style={{ width: `${barW}%` }}>
              <div className="flex h-full">
                {approvedPct > 0 && <div style={{ width: `${approvedPct}%`, background: '#111827' }} className="transition-all" />}
                {revisionPct > 0 && <div style={{ width: `${revisionPct}%`, background: '#9CA3AF' }} className="transition-all" />}
                {rejectedPct > 0 && <div style={{ width: `${rejectedPct}%`, background: '#D1D5DB' }} className="transition-all" />}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function ProcessingStatsView() {
  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[#F9FAFB]">
      {/* 헤더 및 글로벌 컨트롤 패널 */}
      <div className="px-8 py-5 bg-white border-b border-[#E5E7EB] flex-shrink-0 flex items-center justify-between z-10 relative shadow-sm">
        <div>
          <h1 className="text-[22px] font-black tracking-tight text-[#111827]">처리 현황</h1>
          <p className="text-[13px] font-bold text-[#6B7280] mt-1">SLA 및 컴플라이언스 인텔리전스</p>
        </div>
        
        {/* 글로벌 필터 바 */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-sm transition-colors hover:bg-white hover:border-[#D1D5DB]">
            <Calendar size={14} className="text-[#6B7280]" />
            <span className="font-bold text-[#374151]">2026.04.01 - 2026.04.30</span>
            <ChevronDown size={14} className="text-[#9CA3AF] ml-1" />
          </button>
          <div className="w-px h-6 bg-[#E5E7EB]" />
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[13px] font-bold text-[#374151] hover:bg-[#F9FAFB] transition-colors shadow-sm">
            <Filter size={14} className="text-[#111827]" />
            전사 기준
            <ChevronDown size={14} className="text-[#9CA3AF] ml-1" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-8">
        <div className="w-full space-y-6">

          {/* 원래 버전의 KPI 카드 */}
          <div className="grid grid-cols-4 gap-3">
            {STATS_KPI.map(kpi => (
              <div key={kpi.label} className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-4">
                <p className="text-[11px] text-[#9CA3AF] mb-2">{kpi.label}</p>
                <p className="text-2xl font-black text-[#111827]">{kpi.value}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  {kpi.positive && <ArrowUp size={10} className="text-emerald-500" />}
                  <p className="text-[11px] text-[#6B7280]">{kpi.delta}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 차트 2열 */}
          <div className="grid grid-cols-2 gap-4">
            {/* 라인 차트: AI 성능 최적화 엔진 */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[13px] font-bold text-[#111827]">AI 성능 및 자가학습 궤적 (Knowledge Flywheel)</p>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600">
                  <TrendingUp size={11} />
                  <span className="font-semibold">+24%p (4개월)</span>
                </div>
              </div>
              <p className="text-[11px] text-[#9CA3AF] mb-4">시간이 갈수록 AI가 법무 판단에 수렴합니다</p>
              <TrendChart />
              <div className="mt-3 pt-3 border-t border-[#F3F4F6] flex items-start gap-2">
                <div className="w-4 h-0.5 bg-[#111827] mt-2 flex-shrink-0" />
                <p className="text-[10px] text-[#9CA3AF] leading-relaxed">
                  Knowledge Flywheel 작동 — AI와 법무 판단 불일치 케이스가 Tier 3 선례로 자동 축적되어 AI가 점진적으로 법무 판단에 수렴
                </p>
              </div>
            </div>

            {/* 바 차트 */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
              <p className="text-xs font-semibold text-[#374151] mb-1">리스크 등급별 처리 현황</p>
              <p className="text-[11px] text-[#9CA3AF] mb-5">이번 달 누적 기준</p>
              <RiskBarChart />
              <div className="mt-5 pt-4 border-t border-[#F3F4F6] grid grid-cols-3 gap-2">
                {[
                  { label: '전체 처리', value: '17건' },
                  { label: '전체 승인률', value: '59%' },
                  { label: 'AI 정확도', value: '78%' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className="text-base font-black text-[#111827]">{s.value}</p>
                    <p className="text-[10px] text-[#9CA3AF]">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SLA 현황 (Dark Theme Highlight) & AI 품질 모니터링 판넬 구조 */}
          <div className="grid grid-cols-[1fr_1fr] gap-4">
            
            {/* 1. SLA 준수 현황 (Light Theme adaptation of user mock) */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[14px] font-bold text-[#111827] flex items-center gap-2">SLA 준수 현황</p>
                  <p className="text-[11px] text-[#9CA3AF] mt-1">티켓 유형별 처리 기한 방어율 (전사 기준)</p>
                </div>
                <div className="flex items-center gap-2 h-fit">
                  <span className="text-[10px] uppercase font-bold text-[#9CA3AF] bg-[#F3F4F6] px-2 py-0.5 rounded">당일 발송분</span>
                </div>
              </div>

              <div className="space-y-6 flex-1 flex flex-col justify-center">
                {/* Row 1 */}
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <div className="flex items-center gap-6">
                      <p className="text-[13px] font-bold text-[#111827] min-w-[90px]">리스크 없는 소재</p>
                      <p className="text-[12px] text-[#6B7280] font-mono">목표 2영업일 이내</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-[12px] font-mono text-[#9CA3AF]">8/9건</p>
                      <p className="text-[14px] font-mono font-bold text-[#111827]">89%</p>
                    </div>
                  </div>
                  <div className="h-2 w-full flex items-center bg-transparent mt-1 overflow-hidden">
                    <div 
                      className="bg-[#111827] h-full rounded-sm" 
                      style={{ 
                        width: '89%', 
                        animation: 'growRight 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' 
                      }} 
                    />
                    <div 
                      className="flex-1 h-[2px] opacity-60 ml-1" 
                      style={{ 
                        backgroundImage: 'repeating-linear-gradient(to right, #9CA3AF 0, #9CA3AF 2.5px, transparent 2.5px, transparent 6px)' 
                      }} 
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <div className="flex items-center gap-6">
                      <p className="text-[13px] font-bold text-[#111827] min-w-[90px]">리스크 감지 소재</p>
                      <p className="text-[12px] text-[#6B7280] font-mono">목표 3영업일 이내</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-[12px] font-mono text-[#9CA3AF]">6/8건</p>
                      <p className="text-[14px] font-mono font-bold text-[#111827]">75%</p>
                    </div>
                  </div>
                  <div className="h-2 w-full flex items-center bg-transparent mt-1 overflow-hidden">
                    <div 
                      className="bg-[#111827] h-full rounded-sm" 
                      style={{ 
                        width: '75%', 
                        animation: 'growRight 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' 
                      }} 
                    />
                    <div 
                      className="flex-1 h-[2px] opacity-60 ml-1" 
                      style={{ 
                        backgroundImage: 'repeating-linear-gradient(to right, #9CA3AF 0, #9CA3AF 2.5px, transparent 2.5px, transparent 6px)' 
                      }} 
                    />
                  </div>
                </div>
                
                {/* Row 3 (Added to balance height) */}
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <div className="flex items-center gap-6">
                      <p className="text-[13px] font-bold text-[#111827] min-w-[90px]">강제 반려 소재</p>
                      <p className="text-[12px] text-[#6B7280] font-mono">당일 폐기 통보 원칙</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-[12px] font-mono text-[#9CA3AF]">3/3건</p>
                      <p className="text-[14px] font-mono font-bold text-[#111827]">100%</p>
                    </div>
                  </div>
                  <div className="h-2 w-full flex items-center bg-transparent mt-1 overflow-hidden">
                    <div 
                      className="bg-[#111827] h-full rounded-sm" 
                      style={{ 
                        width: '100%', 
                        animation: 'growRight 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' 
                      }} 
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* 2. AI 품질 & 규제 대응 모니터링 지표 */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[14px] font-bold text-[#111827]">AI 품질 (False Positives & Negatives)</p>
                <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  정상 가동중
                </div>
              </div>
              
              <div className="space-y-3">
                {/* False Positive */}
                <div className="bg-[#F9FAFB] rounded-xl p-3.5 border border-[#F3F4F6]">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <p className="text-[12px] font-bold text-[#374151]">오탐률 (과잉 차단율)</p>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-[#111827]">2.1%</span>
                      <span className="text-[10px] text-[#9CA3AF]">목표 {'<'}5%</span>
                    </div>
                  </div>
                  <p className="text-[10.5px] text-[#6B7280] leading-relaxed pl-4">안전한 소재를 리스크로 판단해 재검토를 발생시키는 비율. 지속적인 프롬프트 최적화로 마케팅 병목 최소화 중.</p>
                </div>

                {/* False Negative */}
                <div className="bg-red-50/50 rounded-xl p-3.5 border border-red-100/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <p className="text-[12px] font-bold text-red-900">미탐률 (법률 위반 통과율)</p>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-red-600">0.0%</span>
                      <span className="text-[10px] text-red-400">목표 0%</span>
                    </div>
                  </div>
                  <p className="text-[10.5px] text-red-700/80 leading-relaxed pl-4">위반 소지가 있음을 놓치고 `LOW`로 분류한 치명적 결함 비율. 0% 철벽 방어 유지 상태.</p>
                </div>

                {/* Audit Completeness */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/60">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-[#111827]" />
                      <p className="text-[12px] font-bold text-[#111827]">감사 대상 자동 추적률</p>
                    </div>
                    <span className="text-lg font-black text-[#111827]">100%</span>
                  </div>
                  <div className="mt-1 h-1 bg-[#E5E7EB] rounded-full overflow-hidden">
                    <div className="h-full bg-[#111827]" style={{ width: '100%' }} />
                  </div>
                  <p className="text-[10px] text-[#6B7280] mt-2">AI 원본 검토 파일 및 담당자 반려 사유서 전량 규제 보관 충족</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
      <style>{`
        @keyframes growRight {
          0% { width: 0%; opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
