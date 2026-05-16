import { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowUp, RotateCcw, ImagePlus, ShieldCheck, Menu, Minus, Plus, X } from 'lucide-react'
import AgentFlow from './AgentFlow'
import CitationCard from './CitationCard'
import { buildChatResponse, CHAT_STEPS, CHAT_EXAMPLES } from '../data/complianceData'

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }



function AgentAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-[#111827] flex items-center justify-center flex-shrink-0 mt-0.5">
      <span className="text-[10px] font-black text-[#FEE500]">AI</span>
    </div>
  )
}

function TypingBubble() {
  return (
    <div className="flex items-start gap-3 mb-5">
      <AgentAvatar />
      <div className="bg-white border border-[#E5E7EB] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1.5 items-center h-5">
          <span className="typing-dot"/><span className="typing-dot"/><span className="typing-dot"/>
        </div>
      </div>
    </div>
  )
}

function ResultBubble({ resp, steps, visibleSteps, payload, onCitationClick }) {
  if (!resp && visibleSteps < steps.length) {
    return (
      <div className="flex items-start gap-3 mb-5 w-full">
        <AgentAvatar />
        <div className="flex-1 min-w-0 pr-4">
          <AgentFlow steps={steps} visibleCount={visibleSteps} payload={payload} />
        </div>
      </div>
    )
  }
  return (
    <div className="flex items-start gap-3 mb-5 w-full">
      <AgentAvatar />
      <div className="flex-1 min-w-0 pr-4">
        <AgentFlow steps={steps} visibleCount={visibleSteps} payload={payload} />
        {resp && (
          <div className="step-enter mt-2 space-y-3">
            {/* Conversational Bubble Header */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
              <p className="text-[13.5px] text-[#374151] leading-relaxed break-keep">
                {resp.risk === 'HIGH' && <span className="font-bold text-red-600 mb-1 block">🚨 컴플라이언스 위반 리스크가 매우 높습니다.</span>}
                {resp.risk === 'MEDIUM' && <span className="font-bold text-amber-600 mb-1 block">⚠️ 컴플라이언스 기준 상 모호한 표현이 포함되어 있습니다.</span>}
                {resp.risk === 'LOW' && <span className="font-bold text-emerald-600 mb-1 block">✅ 컴플라이언스 기준 내에서 안전하게 집행 가능한 문구입니다.</span>}
                {resp.summary}
              </p>
            </div>

            {/* Diagnostic Details & Citation Box */}
            {((resp.flaggedTerms && resp.flaggedTerms.length > 0) || resp.alternative) && (
              <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-2xl p-4 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                
                {resp.flaggedTerms && resp.flaggedTerms.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-[#6B7280] mb-2 uppercase tracking-wide">📌 수정 대상 항목</p>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                       {resp.flaggedTerms.map((t, i) => (
                         <span key={i} className={`text-[12px] px-2 py-0.5 rounded border font-semibold ${
                           resp.risk === 'HIGH' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                         }`}>"{t}"</span>
                       ))}
                    </div>
                    <p className="text-[12px] text-[#4B5563]">해당 키워드는 심의 기준에 어긋납니다. 관련 규정과 선례를 확인하세요.</p>
                    
                    {resp.citations && resp.citations.length > 0 && (
                      <div className="grid grid-cols-1 gap-2 mt-3">
                         {resp.citations.map((c, i) => <CitationCard key={i} citation={c} onClick={onCitationClick} />)}
                      </div>
                    )}
                  </div>
                )}

                {resp.alternative && (
                  <div className={`pt-4 border-t border-[#E5E7EB] ${resp.flaggedTerms?.length ? '' : 'pt-0 border-t-0'}`}>
                    <p className="text-[10px] font-bold text-[#6B7280] mb-2 uppercase tracking-wide">💡 대체 문구 제안</p>
                    <div className="bg-white border border-[#E5E7EB] rounded-xl p-3">
                      <p className="text-[13.5px] font-bold text-[#111827] mb-1 leading-snug">"{resp.alternative}"</p>
                      {resp.alternativeNote && <p className="text-[11px] text-[#9CA3AF] mt-1">{resp.alternativeNote}</p>}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function ChatReviewView() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedCitation, setSelectedCitation] = useState(null)
  
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)
  const heroTextareaRef = useRef(null)
  const processingRef = useRef(false)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const submit = useCallback(async (text) => {
    const t = text.trim()
    if (!t || processingRef.current) return
    processingRef.current = true
    setIsProcessing(true)
    setMessages(p => [...p, { role: 'user', content: t }])
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    if (heroTextareaRef.current) heroTextareaRef.current.style.height = 'auto'

    await delay(400)
    setMessages(p => [...p, { role: 'typing' }])
    await delay(600)

    const steps = CHAT_STEPS
    setMessages(p => { const n = [...p]; n[n.length - 1] = { role: 'agent', payload: t, steps, visibleSteps: 0, resp: null }; return n })
    for (let i = 1; i <= steps.length; i++) {
      await delay(750)
      setMessages(p => { const n = [...p]; n[n.length - 1] = { ...n[n.length - 1], visibleSteps: i }; return n })
    }
    await delay(400)
    const resp = buildChatResponse(t)
    setMessages(p => { const n = [...p]; n[n.length - 1] = { ...n[n.length - 1], resp }; return n })
    processingRef.current = false
    setIsProcessing(false)
  }, [])

  const isEmpty = messages.length === 0

  // ── 빈 상태: 히어로 레이아웃 ──────────────────────────────────────────────
  if (isEmpty) {
    return (
      <div className="flex flex-col flex-1 min-h-0 bg-[#FAFAFA]">
        <div className="flex flex-col flex-1 items-center justify-center px-8 pb-8">
          {/* 로고 + 타이틀 */}
          <div className="w-14 h-14 bg-[#111827] rounded-2xl flex items-center justify-center mb-5 shadow-lg">
            <ShieldCheck size={24} className="text-[#FEE500]" strokeWidth={2.5} />
          </div>
          <h1 className="text-[26px] font-bold text-[#111827] mb-2 tracking-tight">광고 문구를 검토하세요</h1>
          <p className="text-sm text-[#9CA3AF] text-center mb-8 leading-relaxed">
            기획 단계에서 자율적으로 규정 위반 여부를 점검하세요.<br />
            법무 공식 요청 전 AI와의 대화로 셀프 교정이 가능합니다.
          </p>

          {/* 히어로 입력창 */}
          <div className="w-full max-w-2xl mb-6">
            <div className="relative group">
              <textarea
                ref={heroTextareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(input) } }}
                placeholder="광고 문구를 입력하세요... (예: 수익률 200% 보장! 지금 당장 가입하세요)"
                rows={1}
                className="w-full bg-white border border-[#E5E7EB] rounded-2xl pl-5 pr-14 py-4 text-[15px] text-[#111827] outline-none focus:border-[#FEE500] focus:ring-4 focus:ring-[#FEE500]/10 shadow-sm resize-none transition-all placeholder:text-[#C4C4C4] leading-relaxed"
                style={{ minHeight: '56px' }}
                onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px' }}
              />
              <button
                onClick={() => submit(input)}
                disabled={!input.trim() || isProcessing}
                className={`absolute right-3 top-3 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  input.trim() && !isProcessing
                    ? 'bg-[#FEE500] text-[#111827] hover:bg-yellow-400 shadow-sm'
                    : 'bg-[#F3F4F6] text-[#C4C4C4] cursor-not-allowed'
                }`}
              >
                <ArrowUp size={15} strokeWidth={2.5} />
              </button>
            </div>
  
          </div>

          {/* 예시 카드 6개 */}
          <div className="w-full max-w-2xl grid grid-cols-2 gap-2.5">
            {CHAT_EXAMPLES.map((ex) => (
              <button
                key={ex.text}
                onClick={() => submit(ex.text)}
                className="flex items-start gap-3 text-left bg-white border border-[#E5E7EB] rounded-xl px-4 py-3.5 hover:border-[#FEE500]/60 hover:shadow-sm transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                      ex.risk === 'HIGH'   ? 'bg-red-50 text-red-600 border-red-200' :
                      ex.risk === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                             'bg-emerald-50 text-emerald-600 border-emerald-200'
                    }`}>{ex.risk}</span>
                    <span className="text-[10px] font-semibold text-[#9CA3AF]">{ex.tag}</span>
                  </div>
                  <p className="text-sm text-[#374151] leading-snug">{ex.text}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ── 채팅 상태: 입력창 하단 ────────────────────────────────────────────────
  return (
    <div className="flex flex-1 min-h-0 bg-white overflow-hidden">
      
      {/* 1. Chat Area (Left) */}
      <div className={`flex flex-col h-full min-w-0 transition-all duration-300 ease-in-out ${selectedCitation ? 'w-1/2 border-r border-[#E5E7EB]' : 'w-full'}`}>
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#F3F4F6] flex-shrink-0">
          <div>
            <h1 className="text-sm font-bold text-[#111827]">AI 사전검토</h1>
            <p className="text-[11px] text-[#9CA3AF]">광고 문구를 입력하면 규정 위반 여부와 수정 가이드를 즉시 제공합니다</p>
          </div>
          <button
            onClick={() => { setMessages([]); setIsProcessing(false); setSelectedCitation(null); processingRef.current = false }}
            className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB] px-3 py-1.5 rounded-lg transition-colors"
          >
            <RotateCcw size={11}/> 새 대화
          </button>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-4xl mx-auto px-6 pt-6 pb-4">
            {messages.map((msg, i) => {
              if (msg.role === 'user') return (
                <div key={i} className="flex justify-end mb-5 w-full">
                  <div className="max-w-[85%] bg-[#111827] text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                </div>
              )
              if (msg.role === 'typing') return <TypingBubble key={i} />
              if (msg.role === 'agent') return (
                <ResultBubble key={i} payload={msg.payload} resp={msg.resp} steps={msg.steps} visibleSteps={msg.visibleSteps} onCitationClick={setSelectedCitation} />
              )
              return null
            })}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* 입력창 */}
        <div className="flex-shrink-0 px-6 pb-5 pt-3 border-t border-[#F3F4F6]">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-3 bg-[#F9FAFB] rounded-2xl px-4 py-3 border border-[#E5E7EB] focus-within:border-[#FEE500]/50 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#FEE500]/10 transition-all shadow-sm">
            <button className="flex-shrink-0 text-[#D1D5DB] hover:text-[#9CA3AF] transition-colors mb-0.5">
              <ImagePlus size={15} />
            </button>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(input) } }}
              placeholder="광고 문구를 입력하세요..."
              rows={1}
              className="flex-1 bg-transparent text-sm text-[#111827] resize-none outline-none placeholder:text-[#C4C4C4] leading-relaxed max-h-32"
              style={{ minHeight: '22px' }}
              onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px' }}
            />
            <button
              onClick={() => submit(input)}
              disabled={!input.trim() || isProcessing}
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                input.trim() && !isProcessing
                  ? 'bg-[#FEE500] text-[#111827] hover:bg-yellow-400 shadow-sm'
                  : 'bg-[#F3F4F6] text-[#C4C4C4] cursor-not-allowed'
              }`}
            >
              <ArrowUp size={13} strokeWidth={2.5} />
            </button>
          </div>
          <p className="text-center text-[11px] text-[#C4C4C4] mt-2">AI는 참고용입니다. 최종 승인 권한은 법무/컴플라이언스팀에 있습니다.</p>
        </div>
      </div>
      </div> {/* ← MISSING Left Panel Closing Tag added here */}

      {/* 2. Source Viewer Area (Right Panel) */}
      {selectedCitation && (
        <div className="flex flex-col w-1/2 h-full bg-[#323639] border-l border-[#202124] flex-shrink-0 transform transition-transform duration-300 ease-in-out">
          
          {/* PDF Viewer Standard Top Bar */}
          <div className="h-[46px] bg-[#323639] border-b border-[#202124] flex items-center justify-between px-4 shrink-0 shadow-sm z-10 box-border">
            <div className="flex items-center gap-5">
              <button className="text-[#F1F3F4] hover:bg-white/10 p-1.5 rounded transition-colors"><Menu size={16}/></button>
              <div className="flex items-center gap-2 text-[#F1F3F4] text-[13px] font-bold font-sans tracking-wide">
                <span>{selectedCitation.source || selectedCitation.caseId || '내부 규정 문서'}</span>
              </div>
              <div className="flex items-center bg-[#202124] px-3 py-1 rounded text-[#F1F3F4] text-[12px] shadow-inner border border-[#111]">
                <span className="font-mono">3 / 14</span>
              </div>
              <div className="flex items-center gap-3 ml-2">
                <button className="text-[#A8B0B9] hover:text-white hover:bg-white/10 p-1 rounded transition-colors"><Minus size={14}/></button>
                <span className="text-[#F1F3F4] text-[12px] font-mono min-w-[32px] text-center">82%</span>
                <button className="text-[#A8B0B9] hover:text-white hover:bg-white/10 p-1 rounded transition-colors"><Plus size={14}/></button>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="text-[#A8B0B9] hover:text-white hover:bg-white/10 p-1.5 rounded transition-colors" onClick={() => setSelectedCitation(null)}>
                <X size={18} strokeWidth={2.5}/>
              </button>
            </div>
          </div>

          {/* PDF Scroll Content Area */}
          <div className="flex-1 overflow-y-auto bg-[#525659] p-8 flex flex-col items-center shadow-inner relative">

            {/* The Document Page Card */}
            <div className="w-[500px] bg-white shadow-2xl flex flex-col pt-12 pb-20 px-12 text-[#374151] font-sans mx-auto">

              {/* 정책 문서 (자본시장법 / 금소법 / 심의 기준) */}
              {selectedCitation.type === 'policy' && (
                <>
                  <div className="flex justify-between border-b pb-2 mb-8 border-[#E5E7EB]">
                    <span className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-widest">
                      사내 컴플라이언스 기준<br/>
                      <span className="text-[#D1D5DB] font-normal">{selectedCitation.source || '광고 심의 기준 v2.1'}</span>
                    </span>
                    <span className="text-[10px] text-[#111827] font-bold">카카오페이증권</span>
                  </div>
                  <h2 className="text-[15px] font-black text-[#111827] mb-1">{selectedCitation.title}</h2>
                  <p className="text-[11px] text-[#9CA3AF] mb-6">{selectedCitation.desc}</p>
                  <div className="space-y-4 text-[12px] leading-relaxed">
                    <p className="text-[#6B7280]">금융투자업자가 금융투자상품에 관한 광고를 하는 경우 다음 각 호의 사항을 준수하여야 한다.</p>
                    <div className="pl-4 border-l-2 border-[#E5E7EB] text-[#6B7280] space-y-2">
                      <p>① 투자자의 합리적 판단에 영향을 미칠 수 있는 중요 사항을 누락하거나 왜곡하여서는 아니 된다.</p>
                      <p>② 미래의 수익률을 단정적으로 보장하거나 오인하게 할 우려가 있는 표현을 사용하여서는 아니 된다.</p>
                    </div>
                    <div className="bg-[#FEF08A] px-3 py-2 rounded border border-yellow-300 mt-4">
                      <p className="text-[12px] font-bold text-[#111827]">
                        {selectedCitation.detail}
                      </p>
                    </div>
                    <p className="text-[#6B7280]">③ 과거의 운용실적을 표시하는 경우 미래의 수익률과 혼동될 수 있는 표현을 사용하여서는 아니 된다.</p>
                    <p className="text-[#6B7280]">④ 손실보전 또는 이익보장이 되는 것으로 오인하게 할 수 있는 표현을 사용하여서는 아니 된다.</p>
                  </div>
                </>
              )}

              {/* 반려 선례 */}
              {selectedCitation.type === 'rejected' && (
                <>
                  <div className="flex justify-between border-b pb-2 mb-8 border-[#E5E7EB]">
                    <span className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-widest">
                      반려 심의 기록<br/>
                      <span className="text-[#D1D5DB] font-normal">{selectedCitation.caseId}</span>
                    </span>
                    <span className="text-[10px] text-red-500 font-bold">REJECTED</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200">반려</span>
                    <h2 className="text-[14px] font-black text-[#111827]">{selectedCitation.title}</h2>
                  </div>
                  <p className="text-[11px] text-[#9CA3AF] mb-6">{selectedCitation.desc}</p>
                  <div className="space-y-4 text-[12px] leading-relaxed">
                    <div className="grid grid-cols-2 gap-2 bg-[#F9FAFB] rounded-lg p-3 border border-[#E5E7EB] text-[11px]">
                      <div><span className="text-[#9CA3AF]">처리일자</span><p className="font-bold text-[#374151]">{selectedCitation.date}</p></div>
                      <div><span className="text-[#9CA3AF]">처리 담당자</span><p className="font-bold text-[#374151]">{selectedCitation.approver}</p></div>
                      <div><span className="text-[#9CA3AF]">케이스 ID</span><p className="font-bold font-mono text-[#374151]">{selectedCitation.caseId}</p></div>
                      <div><span className="text-[#9CA3AF]">결정</span><p className="font-bold text-red-600">반려</p></div>
                    </div>
                    <div className="bg-[#FEF08A] px-3 py-2 rounded border border-yellow-300">
                      <p className="text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">반려 사유 (하이라이트)</p>
                      <p className="text-[12px] font-bold text-[#111827]">{selectedCitation.detail}</p>
                    </div>
                    <p className="text-[11px] text-[#9CA3AF] mt-2">본 케이스는 향후 유사 소재 심의 시 반려 선례로 적용됩니다.</p>
                  </div>
                </>
              )}

              {/* 승인 선례 */}
              {selectedCitation.type === 'approved' && (
                <>
                  <div className="flex justify-between border-b pb-2 mb-8 border-[#E5E7EB]">
                    <span className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-widest">
                      승인 심의 기록<br/>
                      <span className="text-[#D1D5DB] font-normal">{selectedCitation.caseId}</span>
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold">APPROVED</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">승인</span>
                    <h2 className="text-[14px] font-black text-[#111827]">{selectedCitation.title}</h2>
                  </div>
                  <p className="text-[11px] text-[#9CA3AF] mb-6">{selectedCitation.desc}</p>
                  <div className="space-y-4 text-[12px] leading-relaxed">
                    <div className="grid grid-cols-2 gap-2 bg-[#F9FAFB] rounded-lg p-3 border border-[#E5E7EB] text-[11px]">
                      <div><span className="text-[#9CA3AF]">승인일자</span><p className="font-bold text-[#374151]">{selectedCitation.date}</p></div>
                      <div><span className="text-[#9CA3AF]">승인 담당자</span><p className="font-bold text-[#374151]">{selectedCitation.approver}</p></div>
                      <div><span className="text-[#9CA3AF]">케이스 ID</span><p className="font-bold font-mono text-[#374151]">{selectedCitation.caseId}</p></div>
                      <div><span className="text-[#9CA3AF]">결정</span><p className="font-bold text-emerald-600">승인</p></div>
                    </div>
                    <div className="bg-[#FEF08A] px-3 py-2 rounded border border-yellow-300">
                      <p className="text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase">승인 근거 (하이라이트)</p>
                      <p className="text-[12px] font-bold text-[#111827]">{selectedCitation.detail}</p>
                    </div>
                    <p className="text-[11px] text-[#9CA3AF] mt-2">본 케이스는 향후 유사 소재 심의 시 승인 선례로 적용됩니다.</p>
                  </div>
                </>
              )}

            </div>

            <p className="fixed bottom-3 right-6 text-[10px] text-[#A8B0B9] opacity-50">출처: {selectedCitation.source || selectedCitation.caseId || '내부 문서'}</p>
          </div>

        </div>
      )}

    </div>
  )
}
