import ToolFlowBlock from './ToolFlowBlock'
import ActionButtons from './ActionButtons'

function formatAnswer(text) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('[') && line.endsWith(']')) {
      return <p key={i} className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mt-3 mb-1">{line.slice(1, -1)}</p>
    }
    if (line === '') return <div key={i} className="h-1.5" />
    return <p key={i} className="text-sm leading-relaxed text-[#374151]">{line}</p>
  })
}

function DateOptions({ options, onSelect, selected }) {
  if (selected) return null
  return (
    <div className="mt-4 pt-3 border-t border-[#F3F4F6]">
      <p className="text-xs text-[#9CA3AF] mb-2.5">날짜를 선택하거나 직접 입력하세요</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt)}
            className="text-left border border-[#E8E8E8] rounded-xl px-3.5 py-3 hover:border-[#FEE500] hover:bg-[#FEE500]/5 transition-all group"
          >
            <p className="text-sm font-medium text-[#374151] group-hover:text-[#191919]">{opt.label}</p>
            {opt.sub && <p className="text-xs text-[#9CA3AF] mt-0.5">{opt.sub}</p>}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function MessageBubble({ message, onAction, onDateSelect }) {
  const { role, content, steps, visibleSteps, buttons, actionsDisabled, dateOptions, dateSelected } = message

  if (role === 'typing') return (
    <div className="flex items-start gap-3 mb-6">
      <Avatar />
      <div className="bg-white border border-[#E8E8E8] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1.5 items-center h-5">
          <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
        </div>
      </div>
    </div>
  )

  if (role === 'system') return (
    <div className="flex justify-center mb-4">
      <p className="text-xs text-[#9CA3AF] bg-[#F9F9F9] border border-[#E8E8E8] px-4 py-1.5 rounded-full">{content}</p>
    </div>
  )

  if (role === 'user') return (
    <div className="flex justify-end mb-6">
      <div className="max-w-[72%] bg-[#191919] text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm leading-relaxed">
        {content}
      </div>
    </div>
  )

  return (
    <div className="flex items-start gap-3 mb-6">
      <Avatar />
      <div className="flex-1 max-w-[88%]">
        {steps && steps.length > 0 && <ToolFlowBlock steps={steps} visibleCount={visibleSteps ?? steps.length} />}
        {content && (
          <div className="bg-white border border-[#E8E8E8] rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
            <div className="space-y-0">{formatAnswer(content)}</div>
            {dateOptions && <DateOptions options={dateOptions} onSelect={onDateSelect} selected={dateSelected} />}
            {buttons && buttons.length > 0 && <ActionButtons buttons={buttons} onAction={onAction} disabled={actionsDisabled} />}
          </div>
        )}
      </div>
    </div>
  )
}

function Avatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-[#FEE500] flex items-center justify-center flex-shrink-0 mt-0.5">
      <span className="text-[10px] font-black text-[#191919]">AI</span>
    </div>
  )
}
