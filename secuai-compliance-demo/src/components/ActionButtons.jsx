import { FileText, CheckCircle, Edit, BarChart2, MessageSquare, Pause } from 'lucide-react'

const ICON_MAP = { FileText, CheckCircle, Edit, BarChart2, MessageSquare, Pause }

const BTN_STYLE = {
  doc: 'border border-[#E8E8E8] text-[#374151] bg-white hover:bg-[#F9F9F9]',
  submit: 'bg-[#FEE500] text-[#191919] font-semibold hover:bg-yellow-300',
  edit: 'border border-[#E8E8E8] text-[#6B7280] bg-white hover:bg-[#F9F9F9]',
  report: 'border border-[#E8E8E8] text-[#374151] bg-white hover:bg-[#F9F9F9]',
  message: 'border border-[#E8E8E8] text-[#374151] bg-white hover:bg-[#F9F9F9]',
  hold: 'border border-[#E8E8E8] text-[#9CA3AF] bg-white hover:bg-[#F9F9F9]',
}

export default function ActionButtons({ buttons, onAction, disabled }) {
  return (
    <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-[#F3F4F6]">
      {buttons.map((btn) => {
        const Icon = ICON_MAP[btn.icon]
        return (
          <button
            key={btn.id}
            onClick={() => !disabled && onAction(btn.id, btn.type)}
            disabled={disabled}
            className={`flex items-center gap-1.5 text-sm px-3.5 py-1.5 rounded-lg transition-colors ${BTN_STYLE[btn.type] || 'border border-[#E8E8E8] text-[#374151] bg-white'} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            {Icon && <Icon size={13} />}
            {btn.label}
          </button>
        )
      })}
    </div>
  )
}
