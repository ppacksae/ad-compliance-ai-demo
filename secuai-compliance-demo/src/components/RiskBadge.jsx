export const RISK_CONFIG = {
  HIGH:   { label: 'HIGH',   bg: 'bg-red-50',      text: 'text-red-600',     border: 'border-red-200',    dot: 'bg-red-500' },
  MEDIUM: { label: 'MEDIUM', bg: 'bg-amber-50',    text: 'text-amber-600',   border: 'border-amber-200',  dot: 'bg-amber-400' },
  LOW:    { label: 'LOW',    bg: 'bg-emerald-50',  text: 'text-emerald-600', border: 'border-emerald-200', dot: 'bg-emerald-500' },
}

export default function RiskBadge({ level, size = 'md' }) {
  const cfg = RISK_CONFIG[level] || RISK_CONFIG.LOW
  const cls =
    size === 'lg' ? 'text-[11px] font-bold px-2.5 py-1 gap-1.5' :
    size === 'sm' ? 'text-[9px] font-bold px-1.5 py-0.5 gap-1' :
                   'text-[10px] font-bold px-2 py-0.5 gap-1'
  const dotSize = size === 'lg' ? 'w-1.5 h-1.5' : 'w-1 h-1'
  return (
    <span className={`inline-flex items-center rounded-md border ${cfg.bg} ${cfg.text} ${cfg.border} ${cls}`}>
      <span className={`rounded-full flex-shrink-0 ${cfg.dot} ${dotSize}`} />
      {cfg.label}
    </span>
  )
}
