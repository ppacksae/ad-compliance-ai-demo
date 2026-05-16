const STATUS_STYLES = {
  inprogress: 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
  done: 'bg-green-100 text-green-700',
}

const STATUS_LABELS = {
  inprogress: '진행중',
  pending: '승인대기',
  done: '완료',
}

export default function WorkCard({ icon, label, status, statusType, isNew }) {
  return (
    <div className={`flex items-center justify-between py-2 px-2 rounded-lg hover:bg-kakao-bg transition-colors ${isNew ? 'step-enter' : ''}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm">{icon}</span>
        <span className="text-xs text-kakao-textPrimary font-medium truncate max-w-[120px]">{label}</span>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${STATUS_STYLES[statusType]}`}>
        {STATUS_LABELS[statusType] || status}
      </span>
    </div>
  )
}
