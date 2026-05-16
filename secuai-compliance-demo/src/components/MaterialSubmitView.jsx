import { useState, useCallback } from 'react'
import { Upload, RefreshCw, Send, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react'
import BannerPreview from './BannerPreview'
import AgentFlow from './AgentFlow'
import CitationCard from './CitationCard'
import RiskBadge from './RiskBadge'
import { BANNERS, BANNER_STEPS } from '../data/complianceData'

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }

export default function MaterialSubmitView({ onSendToDashboard, initialBanner }) {
  const [selected, setSelected] = useState(initialBanner ? initialBanner.id : 'bannerA')
  const [phase, setPhase] = useState(initialBanner ? 'result' : 'select')
  const [visibleSteps, setVisibleSteps] = useState(initialBanner ? BANNER_STEPS.length : 0)
  const [submitted, setSubmitted] = useState(false)

  const banner = BANNERS.find(b => b.id === selected) || initialBanner

  const startAnalysis = useCallback(async () => {
    if (!selected) return
    setPhase('analyzing')
    setVisibleSteps(0)
    for (let i = 1; i <= BANNER_STEPS.length; i++) {
      await delay(900)
      setVisibleSteps(i)
    }
    await delay(500)
    setPhase('result')
  }, [selected])

  const handleSendToDashboard = () => {
    setSubmitted(true)
    if (onSendToDashboard) onSendToDashboard(banner)
    setTimeout(() => { setSubmitted(false); setPhase('select'); setSelected('bannerA'); setVisibleSteps(0) }, 2000)
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[#F9FAFB]">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-[#E5E7EB] flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-[#111827]">소재 제출</h1>
          <p className="text-sm text-[#6B7280] mt-1">최종 배너 이미지를 업로드하면 AI 선검토가 자동 실행됩니다</p>
        </div>
        {phase !== 'select' && (
          <button onClick={() => { setPhase('select'); setSelected('bannerA'); setVisibleSteps(0) }}
            className="flex items-center gap-1.5 text-[13px] font-semibold text-[#6B7280] hover:text-[#111827] border border-[#E5E7EB] px-3.5 py-2 rounded-lg transition-colors">
            <RefreshCw size={14}/> 다시 선택
          </button>
        )}
      </div>

      {/* Phase: Select */}
      {phase === 'select' && (
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-4xl mx-auto px-8 py-8">

            {/* 섹션 타이틀 */}
            <div className="mb-6">
              <h2 className="text-base font-bold text-[#111827] mb-1">검토할 소재를 선택하세요</h2>
              <p className="text-sm text-[#9CA3AF]">실제 환경에서는 파일을 직접 업로드합니다. 데모에서는 아래 샘플 소재를 클릭해 선택해주세요.</p>
            </div>

            {/* 배너 카드 3개 */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {BANNERS.map(b => (
                <button
                  key={b.id}
                  onClick={() => setSelected(b.id)}
                  className={`rounded-2xl border-2 overflow-hidden text-left transition-all shadow-sm hover:shadow-md ${
                    selected === b.id
                      ? 'border-[#FEE500] ring-4 ring-[#FEE500]/20 shadow-md'
                      : 'border-[#E5E7EB] hover:border-[#C4C4C4]'
                  }`}
                >
                  <div className="h-28 overflow-hidden">
                    <BannerPreview colorScheme={b.colorScheme} />
                  </div>
                  <div className="px-4 py-3 bg-white border-t border-[#F3F4F6]">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-[#111827] truncate flex-1 mr-2">{b.name}</p>
                      <RiskBadge level={b.overallRisk} size="sm" />
                    </div>
                    <p className="text-[11px] text-[#9CA3AF]">{b.submitter} · {b.channel}</p>
                    {selected === b.id && (
                      <p className="text-[10px] font-bold text-[#92400E] mt-1.5">✓ 선택됨</p>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* 선택된 소재 메타 + 버튼 */}
            {banner && (
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex items-center gap-8 shadow-sm">
                <div className="flex-1 grid grid-cols-4 gap-4">
                  {[
                    ['제출자', banner.submitter],
                    ['집행 채널', banner.channel],
                    ['캠페인 기간', banner.period],
                    ['타겟', banner.target],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <p className="text-[10px] text-[#9CA3AF] mb-0.5 uppercase tracking-wide">{k}</p>
                      <p className="text-sm font-medium text-[#374151]">{v}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={startAnalysis}
                  className="flex-shrink-0 flex items-center gap-2 bg-[#111827] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#374151] transition-all shadow-sm"
                >
                  AI 선검토 시작 <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Phase: Analyzing + Result */}
      {(phase === 'analyzing' || phase === 'result') && banner && (
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex flex-1 min-h-0 divide-x divide-[#F3F4F6]">
            {/* 왼쪽: 원본 소재 */}
            <div className="w-[320px] flex-shrink-0 bg-white overflow-y-auto scrollbar-thin">
              <div className="px-5 py-4 border-b border-[#F3F4F6]">
                <p className="text-xs font-semibold text-[#374151]">원본 소재</p>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">{banner.name}</p>
              </div>
              <div className="p-4">
                <div className="rounded-xl overflow-hidden border border-[#E5E7EB] mb-4">
                  <BannerPreview colorScheme={banner.colorScheme} />
                </div>

                {/* 소재 정보 */}
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3 mb-3">
                  <div className="grid grid-cols-1 gap-1.5">
                    {[
                      ['제출자', banner.submitter],
                      ['집행 채널', banner.channel],
                      ['기간', banner.period],
                      ['타겟', banner.target],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between items-baseline">
                        <span className="text-[10px] text-[#9CA3AF]">{k}</span>
                        <span className="text-[11px] text-[#374151] font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* OCR 추출 */}
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">OCR 추출 텍스트</p>
                    {phase === 'analyzing' && visibleSteps < 1 && (
                      <span className="text-[10px] text-[#C4C4C4]">분석 중...</span>
                    )}
                  </div>
                  {(phase === 'result' || visibleSteps >= 1) && (
                    <div className="space-y-1.5">
                      {banner.ocrTexts.map((t, i) => (
                        <div key={i} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs border ${
                          t.flagged
                            ? 'bg-red-50 border-red-200 text-red-700'
                            : 'bg-white border-[#E5E7EB] text-[#374151]'
                        }`}>
                          {t.flagged
                            ? <AlertTriangle size={10} className="text-red-500 flex-shrink-0" />
                            : <CheckCircle2 size={10} className="text-emerald-500 flex-shrink-0" />}
                          {t.text}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 오른쪽: AI 결과 */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto scrollbar-thin">
              <div className="px-5 py-4 border-b border-[#F3F4F6] bg-white">
                <p className="text-xs font-semibold text-[#374151]">AI 선검토 결과</p>
              </div>
              <div className="p-5">
                <AgentFlow steps={BANNER_STEPS} visibleCount={visibleSteps} extractedTexts={banner?.ocrTexts} />

                {phase === 'result' && (
                  <div className="step-enter mt-1 space-y-4">
                    {/* Conversational Bubble Header */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 flex-shrink-0 bg-[#111827] rounded-full flex items-center justify-center mt-1">
                        <span className="text-[10px] font-black text-[#FEE500]">AI</span>
                      </div>
                      <div className="bg-white border border-[#E5E7EB] rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex-1">
                        <p className="text-[13.5px] text-[#374151] leading-relaxed break-keep">
                          {banner.overallRisk === 'HIGH' && <span className="font-bold text-red-600 mb-2 block">🚨 컴플라이언스 위반 리스크가 매우 높은 소재입니다.</span>}
                          {banner.overallRisk === 'MEDIUM' && <span className="font-bold text-amber-600 mb-2 block">⚠️ 컴플라이언스 기준 상 수정이 필요한 표현이 있습니다.</span>}
                          {banner.overallRisk === 'LOW' && <span className="font-bold text-emerald-600 mb-2 block">✅ 즉시 사용 가능한, 매우 안전한 소재입니다.</span>}
                          {banner.summary}
                        </p>
                      </div>
                    </div>

                    {/* Diagnostic Box - Issues List */}
                    {banner.issues.length > 0 && (
                      <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-5 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                        {banner.issues.map((issue, idx) => (
                          <div key={issue.id} className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm">
                            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#F3F4F6]">
                              <RiskBadge level={issue.level} size="sm" />
                              <span className="text-[13px] font-bold text-[#111827]">수정 권고 항목 {idx + 1}</span>
                              <span className="text-xs text-[#9CA3AF] ml-auto">{issue.rule}</span>
                            </div>
                            
                            <p className="text-[10px] font-bold text-[#6B7280] mb-2 uppercase tracking-wide">📌 대상 문구</p>
                            <div className="inline-flex items-center gap-1.5 mb-4">
                              <span className={`text-[13px] font-semibold px-2.5 py-1 rounded-md border ${
                                issue.level === 'HIGH' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>{issue.flaggedText}</span>
                            </div>
                            
                            <p className="text-[12px] text-[#4B5563] mb-3">해당 표현은 관련 심의 기준에 부합하지 않아 규정 위반 소지가 있습니다.</p>
                            <div className="space-y-2 mb-4">
                              {issue.citations.map((c, ci) => <CitationCard key={ci} citation={c} />)}
                            </div>

                            {issue.alternative && (
                              <div className="pt-4 border-t border-[#E3E3E3]">
                                <p className="text-[10px] font-bold text-[#6B7280] mb-2 uppercase tracking-wide">💡 대체 문구 제안</p>
                                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-4 py-3">
                                  <p className="text-[13.5px] font-bold text-[#111827] leading-snug">"{issue.alternative}"</p>
                                  {issue.alternativeNote && <p className="text-[11.5px] text-[#9CA3AF] mt-1.5">{issue.alternativeNote}</p>}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {banner.issues.length === 0 && (
                      <div className="bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <CheckCircle2 size={24} className="text-emerald-500" />
                        </div>
                        <p className="text-[15px] font-bold text-[#111827]">위반 항목 전혀 없음</p>
                        <p className="text-[12px] text-[#6B7280] mt-1.5">필수 고지 문구 포함이 확인되었습니다.<br/>법무 빠른 승인(Fast-track) 레인으로 전송됩니다.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          {phase === 'result' && (
            <div className="flex-shrink-0 bg-white border-t border-[#F3F4F6] px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-[11px] text-[#C4C4C4]">AI는 참고용입니다. 최종 승인 권한은 법무/컴플라이언스팀에 있습니다.</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setPhase('select'); setSelected('bannerA'); setVisibleSteps(0) }}
                    className="flex items-center gap-1.5 text-sm font-medium text-[#374151] border border-[#E5E7EB] px-4 py-2 rounded-xl hover:border-[#9CA3AF] transition-colors"
                  >
                    <RefreshCw size={12}/> 수정 후 재제출
                  </button>
                  <button
                    onClick={handleSendToDashboard}
                    disabled={submitted}
                    className={`flex items-center gap-1.5 text-sm font-semibold px-5 py-2 rounded-xl transition-all ${
                      submitted ? 'bg-emerald-600 text-white' : 'bg-[#111827] text-white hover:bg-[#374151]'
                    }`}
                  >
                    {submitted
                      ? <><CheckCircle2 size={13}/> 전송 완료</>
                      : <><Send size={13}/> 법무 검토 요청</>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
