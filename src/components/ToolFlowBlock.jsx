import { useState } from 'react'
import { CheckCircle2, Clock, Loader2, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react'

const STEP_ICON = { done: CheckCircle2, waiting: Clock, running: Loader2, error: AlertCircle }
const STEP_STYLE = {
  done: 'text-[#191919]',
  waiting: 'text-[#9CA3AF]',
  running: 'text-[#9CA3AF] animate-spin',
  error: 'text-red-400',
}

export default function ToolFlowBlock({ steps, visibleCount }) {
  const [collapsed, setCollapsed] = useState(false)
  const visible = steps.slice(0, visibleCount)
  const allDone = visibleCount >= steps.length

  return (
    <div className="border border-[#E8E8E8] rounded-xl bg-[#FAFAFA] mb-3 text-sm overflow-hidden">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#F3F4F6] transition-colors"
      >
        <div className="flex items-center gap-2">
          {collapsed ? <ChevronRight size={13} className="text-[#9CA3AF]" /> : <ChevronDown size={13} className="text-[#9CA3AF]" />}
          <span className="font-semibold text-[#374151]">Agent 처리 흐름</span>
          {collapsed && (
            <span className="text-xs text-[#9CA3AF] ml-1">
              {allDone ? `${steps.length}단계 완료` : `${visibleCount}/${steps.length} 처리중`}
            </span>
          )}
        </div>
        <span className="text-xs text-[#C4C4C4]">{collapsed ? '펼치기' : '접기'}</span>
      </button>

      {!collapsed && (
        <div className="border-t border-[#E8E8E8] px-4 pt-3 pb-3 space-y-2.5">
          {visible.map((step, i) => {
            const Icon = STEP_ICON[step.status] || CheckCircle2
            return (
              <div key={step.id} className="step-enter flex gap-3">
                <div className="flex flex-col items-center pt-0.5">
                  <Icon size={14} className={`flex-shrink-0 ${STEP_STYLE[step.status]}`} />
                  {i < visible.length - 1 && <div className="w-px flex-1 bg-[#E8E8E8] mt-1.5 min-h-[10px]" />}
                </div>
                <div className="flex-1 pb-1 min-w-0">
                  <p className="font-semibold text-[#374151]">Step {step.id}. {step.title}</p>
                  <p className="text-xs text-[#9CA3AF] whitespace-pre-line leading-relaxed mt-0.5">{step.desc}</p>
                </div>
              </div>
            )
          })}
          {visibleCount < steps.length && (
            <div className="flex items-center gap-2 pl-1">
              <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
              <span className="text-xs text-[#C4C4C4]">처리중...</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
