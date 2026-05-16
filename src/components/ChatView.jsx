import { useRef, useEffect, useState } from 'react'
import { ArrowUp, ChevronLeft } from 'lucide-react'
import MessageBubble from './MessageBubble'

export default function ChatView({ messages, onSend, onAction, onDateSelect, isProcessing, onBack }) {
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const submit = () => {
    const text = input.trim()
    if (!text || isProcessing) return
    onSend(text)
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-white">
      {/* 채팅 상단 바 */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-[#F0F0F0] flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-[#9CA3AF] hover:text-[#374151] transition-colors"
        >
          <ChevronLeft size={16} />
          <span>홈</span>
        </button>
        <span className="text-[#E8E8E8]">/</span>
        <span className="text-sm font-medium text-[#374151]">AI Chat</span>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-2xl mx-auto px-6 pt-6 pb-4">
          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              message={msg}
              onAction={(id, type) => onAction(id, type, i)}
              onDateSelect={(opt) => onDateSelect(opt, i)}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* 입력창 */}
      <div className="flex-shrink-0 px-6 pb-5 pt-3 border-t border-[#F0F0F0]">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-3 bg-[#F9F9F9] rounded-2xl px-4 py-3 border border-[#E8E8E8] focus-within:border-[#FEE500]/50 focus-within:bg-white focus-within:shadow-sm transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="업무 요청을 입력하세요..."
              rows={1}
              className="flex-1 bg-transparent text-sm text-[#191919] resize-none outline-none placeholder:text-[#C4C4C4] leading-relaxed max-h-32"
              style={{ minHeight: '22px' }}
              onInput={(e) => {
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
              }}
            />
            <button
              onClick={submit}
              disabled={!input.trim() || isProcessing}
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                input.trim() && !isProcessing
                  ? 'bg-[#FEE500] text-[#191919] hover:bg-yellow-300'
                  : 'bg-[#F0F0F0] text-[#C4C4C4] cursor-not-allowed'
              }`}
            >
              <ArrowUp size={14} strokeWidth={2.5} />
            </button>
          </div>
          <p className="text-center text-xs text-[#D1D5DB] mt-2">Enter 전송 · Shift+Enter 줄바꿈</p>
        </div>
      </div>
    </div>
  )
}

// Shared input — used by PlatformView
export function ChatInput({ input, setInput, onSend, onKeyDown, isProcessing, textareaRef, placeholder }) {
  return (
    <div className="flex-shrink-0 px-6 pb-5 pt-3 bg-white border-t border-[#F0F0F0]">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-3 bg-[#F9F9F9] rounded-2xl px-4 py-3 border border-[#E8E8E8] focus-within:border-[#FEE500]/50 focus-within:bg-white transition-all">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder || '업무 요청을 입력하세요...'}
            rows={1}
            className="flex-1 bg-transparent text-sm text-[#191919] resize-none outline-none placeholder:text-[#C4C4C4] leading-relaxed max-h-32"
            style={{ minHeight: '22px' }}
            onInput={(e) => {
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
            }}
          />
          <button
            onClick={onSend}
            disabled={!input.trim() || isProcessing}
            className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
              input.trim() && !isProcessing
                ? 'bg-[#FEE500] text-[#191919] hover:bg-yellow-300'
                : 'bg-[#F0F0F0] text-[#C4C4C4] cursor-not-allowed'
            }`}
          >
            <ArrowUp size={14} strokeWidth={2.5} />
          </button>
        </div>
        <p className="text-center text-xs text-[#D1D5DB] mt-2">Enter 전송 · Shift+Enter 줄바꿈</p>
      </div>
    </div>
  )
}
