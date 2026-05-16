import { useState, useEffect } from 'react'
import { CheckCircle2, Loader2, GitMerge, ChevronDown, ChevronUp } from 'lucide-react'

export default function AgentFlow({ steps, visibleCount, extractedTexts, payload }) {
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    // Automatically close the accordion roughly 1.5s after finishing all steps
    if (visibleCount && visibleCount >= steps.length) {
      const timer = setTimeout(() => setIsOpen(false), 1500)
      return () => clearTimeout(timer)
    } else if (visibleCount === 0 || visibleCount === 1) {
      setIsOpen(true)
    }
  }, [visibleCount, steps && steps.length])
  if (!steps || steps.length === 0) return null

  const isBanner = steps.length > 3

  const reqPhase1 = 1
  const reqPhase2 = isBanner ? 2 : 1
  const reqPhase3 = isBanner ? 3 : 2
  const reqPhase4 = isBanner ? 4 : 3

  const getStatus = (req) => {
    if (visibleCount >= req) return 'done'
    if (visibleCount === req - 1) return 'active'
    return 'pending'
  }

  const renderIcon = (req) => {
    const status = getStatus(req)
    if (status === 'done') return <CheckCircle2 size={16} strokeWidth={2.5} className="text-emerald-500 flex-shrink-0" />
    if (status === 'active') return <Loader2 size={16} strokeWidth={2.5} className="animate-spin text-gray-400 flex-shrink-0" />
    return <div className="w-[16px] h-[16px] rounded-full border-[2.5px] border-gray-200 flex-shrink-0" />
  }

  const isComplete = visibleCount >= steps.length

  return (
    <div className="font-pretendard mb-4 border border-[#E5E7EB] rounded-xl overflow-hidden bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
      {/* Header (Toggle) */}
      <div 
        className="bg-[#FAFAFA] border-b border-[#E5E7EB] px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {isOpen ? <ChevronUp size={14} className="text-[#9CA3AF]" /> : <ChevronDown size={14} className="text-[#9CA3AF]" />}
          <span className="text-xs font-bold text-[#6B7280] tracking-wider uppercase">
            Agent {isComplete ? '오케스트레이션 완료됨' : '처리 중...'}
          </span>
        </div>
        {isComplete ? <span className="text-emerald-500 text-[10px] font-bold uppercase">완료됨</span> : <Loader2 size={14} className="animate-spin text-[#9CA3AF]" />}
      </div>
      
      {/* Body */}
      <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-5 space-y-6 bg-white">
          
          {/* Phase 1: Planning */}
          <div className={`transition-opacity duration-300 ${getStatus(reqPhase1) !== 'pending' ? 'opacity-100' : 'opacity-30'}`}>
            <div className="flex items-start gap-3">
              <div className="mt-[3px]">{renderIcon(reqPhase1)}</div>
              <div>
                <p className={`text-[13.5px] font-bold tracking-tight ${getStatus(reqPhase1) === 'done' ? 'text-emerald-600' : 'text-[#111827]'}`}>
                  Master Agent — 실행 계획 수립 완료
                </p>
                <p className="text-[11.5px] text-[#6B7280] mt-1.5 font-medium">
                  {isBanner ? '이미지 첨부 감지 → OCR 포함 다중 실행 계획' : '텍스트 입력 감지 → 단일 검토 실행 계획'}
                </p>
              </div>
            </div>
          </div>

          {/* Phase 2: Parallel Box or Sequential */}
          <div className={`transition-opacity duration-300 ${getStatus(reqPhase2) !== 'pending' ? 'opacity-100' : 'opacity-30'}`}>
            {isBanner ? (
              <div className="ml-[7px] pl-6 border-l-2 border-[#E5E7EB]">
                <div className="border border-[#E5E7EB] rounded-xl bg-white overflow-hidden shadow-sm">
                  <div className="bg-[#F9FAFB] border-b border-[#F3F4F6] px-3.5 py-2 flex items-center gap-2">
                    <GitMerge size={13} className="text-[#9CA3AF]" />
                    <span className="text-[11px] font-bold text-[#6B7280] tracking-wide">병렬 실행 (PARALLEL)</span>
                  </div>
                  <div className="p-4 space-y-3.5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-3">
                        {renderIcon(reqPhase2)}
                        <span className="text-[13px] font-bold text-[#374151]">이미지 텍스트 추출 (OCR)</span>
                      </div>
                      {/* Generative Terminal Log */}
                      {getStatus(reqPhase2) !== 'pending' && extractedTexts && extractedTexts.length > 0 && (
                        <div className="ml-[28px] mt-1 bg-[#1E1E1E] rounded-xl px-3.5 py-3 text-[#D4D4D4] text-[11px] font-mono leading-relaxed overflow-hidden shadow-inner">
                          <div className="terminal-line" style={{ animationDelay: '0.1s' }}>&gt; Initiating Vision API...</div>
                          <div className="terminal-line" style={{ animationDelay: '0.9s' }}>&gt; Detecting bounding boxes: {extractedTexts.length} found.</div>
                          {extractedTexts.map((t, idx) => (
                             <div key={idx} className="terminal-line text-amber-200" style={{ animationDelay: `${1.6 + idx * 0.5}s` }}>
                               &gt; Extracting: "{t.text}"
                             </div>
                          ))}
                          <div className="terminal-line text-emerald-400 font-bold" style={{ animationDelay: `${1.6 + extractedTexts.length * 0.5 + 0.4}s` }}>
                            &gt; OCR Payload stream completed.
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {renderIcon(reqPhase2)}
                      <span className="text-[13px] font-bold text-[#374151]">금지어 · 고지 문구 체크</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-start gap-3">
                  <div className="mt-[3px]">{renderIcon(reqPhase2)}</div>
                  <div>
                    <p className={`text-[13.5px] font-bold tracking-tight ${getStatus(reqPhase2) === 'done' ? 'text-emerald-600' : 'text-[#111827]'}`}>
                      금지어 · 고지 문구 체크
                    </p>
                  </div>
                </div>
                {/* Chat Generative Term Log */}
                {getStatus(reqPhase2) !== 'pending' && payload && (
                  <div className="ml-[28px] mt-1 bg-[#1E1E1E] rounded-xl px-3.5 py-3 text-[#D4D4D4] text-[11px] font-mono leading-relaxed overflow-hidden shadow-inner">
                    <div className="terminal-line" style={{ animationDelay: '0.1s' }}>&gt; Initiating Compliance Ruleset AI...</div>
                    <div className="terminal-line" style={{ animationDelay: '0.6s' }}>&gt; Tokenizing: "{payload.length > 25 ? payload.slice(0, 25) + '...' : payload}"</div>
                    <div className="terminal-line text-amber-200" style={{ animationDelay: '1.2s' }}>&gt; Scanning Capital Market Act keywords...</div>
                    <div className="terminal-line text-emerald-400 font-bold" style={{ animationDelay: '1.9s' }}>&gt; Regulatory matching stream completed.</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Phase 3: RAG Search */}
          <div className={`transition-opacity duration-300 ${getStatus(reqPhase3) !== 'pending' ? 'opacity-100' : 'opacity-30'}`}>
            <div className="flex items-start gap-3">
              <div className="mt-[3px]">{renderIcon(reqPhase3)}</div>
              <div>
                <p className={`text-[13.5px] font-bold tracking-tight ${getStatus(reqPhase3) === 'done' ? 'text-emerald-600' : 'text-[#111827]'}`}>
                  선례 검색 (RAG)
                </p>
                <p className="text-[11.5px] text-[#6B7280] mt-1.5 font-medium">
                  {isBanner ? 'OCR 추출 텍스트 기반 → 3-Tier VDB 검색' : '문구 컨텍스트 기반 → 3-Tier VDB 검색'}
                </p>
              </div>
            </div>
          </div>

          {/* Phase 4: Risk Scoring & Summary */}
          <div className={`transition-opacity duration-300 ${getStatus(reqPhase4) !== 'pending' ? 'opacity-100' : 'opacity-30'}`}>
            <div className="flex items-start gap-3">
              <div className="mt-[3px]">{renderIcon(reqPhase4)}</div>
              <div>
                <p className={`text-[13.5px] font-bold tracking-tight ${getStatus(reqPhase4) === 'done' ? 'text-emerald-600' : 'text-[#111827]'}`}>
                  리스크 등급 산출 중...
                </p>
                <p className="text-[11.5px] text-[#6B7280] mt-1.5 font-medium">
                  Master Agent — 결과 종합 및 Citation 생성
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
