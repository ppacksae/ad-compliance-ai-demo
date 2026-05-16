import { useRef, useEffect, useState } from 'react'
import { ArrowUp, ChevronLeft, X, FileText, Link2, ChevronRight } from 'lucide-react'
import ToolFlowBlock from './ToolFlowBlock'
import ActionButtons from './ActionButtons'

// ── 시뮬레이션된 출처 문서 뷰어 ───────────────────────────────────────────────
function SourcePanel({ source, onClose }) {
  if (!source) return null
  return (
    <div className="w-[380px] flex-shrink-0 bg-white border-l border-[#F0F0F0] flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
        <div className="flex items-center gap-2 min-w-0">
          <FileText size={14} className="text-[#9CA3AF] flex-shrink-0" />
          <p className="text-sm font-semibold text-[#374151] truncate">{source.docTitle}</p>
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#374151] transition-colors flex-shrink-0 ml-2">
          <X size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
        {/* 문서 메타 */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-[11px] bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded-full">{source.category}</span>
          <span className="text-[11px] text-[#C4C4C4]">최종 수정 {source.updatedAt}</span>
          <span className="text-[11px] text-[#C4C4C4]">· {source.author}</span>
        </div>
        {/* 관련 섹션 하이라이트 */}
        <div className="bg-[#FFFDE7]/60 border border-[#FEE500]/30 rounded-xl p-4 mb-4">
          <p className="text-[11px] font-semibold text-[#92400E] mb-2 uppercase tracking-wider">관련 구절</p>
          <p className="text-sm text-[#374151] leading-relaxed">{source.highlight}</p>
        </div>
        {/* 문서 본문 미리보기 */}
        <div className="space-y-3">
          {source.sections.map((sec, i) => (
            <div key={i}>
              <p className="text-xs font-bold text-[#374151] mb-1">{sec.title}</p>
              <p className="text-xs text-[#6B7280] leading-relaxed">{sec.body}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="px-5 py-3 border-t border-[#F0F0F0]">
        <button className="flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-[#374151] transition-colors">
          <Link2 size={12} />원본 문서 바로가기<ChevronRight size={11} />
        </button>
      </div>
    </div>
  )
}

// ── 메시지 버블 ────────────────────────────────────────────────────────────────
function formatAnswer(text) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('[') && line.endsWith(']')) {
      return <p key={i} className="text-[11px] font-semibold text-[#9CA3AF] uppercase tracking-wider mt-3 mb-1">{line.slice(1, -1)}</p>
    }
    if (line === '') return <div key={i} className="h-1.5" />
    return <p key={i} className="text-sm leading-relaxed text-[#374151]">{line}</p>
  })
}

function DateOptions({ options, onSelect, selected }) {
  if (selected) return null
  return (
    <div className="mt-4 pt-3 border-t border-[#F3F4F6]">
      <p className="text-xs text-[#9CA3AF] mb-2.5">날짜를 선택하거나 직접 입력하세요</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => (
          <button key={opt.id} onClick={() => onSelect(opt)}
            className="text-left border border-[#E8E8E8] rounded-xl px-3.5 py-3 hover:border-[#FEE500] hover:bg-[#FEE500]/5 transition-all group">
            <p className="text-sm font-medium text-[#374151]">{opt.label}</p>
            {opt.sub && <p className="text-xs text-[#9CA3AF] mt-0.5">{opt.sub}</p>}
          </button>
        ))}
      </div>
    </div>
  )
}

function Bubble({ message, onAction, onDateSelect, onSourceOpen }) {
  const { role, content, steps, visibleSteps, buttons, actionsDisabled, dateOptions, dateSelected, sources } = message

  if (role === 'typing') return (
    <div className="flex items-start gap-3 mb-5">
      <Avatar />
      <div className="bg-white border border-[#E8E8E8] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1.5 items-center h-5">
          <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
        </div>
      </div>
    </div>
  )
  if (role === 'system') return (
    <div className="flex justify-center mb-4">
      <p className="text-xs text-[#9CA3AF] bg-[#F9F9F9] border border-[#E8E8E8] px-4 py-1.5 rounded-full">{content}</p>
    </div>
  )
  if (role === 'user') return (
    <div className="flex justify-end mb-5">
      <div className="max-w-[72%] bg-[#191919] text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm leading-relaxed">{content}</div>
    </div>
  )
  return (
    <div className="flex items-start gap-3 mb-5">
      <Avatar />
      <div className="flex-1 max-w-[90%]">
        {steps && steps.length > 0 && <ToolFlowBlock steps={steps} visibleCount={visibleSteps ?? steps.length} />}
        {content && (
          <div className="bg-white border border-[#E8E8E8] rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm">
            <div>{formatAnswer(content)}</div>
            {/* 출처 문서 칩 */}
            {sources && sources.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[#F3F4F6]">
                <p className="text-[11px] text-[#9CA3AF] mb-2">출처 문서</p>
                <div className="flex flex-wrap gap-2">
                  {sources.map((src, i) => (
                    <button key={i} onClick={() => onSourceOpen(src)}
                      className="flex items-center gap-1.5 text-xs border border-[#E8E8E8] bg-[#FAFAFA] rounded-lg px-3 py-1.5 hover:border-[#FEE500]/60 hover:bg-[#FFFDE7]/40 transition-all">
                      <FileText size={11} className="text-[#9CA3AF]" />
                      <span className="text-[#374151] font-medium">{src.docTitle}</span>
                      <ChevronRight size={10} className="text-[#C4C4C4]" />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {dateOptions && <DateOptions options={dateOptions} onSelect={onDateSelect} selected={dateSelected} />}
            {buttons && buttons.length > 0 && <ActionButtons buttons={buttons} onAction={onAction} disabled={actionsDisabled} />}
          </div>
        )}
      </div>
    </div>
  )
}

function Avatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-[#FEE500] flex items-center justify-center flex-shrink-0 mt-0.5">
      <span className="text-[10px] font-black text-[#191919]">AI</span>
    </div>
  )
}

// ── 예시 검색 카드 ─────────────────────────────────────────────────────────────
const EXAMPLES = [
  { text: '연차 사용 규정이 어떻게 돼요?',  tag: '인사규정', icon: '📋' },
  { text: '재택근무 신청 방법 알려줘',       tag: '사내 정책', icon: '🏠' },
  { text: '경조사 휴가는 며칠이에요?',       tag: '인사규정', icon: '📅' },
  { text: 'VDB 스토리지 증설 결재 요청해줘', tag: '업무지원', icon: '🗄️' },
  { text: 'k8s EOL 현황 확인해줘',          tag: '인프라', icon: '⚙️' },
  { text: '출산휴가 관련 규정 찾아줘',       tag: '인사규정', icon: '👶' },
]

export default function SearchChatView({ messages, onSend, onAction, onDateSelect, isProcessing, onBack }) {
  const [input, setInput] = useState('')
  const [source, setSource] = useState(null)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)
  const isEmpty = messages.length === 0

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const submit = () => {
    const t = input.trim(); if (!t || isProcessing) return
    onSend(t); setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() } }

  const handleExample = (text) => { onSend(text) }

  return (
    <div className="flex flex-1 min-h-0 min-w-0">
      {/* 메인 채팅 영역 */}
      <div className="flex flex-col flex-1 min-h-0 bg-white">
        {/* 상단 바 */}
        <div className="flex items-center gap-3 px-6 py-3 border-b border-[#F0F0F0] flex-shrink-0">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-[#9CA3AF] hover:text-[#374151] transition-colors">
            <ChevronLeft size={15} />홈
          </button>
          <span className="text-[#E8E8E8]">/</span>
          <span className="text-sm font-semibold text-[#374151]">AI Chat</span>
          <span className="text-[11px] bg-[#F3F4F6] text-[#6B7280] px-2 py-0.5 rounded-full ml-1">사내 위키 · 인사 · 인프라</span>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full pb-12 px-6">
              <div className="w-11 h-11 bg-[#FEE500] rounded-2xl flex items-center justify-center mb-4">
                <span className="text-base font-black text-[#191919]">AI</span>
              </div>
              <h2 className="text-[20px] font-bold text-[#191919] mb-2">무엇이든 검색하세요</h2>
              <p className="text-sm text-[#9CA3AF] text-center mb-8 leading-relaxed">
                사내 위키, 인사 규정, 인프라 현황 등<br />궁금한 내용을 자연어로 물어보세요
              </p>
              <div className="grid grid-cols-2 gap-2.5 w-full max-w-lg">
                {EXAMPLES.map((ex) => (
                  <button key={ex.text} onClick={() => handleExample(ex.text)}
                    className="flex items-start gap-3 text-left bg-white border border-[#E8E8E8] rounded-xl px-4 py-3.5 hover:border-[#FEE500]/60 hover:shadow-sm transition-all group">
                    <span className="text-lg flex-shrink-0">{ex.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-[#9CA3AF] mb-0.5">{ex.tag}</p>
                      <p className="text-sm text-[#374151] leading-snug">{ex.text}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto px-6 pt-6 pb-4">
              {messages.map((msg, i) => (
                <Bubble key={i} message={msg}
                  onAction={(id, type) => onAction(id, type, i)}
                  onDateSelect={(opt) => onDateSelect(opt, i)}
                  onSourceOpen={setSource}
                />
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* 입력창 */}
        <div className="flex-shrink-0 px-6 pb-5 pt-3 border-t border-[#F0F0F0]">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-end gap-3 bg-[#F9F9F9] rounded-2xl px-4 py-3 border border-[#E8E8E8] focus-within:border-[#FEE500]/50 focus-within:bg-white transition-all shadow-sm">
              <textarea ref={textareaRef} value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="사내 문서, 인사 규정, 인프라 현황 등 무엇이든 질문하세요..."
                rows={1}
                className="flex-1 bg-transparent text-sm text-[#191919] resize-none outline-none placeholder:text-[#C4C4C4] leading-relaxed max-h-32"
                style={{ minHeight: '22px' }}
                onInput={(e) => {
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
                }}
              />
              <button onClick={submit} disabled={!input.trim() || isProcessing}
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  input.trim() && !isProcessing ? 'bg-[#FEE500] text-[#191919] hover:bg-yellow-300' : 'bg-[#F0F0F0] text-[#C4C4C4] cursor-not-allowed'
                }`}><ArrowUp size={14} strokeWidth={2.5} /></button>
            </div>
            <p className="text-center text-xs text-[#D1D5DB] mt-2">Enter 전송 · Shift+Enter 줄바꿈</p>
          </div>
        </div>
      </div>

      {/* 출처 패널 */}
      <div className={`flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${source ? 'w-[380px]' : 'w-0'}`}>
        {source && <SourcePanel source={source} onClose={() => setSource(null)} />}
      </div>
    </div>
  )
}
