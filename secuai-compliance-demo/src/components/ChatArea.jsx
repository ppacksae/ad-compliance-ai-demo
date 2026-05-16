import { useRef, useEffect, useState } from 'react'
import MessageBubble from './MessageBubble'

export default function ChatArea({ messages, onSend, onAction, isProcessing }) {
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    const text = input.trim()
    if (!text || isProcessing) return
    onSend(text)
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickActions = [
    { label: '🏖️ 휴가 신청', text: '연차 휴가 3일 신청하고 싶어요' },
    { label: '☸️ k8s EOL 확인', text: 'k8s EOL 현황 확인해줘' },
    { label: '💾 VDB 용량 점검', text: 'VDB 스토리지 현황 알려줘' },
  ]

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-4">
        {isEmpty && (
          <div className="flex flex-col items-center justify-center h-full text-center pb-8">
            <div className="w-16 h-16 bg-kakao-yellow rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <span className="text-3xl">🤖</span>
            </div>
            <h2 className="text-xl font-bold text-kakao-textPrimary mb-2">
              안녕하세요, 홍길동님!
            </h2>
            <p className="text-kakao-textSecondary text-sm mb-6 max-w-sm leading-relaxed">
              카카오페이 Internal Platform AI Agent입니다.<br />
              전자결재, 인프라 점검, 스토리지 관련 업무를 도와드릴게요.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {quickActions.map((qa) => (
                <button
                  key={qa.label}
                  onClick={() => onSend(qa.text)}
                  className="bg-white border border-kakao-border text-kakao-textPrimary text-sm px-4 py-2 rounded-xl hover:bg-kakao-yellow hover:border-kakao-yellow transition-colors font-medium shadow-sm"
                >
                  {qa.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} onAction={(id, type) => onAction(id, type, i)} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 입력 영역 */}
      <div className="flex-shrink-0 px-6 py-4 bg-white border-t border-kakao-border">
        <div className="flex items-end gap-3 bg-kakao-bg rounded-2xl px-4 py-3 border border-kakao-border focus-within:border-kakao-purple focus-within:ring-1 focus-within:ring-kakao-purple/30 transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="업무 요청을 입력하세요... (예: 연차 3일 신청, k8s EOL 확인)"
            rows={1}
            className="flex-1 bg-transparent text-sm text-kakao-textPrimary resize-none outline-none placeholder:text-kakao-textSecondary leading-relaxed max-h-32 scrollbar-thin"
            style={{ minHeight: '22px' }}
            onInput={(e) => {
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
              input.trim() && !isProcessing
                ? 'bg-kakao-purple text-white hover:bg-purple-800'
                : 'bg-kakao-border text-kakao-textSecondary cursor-not-allowed'
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-kakao-textSecondary text-center mt-2">
          Enter로 전송 · Shift+Enter로 줄바꿈
        </p>
      </div>
    </div>
  )
}
