// type: 'policy' | 'approved' | 'rejected'
const ICONS = { policy: '📋', approved: '✅', rejected: '⚠️' }
const LABELS = { policy: '정책 문서', approved: '승인 선례', rejected: '반려 선례' }

export default function CitationCard({ citation, compact = false, onClick }) {
  const { type, title, desc, source, date, approver, caseId } = citation
  const icon  = ICONS[type]  || '📋'
  const label = LABELS[type] || '정책 문서'

  if (compact) return (
    <div onClick={() => onClick && onClick(citation)} className={`flex items-start gap-2 bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 ${onClick ? 'cursor-pointer hover:border-blue-400 hover:shadow-sm hover:bg-blue-50/30 transition-all group relative' : ''}`}>
      <span className="text-xs leading-none mt-0.5 flex-shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold text-[#6B7280] mb-0.5">{label}</p>
        <p className="text-xs font-medium text-[#374151] truncate">{title}</p>
        {caseId && <p className="text-[10px] font-mono text-[#9CA3AF] mb-1">{caseId}</p>}
        {onClick && <p className="text-[9.5px] font-bold text-blue-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">💡 클릭하면 원본뷰어가 열립니다</p>}
      </div>
    </div>
  )

  return (
    <div onClick={() => onClick && onClick(citation)} className={`bg-white border rounded-xl px-4 py-3 relative transition-all ${onClick ? 'cursor-pointer border-blue-200 shadow-sm hover:border-blue-500 hover:shadow-md group' : 'border-[#E5E7EB]'}`}>
      {onClick && <span className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded text-[10px] transition-opacity">클릭하여 원본뷰어 확인</span>}
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-xs">{icon}</span>
        <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-semibold text-[#111827] mb-0.5 pr-20">{title}</p>
      <p className="text-xs text-[#6B7280] leading-relaxed mb-2">{desc}</p>
      
      {citation.detail && (
        <div className="bg-[#F9FAFB] border-l-2 border-[#D1D5DB] pl-3 py-1.5 my-2.5">
           <p className="text-[11.5px] text-[#4B5563] leading-relaxed break-keep font-serif border-l-border-dashed drop-shadow-sm">"{citation.detail}"</p>
        </div>
      )}

      {source && <p className={`text-[11px] mt-1 ${onClick ? 'text-blue-600 font-medium font-mono underline decoration-blue-300 underline-offset-2 flex items-center gap-1' : 'text-[#9CA3AF]'}`}>📄 {source}</p>}
      {(date || approver || caseId) && (
        <div className="flex flex-wrap gap-x-2 mt-2 pt-2 border-t border-[#F3F4F6]">
          {date     && <span className="text-[10px] text-[#9CA3AF]">{type === 'approved' ? '승인일' : '반려일'}: {date}</span>}
          {approver && <span className="text-[10px] text-[#9CA3AF]">· {approver}</span>}
          {caseId   && <span className="text-[10px] font-mono text-[#9CA3AF]">· {caseId}</span>}
        </div>
      )}
    </div>
  )
}

