import { useState } from 'react'
import { Zap } from 'lucide-react'
import RiskBadge from './RiskBadge'
import { COMPLETION_HISTORY } from '../data/complianceData'

const RESULT_CFG = {
  '승인':     { text: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  '수정요청': { text: 'text-amber-600',   bg: 'bg-amber-50 border-amber-200' },
  '반려':     { text: 'text-red-600',     bg: 'bg-red-50 border-red-200' },
}

function ResultChip({ result }) {
  const cfg = RESULT_CFG[result] || {}
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${cfg.bg} ${cfg.text}`}>
      {result}
    </span>
  )
}

const FILTERS = [
  { key: 'all',   label: '전체' },
  { key: '승인',  label: '승인' },
  { key: '수정요청', label: '수정요청' },
  { key: '반려',  label: '반려' },
]

export default function CompletionHistoryView() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all'
    ? COMPLETION_HISTORY
    : COMPLETION_HISTORY.filter(i => i.legalResult === filter)

  const flywheelCount = COMPLETION_HISTORY.filter(i => i.isFlywheel).length

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[#F9FAFB]">
      {/* 헤더 */}
      <div className="px-6 py-3.5 bg-white border-b border-[#F3F4F6] flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold text-[#111827]">완료 이력</h1>
            <p className="text-[11px] text-[#9CA3AF] mt-0.5">처리 완료된 소재들의 검토 이력</p>
          </div>
          {flywheelCount > 0 && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280] bg-white border border-[#E5E7EB] px-3 py-1.5 rounded-lg">
              <Zap size={11} className="text-amber-500" />
              Knowledge Flywheel {flywheelCount}건 적재됨
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
        <div className="max-w-5xl mx-auto">

          {/* 요약 카드 */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: '총 처리',   value: COMPLETION_HISTORY.length + '건', sub: '전체 기간' },
              { label: '승인률',   value: Math.round(COMPLETION_HISTORY.filter(i => i.legalResult === '승인').length / COMPLETION_HISTORY.length * 100) + '%', sub: '법무 최종 승인' },
              { label: 'Flywheel 적재', value: flywheelCount + '건', sub: 'AI-법무 불일치 케이스', accent: true },
            ].map(({ label, value, sub, accent }) => (
              <div key={label} className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-4">
                <p className="text-xs text-[#9CA3AF] mb-1">{label}</p>
                <p className={`text-2xl font-black ${accent ? 'text-amber-500' : 'text-[#111827]'}`}>{value}</p>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* 테이블 */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F3F4F6]">
              <p className="text-xs font-semibold text-[#374151]">이력 목록</p>
              <div className="flex items-center gap-1.5">
                {FILTERS.map(f => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${
                      filter === f.key ? 'bg-[#111827] text-white font-semibold' : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 헤더 row */}
            <div className="grid grid-cols-[2fr_1fr_0.8fr_1fr_1fr_1fr_0.8fr] px-5 py-2.5 bg-[#F9FAFB] border-b border-[#F3F4F6]">
              {['소재명', '제출자', 'AI 판정', '법무 판정', '처리자', '처리일', ''].map(h => (
                <p key={h} className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider">{h}</p>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-[#9CA3AF]">해당 항목이 없습니다</p>
              </div>
            ) : (
              filtered.map((item, i) => (
                <div
                  key={item.id}
                  className={`grid grid-cols-[2fr_1fr_0.8fr_1fr_1fr_1fr_0.8fr] px-5 py-3.5 items-center hover:bg-[#F9FAFB] transition-colors ${
                    i < filtered.length - 1 ? 'border-b border-[#F3F4F6]' : ''
                  } ${item.isFlywheel ? 'bg-amber-50/30' : ''}`}
                >
                  <p className="text-sm font-medium text-[#111827]">{item.name}</p>
                  <p className="text-xs text-[#6B7280]">{item.submitter}</p>
                  <div><RiskBadge level={item.aiRisk} size="sm" /></div>
                  <div>
                    <ResultChip result={item.legalResult} />
                    {/* AI-법무 불일치 강조 */}
                    {item.isFlywheel && (
                      <span className="ml-1 text-[9px] text-amber-500 font-bold">불일치</span>
                    )}
                  </div>
                  <p className="text-xs text-[#374151]">{item.legalManager}</p>
                  <p className="text-xs text-[#6B7280]">{item.resolvedAt}</p>
                  <div className="flex items-center">
                    {item.isFlywheel && (
                      <div className="flex items-center gap-1 text-[10px] text-amber-600 font-semibold"
                        title={item.flywheelNote}>
                        <Zap size={11} />Flywheel
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Flywheel 설명 */}
          {flywheelCount > 0 && (
            <div className="mt-4 bg-white border border-[#E5E7EB] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={13} className="text-amber-500" />
                <p className="text-xs font-semibold text-[#374151]">Knowledge Flywheel 적재 안내</p>
              </div>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                AI 판단과 법무 판단이 다른 케이스는 <strong>Tier 3 (최고품질)</strong>로 자동 적재됩니다.
                이 데이터가 누적될수록 AI가 법무 판단에 수렴하는 선순환 구조가 강화됩니다.
              </p>
              <div className="mt-3 space-y-1.5">
                {COMPLETION_HISTORY.filter(i => i.isFlywheel).map(item => (
                  <div key={item.id} className="flex items-start gap-2 text-xs text-[#6B7280]">
                    <Zap size={10} className="text-amber-400 mt-0.5 flex-shrink-0" />
                    <span><strong className="text-[#374151]">{item.name}</strong> — {item.flywheelNote}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
