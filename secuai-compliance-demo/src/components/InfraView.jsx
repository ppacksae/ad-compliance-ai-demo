import { useState, useRef } from 'react'
import { CheckCircle2, XCircle, AlertTriangle, ArrowUpRight, TrendingUp } from 'lucide-react'
import { ChatInput } from './ChatView'

function ProgressBar({ value, warn }) {
  const color = warn ? 'bg-[#FEE500]' : 'bg-[#191919]'
  return (
    <div className="h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

function MetricCard({ label, value, unit = '%', warn, warnText, action, onAction }) {
  return (
    <div className={`bg-white border rounded-xl p-5 ${warn ? 'border-[#FEE500]' : 'border-[#E5E5E5]'}`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-[#767676]">{label}</p>
        {warn && <span className="text-xs bg-[#FFFBEB] text-[#B45309] border border-[#FEE500]/40 px-2 py-0.5 rounded-full">경고</span>}
      </div>
      <p className="text-3xl font-bold text-[#191919] mb-1">
        {value}<span className="text-lg text-[#767676] ml-1">{unit}</span>
      </p>
      {warnText && <p className="text-xs text-[#B45309] mb-3">{warnText}</p>}
      <ProgressBar value={typeof value === 'number' ? value : 0} warn={warn} />
      {action && (
        <button
          onClick={onAction}
          className="mt-4 w-full flex items-center justify-center gap-2 text-sm font-medium bg-[#191919] text-white py-2 rounded-lg hover:bg-[#2A2A2A] transition-colors"
        >
          {action}
          <ArrowUpRight size={14} />
        </button>
      )}
    </div>
  )
}

function StatusBadge({ status }) {
  if (status === 'ok') return <CheckCircle2 size={16} className="text-[#191919]" />
  if (status === 'error') return <XCircle size={16} className="text-red-500" />
  return <AlertTriangle size={16} className="text-amber-500" />
}

function ResourceView({ onTrigger }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#191919] mb-1">리소스 현황</h2>
        <p className="text-sm text-[#767676]">실시간 인프라 리소스 사용 현황</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <MetricCard label="GPU 사용률" value={78} />
        <MetricCard label="Memory 쿼터" value={61} />
        <MetricCard
          label="VDB 스토리지"
          value={71}
          warn
          warnText="11일 내 80% 임계치 초과 예측"
          action="증설 결재 요청하기"
          onAction={() => onTrigger('vdb스토리지', 'VDB 스토리지 현황을 확인하고 증설 결재를 요청하고 싶어요')}
        />
      </div>
    </div>
  )
}

function K8sView({ onTrigger }) {
  const compat = [
    { name: 'Redis 7.0.x', current: 'v1.30 호환', status: 'ok' },
    { name: 'nvidia-driver 525.x', current: '545.x 필요', status: 'error' },
    { name: 'CUDA 12.3', current: '재검토 필요', status: 'warn' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#191919] mb-1">k8s 모니터링</h2>
        <p className="text-sm text-[#767676]">Kubernetes 클러스터 버전 및 호환성 현황</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {[
          { label: '현재 버전', value: 'v1.28.6', sub: 'production-cluster-01' },
          { label: 'EOL 예정일', value: '2025.10.28', sub: 'D-180' },
          { label: '권장 버전', value: 'v1.30', sub: '업그레이드 권장' },
        ].map((item) => (
          <div key={item.label} className="bg-white border border-[#E5E5E5] rounded-xl p-5">
            <p className="text-sm text-[#767676] mb-2">{item.label}</p>
            <p className="text-2xl font-bold text-[#191919]">{item.value}</p>
            <p className="text-xs text-[#BBBBBB] mt-1">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-[#F0F0F0]">
          <p className="text-sm font-semibold text-[#191919]">호환성 체크</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-[#FAFAFA]">
            <tr>
              <th className="px-5 py-2.5 text-left text-xs text-[#767676] font-medium">컴포넌트</th>
              <th className="px-5 py-2.5 text-left text-xs text-[#767676] font-medium">현황</th>
              <th className="px-5 py-2.5 text-left text-xs text-[#767676] font-medium">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F0F0]">
            {compat.map((row) => (
              <tr key={row.name}>
                <td className="px-5 py-3 font-medium text-[#191919]">{row.name}</td>
                <td className="px-5 py-3 text-[#767676]">{row.current}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={() => onTrigger('k8s점검', 'k8s EOL 현황 확인하고 담당자 검토 요청하고 싶어요')}
        className="flex items-center gap-2 text-sm font-medium bg-[#191919] text-white px-5 py-2.5 rounded-xl hover:bg-[#2A2A2A] transition-colors"
      >
        담당자 검토 요청하기
        <ArrowUpRight size={14} />
      </button>
    </div>
  )
}

function VdbView({ onTrigger }) {
  const timeline = [
    { label: '현재', value: '71%', note: '7.1TB / 10TB', highlight: false },
    { label: '+11일', value: '80%', note: '임계치 도달', highlight: true },
    { label: '+36일', value: '90%+', note: '초과 예상', highlight: false },
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#191919] mb-1">VDB 스토리지</h2>
        <p className="text-sm text-[#767676]">Vector DB 스토리지 적재 현황 및 예측</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white border border-[#FEE500] rounded-xl p-5 col-span-1">
          <p className="text-sm text-[#767676] mb-2">현재 적재량</p>
          <p className="text-3xl font-bold text-[#191919]">71<span className="text-lg text-[#767676] ml-1">%</span></p>
          <p className="text-xs text-[#767676] mt-1 mb-3">7.1TB / 10TB</p>
          <ProgressBar value={71} warn />
        </div>
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-5">
          <p className="text-sm text-[#767676] mb-2">일평균 증가량</p>
          <p className="text-3xl font-bold text-[#191919]">80<span className="text-lg text-[#767676] ml-1">GB</span></p>
          <p className="text-xs text-[#767676] mt-1">배치 적재 기준</p>
          <div className="flex items-center gap-1 mt-3">
            <TrendingUp size={13} className="text-[#767676]" />
            <span className="text-xs text-[#767676]">매일 지속 증가</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-[#F0F0F0]">
          <p className="text-sm font-semibold text-[#191919]">임계치 도달 예측</p>
        </div>
        <div className="grid grid-cols-3 divide-x divide-[#F0F0F0]">
          {timeline.map((item) => (
            <div key={item.label} className={`px-5 py-4 text-center ${item.highlight ? 'bg-[#FFFBEB]' : ''}`}>
              <p className="text-xs text-[#767676] mb-1">{item.label}</p>
              <p className={`text-xl font-bold ${item.highlight ? 'text-[#B45309]' : 'text-[#191919]'}`}>{item.value}</p>
              <p className="text-xs text-[#BBBBBB] mt-1">{item.note}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => onTrigger('vdb스토리지', 'VDB 스토리지 현황 확인하고 증설 결재를 요청하고 싶어요')}
        className="flex items-center gap-2 text-sm font-medium bg-[#191919] text-white px-5 py-2.5 rounded-xl hover:bg-[#2A2A2A] transition-colors"
      >
        증설 결재 요청하기
        <ArrowUpRight size={14} />
      </button>
    </div>
  )
}

export default function InfraView({ activeMenu, onTrigger, onSend, isProcessing }) {
  const [input, setInput] = useState('')
  const textareaRef = useRef(null)

  const handleSend = () => {
    const text = input.trim()
    if (!text || isProcessing) return
    onSend(text)
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto scrollbar-thin px-8 py-6">
        {activeMenu === '리소스현황' && <ResourceView onTrigger={onTrigger} />}
        {activeMenu === 'k8s모니터링' && <K8sView onTrigger={onTrigger} />}
        {activeMenu === 'VDB스토리지' && <VdbView onTrigger={onTrigger} />}
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        onSend={handleSend}
        onKeyDown={handleKeyDown}
        isProcessing={isProcessing}
        textareaRef={textareaRef}
        placeholder="추가 질문을 입력하거나, 위 버튼으로 바로 요청하세요..."
      />
    </div>
  )
}
