export default function ProactiveAlert({ type, updated, onConfirm }) {
  const alerts = {
    k8s: {
      icon: '⚠️',
      title: 'k8s EOL D-180 감지',
      desc: '현재 v1.28.6 — 2025.10.28 EOL 예정\n호환성 체크 및 업그레이드 검토 필요',
    },
    vdb: {
      icon: '⚠️',
      title: 'VDB 스토리지 임계치 예측',
      desc: '현재 71% — 11일 내 80% 초과 예측\n일평균 80GB 배치 적재 지속 중',
    },
  }

  const alert = alerts[type]
  if (!alert) return null

  return (
    <div className="border border-orange-200 bg-orange-50 rounded-xl p-3 mb-2">
      <div className="flex items-start gap-2">
        <span className="text-sm mt-0.5">{alert.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xs bg-kakao-warning/20 text-kakao-warning px-1.5 py-0.5 rounded-full font-medium">🤖 자동 감지</span>
          </div>
          <p className="text-xs font-semibold text-kakao-textPrimary mb-0.5">{alert.title}</p>
          <p className="text-xs text-kakao-textSecondary whitespace-pre-line leading-relaxed">{alert.desc}</p>
          {updated ? (
            <div className="mt-2 flex items-center gap-1">
              <span className="text-xs text-kakao-success font-medium">✅ {updated}</span>
            </div>
          ) : (
            <button
              onClick={() => onConfirm(type)}
              className="mt-2 text-xs bg-kakao-warning text-white px-3 py-1 rounded-lg hover:bg-orange-500 transition-colors font-medium"
            >
              확인하기
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
