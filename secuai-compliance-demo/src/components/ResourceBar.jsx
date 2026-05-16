export default function ResourceBar({ label, value, unit = '%', warning, warningText }) {
  const getColor = (v) => {
    if (v >= 90) return 'bg-kakao-danger'
    if (v >= 80) return 'bg-kakao-warning'
    return 'bg-kakao-success'
  }

  const getTextColor = (v) => {
    if (v >= 90) return 'text-kakao-danger'
    if (v >= 80) return 'text-kakao-warning'
    return 'text-kakao-success'
  }

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-kakao-textSecondary">{label}</span>
        <div className="flex items-center gap-1">
          <span className={`text-xs font-semibold ${getTextColor(value)}`}>
            {value}{unit}
          </span>
          {warning && (
            <span className="text-sm animate-pulse-warning">⚠️</span>
          )}
        </div>
      </div>
      <div className="h-1.5 bg-kakao-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getColor(value)} ${warning ? 'animate-pulse-warning' : ''}`}
          style={{ width: `${value}%` }}
        />
      </div>
      {warning && warningText && (
        <p className="text-xs text-kakao-warning mt-1">{warningText}</p>
      )}
    </div>
  )
}
