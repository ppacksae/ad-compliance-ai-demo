import { X, CheckCircle } from 'lucide-react'

export default function DocumentViewer({ doc, open, onClose, onSubmit }) {
  if (!doc) return null
  const isInfra = !!doc.evidence

  return (
    <div className={`flex-shrink-0 bg-white border-l border-[#E8E8E8] flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${open ? 'w-[460px]' : 'w-0'}`}>
      {open && (
        <div className="flex flex-col h-full min-w-[460px]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E8E8]">
            <h2 className="font-bold text-[#191919] text-sm">{doc.title}</h2>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] transition-colors text-[#9CA3AF] hover:text-[#374151]">
              <X size={15} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin p-7">
            <div className="max-w-[340px] mx-auto">
              {/* 로고 */}
              <div className="flex items-center justify-center gap-2 mb-8">
                <div className="w-6 h-6 bg-[#FEE500] rounded-md flex items-center justify-center">
                  <span className="text-[#191919] text-[10px] font-black">SC</span>
                </div>
                <span className="font-bold text-[#191919] text-sm">A증권</span>
              </div>

              <h3 className="text-center font-bold text-[#191919] mb-6 pb-4 border-b-2 border-[#191919] leading-snug">
                {doc.title}
              </h3>

              {/* 기본 정보 */}
              <div className="space-y-2 mb-5 text-sm">
                {[[isInfra ? '요청일' : '신청일', doc.requestDate],
                  [isInfra ? '요청팀' : '부  서', doc.dept],
                  [isInfra ? '요청자' : '성  명', doc.applicant]
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-4">
                    <span className="text-[#9CA3AF] w-14 flex-shrink-0 text-xs">{label}</span>
                    <span className="font-medium text-[#374151]">{value}</span>
                  </div>
                ))}
              </div>

              {/* 테이블 */}
              <table className="w-full border-collapse text-sm mb-5">
                <tbody>
                  {doc.rows.map((row, i) => (
                    <tr key={i} className="border border-[#E8E8E8]">
                      <td className="bg-[#FAFAFA] px-3 py-2.5 text-xs text-[#6B7280] w-2/5">{row.label}</td>
                      <td className="px-3 py-2.5 font-medium text-[#374151]">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 증설 근거 */}
              {doc.evidence && (
                <div className="bg-[#FFFDE7] border border-[#FEE500]/30 rounded-xl p-4 mb-5">
                  <p className="text-xs font-semibold text-[#374151] mb-2">증설 근거</p>
                  <ul className="space-y-1.5">
                    {doc.evidence.map((e, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#6B7280]">
                        <span className="w-1 h-1 rounded-full bg-[#9CA3AF] mt-1.5 flex-shrink-0" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 결재란 */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-[#6B7280] mb-2 uppercase tracking-wider">결재란</p>
                <div className="grid border border-[#E8E8E8]" style={{ gridTemplateColumns: `repeat(${doc.approvers.length}, 1fr)` }}>
                  {doc.approvers.map((approver, i) => (
                    <div key={i} className={`text-center py-3 px-2 ${i < doc.approvers.length - 1 ? 'border-r border-[#E8E8E8]' : ''}`}>
                      <div className="text-xs text-[#9CA3AF] whitespace-pre-line leading-snug mb-3">{approver}</div>
                      {i === 0 && <div className="text-[10px] text-[#C4C4C4] border-t border-dashed border-[#E8E8E8] pt-2">서명</div>}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onSubmit}
                className="w-full flex items-center justify-center gap-2 bg-[#FEE500] text-[#191919] py-3 rounded-xl font-bold text-sm hover:bg-yellow-300 transition-colors"
              >
                <CheckCircle size={15} />
                이 내용으로 상신하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
