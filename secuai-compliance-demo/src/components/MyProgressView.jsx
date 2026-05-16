import { useState } from 'react'
import { Clock, CheckCircle2, AlertCircle, Search, Filter, X, User, Link2, ArrowRight, MessageSquare, RotateCcw, Upload, Image as ImageIcon } from 'lucide-react'
import BannerPreview from './BannerPreview'
import RiskBadge from './RiskBadge'
import { MY_PROGRESS_ITEMS, BANNERS, EXTRA_BANNERS, COMPLETION_HISTORY } from '../data/complianceData'

// 상태 분류 및 색상 설정 (색상 단순화)
const STATUS_CFG = {
  review:   { label: 'In Progress',     color: 'bg-gray-100 text-[#374151]' },
  ai_done:  { label: 'In Progress',     color: 'bg-gray-100 text-[#374151]' },
  approved: { label: 'Completed',       color: 'bg-gray-100 text-[#374151]' },
  revision: { label: 'Revision Requested', color: 'bg-amber-50 text-amber-700 border border-amber-200' },
  rejected: { label: 'Rejected',        color: 'bg-red-50 text-red-700 border border-red-200' },
  pending:  { label: 'Pending',         color: 'bg-gray-100 text-[#374151]' },
}

const ACTION_NEEDED = ['revision', 'rejected']
const IN_PROGRESS   = ['review', 'ai_done']
const DONE          = ['approved']

function formatTicketId(ticket) {
  return `T-${String(ticket.id).slice(-4).padStart(4, '0')}`;
}

// --- Ticket Panel Component ---
function TicketDetailPanel({ ticket, banner, onClose, onNavigate }) {
  if (!ticket) return null;

  const isCompleted = DONE.includes(ticket.statusType);
  const isRevision = ticket.statusType === 'revision';
  const isRejected = ticket.statusType === 'rejected';
  
  const isActionNeeded = ACTION_NEEDED.includes(ticket.statusType);
  const statusCfg = STATUS_CFG[ticket.statusType] || STATUS_CFG.pending;

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-pretendard">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] transition-opacity" onClick={onClose}></div>
      
      {/* Slide Panel */}
      <div className="relative w-[480px] h-full bg-white shadow-2xl flex flex-col border-l border-[#F0F0F0] animate-in slide-in-from-right duration-300 ease-out">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E8E8E8] flex justify-between items-start bg-[#FAFAFA]">
          <div className="pr-4">
            <span className="text-sm font-bold font-mono text-[#9CA3AF] mb-1.5 block">
              {formatTicketId(ticket)}
            </span>
            <h2 className="text-[18px] font-bold text-[#191919] leading-snug">{ticket.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 -mr-2 hover:bg-[#E8E8E8] rounded-xl text-[#9CA3AF] hover:text-[#191919] transition-colors"><X size={18} /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white scrollbar-thin">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-y-5 gap-x-4 bg-[#FAFAFA] p-4 rounded-xl border border-[#F0F0F0]">
            <div>
              <span className="text-[#9CA3AF] block font-bold mb-1.5 text-[10px] uppercase tracking-wider">법무 담당자</span>
              <span className="text-[#374151] text-[13px] font-bold flex items-center gap-1.5"><User size={14} className="text-[#C4C4C4]"/> {ticket.legalManager || '미배정'}</span>
            </div>
            <div>
              <span className="text-[#9CA3AF] block font-bold mb-1.5 text-[10px] uppercase tracking-wider">Current Status</span>
              <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-bold leading-none ${statusCfg.color}`}>{statusCfg.label}</span>
            </div>
            <div>
              <span className="text-[#9CA3AF] block font-bold mb-1.5 text-[10px] uppercase tracking-wider">Created At</span>
              <span className="text-[#374151] font-mono text-[13px] font-bold">{ticket.submittedAt}</span>
            </div>
            <div>
              <span className="text-[#9CA3AF] block font-bold mb-1.5 text-[10px] uppercase tracking-wider">AI Risk</span>
              <RiskBadge level={ticket.aiRisk} size="xs" className="inline-block" />
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-[14px] font-bold text-[#191919] mb-5 flex items-center gap-2"><ArrowRight size={14} className="text-[#191919]"/> Workflow Pipeline</h3>
            <div className="relative pl-4 border-l-[2px] border-[#E8E8E8] space-y-6 ml-1">
              <div className="relative">
                <span className="absolute -left-[21px] top-[3px] w-2.5 h-2.5 rounded-full bg-[#191919] ring-4 ring-white"></span>
                <p className="text-[14px] font-bold text-[#191919] mb-1 leading-none">기안 상신 (소재 제출)</p>
                <p className="text-[11px] text-[#9CA3AF] font-mono tracking-tight">{ticket.submittedAt}</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-[3px] w-2.5 h-2.5 rounded-full bg-[#191919] ring-4 ring-white"></span>
                <p className="text-[14px] font-bold text-[#191919] mb-1 leading-none">Agent AI 정책 사전 검토</p>
                <p className="text-[11px] text-[#9CA3AF] font-mono tracking-tight">AI 진단 완료</p>
              </div>
              <div className="relative">
                <span className={`absolute -left-[21px] top-[3px] w-2.5 h-2.5 rounded-full ring-4 ring-white ${isCompleted ? 'bg-[#191919]' : isActionNeeded ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-[#FEE500] shadow-[0_0_8px_rgba(254,229,0,0.8)]'}`}></span>
                <p className={`text-[14px] font-bold mb-1 leading-none ${isActionNeeded ? 'text-red-600' : 'text-[#191919]'}`}>{isActionNeeded ? '법무 진단 결과 - 조치 필요' : '법무 담당자 리뷰 진행중'}</p>
                <p className="text-[11px] text-[#9CA3AF] font-mono tracking-tight">{isCompleted || isActionNeeded ? '법무 진단 완료' : '진행중...'}</p>
              </div>
              {isCompleted && (
                <div className="relative">
                  <span className="absolute -left-[21px] top-[3px] w-2.5 h-2.5 rounded-full bg-[#191919] ring-4 ring-white"></span>
                  <p className="text-[14px] font-bold text-[#191919] mb-1 leading-none">
                    {ticket.statusType === 'approved' ? '승인 완료 (Approved)' : '처리 완료'}
                  </p>
                  <p className="text-[11px] text-[#9CA3AF] font-mono tracking-tight">{ticket.elapsed === '완료' ? ticket.submittedAt : ticket.elapsed}</p>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="pt-2 border-t border-[#F0F0F0]">
            <h3 className="text-[14px] font-bold text-[#191919] mb-4 flex items-center gap-2"><MessageSquare size={14} className="text-[#9CA3AF]"/> Comments</h3>
            <div className="space-y-4">
              {/* Legal Comment (승인/반려/수정 모두 법무 코멘트가 있을 수 있음) */}
              <div className={`rounded-xl p-4 border ${isActionNeeded ? 'bg-red-50 border-red-200' : 'bg-[#FAFAFA] border-[#E8E8E8]'}`}>
                 <div className="flex items-center gap-2 mb-2">
                   <div className="w-5 h-5 rounded bg-white border border-[#E8E8E8] flex items-center justify-center text-[#6B7280]"><User size={12}/></div>
                   <span className="text-sm font-bold text-[#374151]">{ticket.legalManager || '미배정'}</span>
                   <span className={`text-[11px] font-bold ml-auto px-1.5 py-0.5 rounded ${isActionNeeded ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-[#374151]'}`}>
                     {ticket.statusType === 'revision' ? '수정 요청' : ticket.statusType === 'rejected' ? '반려' : ticket.statusType === 'approved' ? '승인 완료' : '검토 중'}
                   </span>
                 </div>
                 <p className={`text-[14px] font-medium leading-relaxed mt-2 ${ticket.legalComment ? 'text-[#191919]' : 'text-[#9CA3AF] italic'}`}>
                   {ticket.legalComment ? `"${ticket.legalComment}"` : "법무팀의 심의 코멘트가 등록되지 않았습니다 (검토 진행 중)."}
                 </p>
              </div>

              {/* Dynamic Bottom Actions based on state */}
              {isRevision && (
                <button onClick={() => { onNavigate('submit', banner); onClose() }} className="w-full mt-4 bg-[#191919] flex items-center justify-center gap-2 text-white px-3 py-3 rounded-xl text-[14px] font-bold hover:bg-black transition-colors">
                  <RotateCcw size={16}/> 수정하기 (소재 제출 메뉴로 이동)
                </button>
              )}
              {isRejected && (
                <button onClick={onClose} className="w-full mt-4 bg-[#191919] flex items-center justify-center gap-2 text-white px-3 py-3 rounded-xl text-[14px] font-bold hover:bg-black transition-colors">
                  반려 확인
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function MyProgressView({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedTicket, setSelectedTicket] = useState(null)

  const BANNER_MAP = Object.fromEntries([...BANNERS, ...EXTRA_BANNERS].map(b => [b.id, b]))
  const selectedBanner = selectedTicket ? BANNER_MAP[selectedTicket.bannerId] : null

  const mappedHistoryItems = COMPLETION_HISTORY.map(h => ({
    id: h.id,
    name: h.name,
    submittedAt: h.resolvedAt,
    status: h.legalResult === '승인' ? '승인완료' : h.legalResult === '수정요청' ? '수정 요청' : '반려',
    statusType: h.legalResult === '승인' ? 'approved' : h.legalResult === '수정요청' ? 'revision' : 'rejected',
    aiRisk: h.aiRisk,
    legalManager: h.legalManager,
    elapsed: '완료',
    bannerId: 'dummy_' + h.id,
    legalComment: h.legalComment || h.flywheelNote || '처리 완료된 항목입니다.'
  }))

  const finalItems = [...MY_PROGRESS_ITEMS, ...mappedHistoryItems]

  const actionCount   = finalItems.filter(i => ACTION_NEEDED.includes(i.statusType)).length
  const progressCount = finalItems.filter(i => IN_PROGRESS.includes(i.statusType)).length
  const completedCount = finalItems.filter(i => DONE.includes(i.statusType)).length

  // 데이터 분기
  const allItems = finalItems.map(i => ({...i, isActionNeeded: ACTION_NEEDED.includes(i.statusType)}))
  
  // 분리형 레이아웃을 위한 Action Needed 큐
  const actionItems = allItems.filter(i => i.isActionNeeded)
  
  // 일반 테이블용 아이템
  const displayItems = allItems.filter(i => {
    if (activeTab === 'all') return !i.isActionNeeded // 전체에서는 action items 제외 (상단에 분리되므로) -> 원할 경우 전부 보여줘도 됨. 일단 다 보여주는 걸로 하되 상단 분리. Wait, 사용자 요청이 "조치가 필요한건 따로 리스트/영역 구분" 이므로, action items도 하단에 보일지 여부를 결정해야 함. 중복을 피하기 위해 하단 리스트는 전체를 다 보여주되 상단 강조로 하자.
    if (activeTab === 'pending') return IN_PROGRESS.includes(i.statusType)
    if (activeTab === 'completed') return DONE.includes(i.statusType)
    return true
  }).sort((a,b) => {
    const aPending = !DONE.includes(a.statusType) ? 0 : 1;
    const bPending = !DONE.includes(b.statusType) ? 0 : 1;
    return aPending - bPending;
  })

  // 통합심의데스크 형식의 액션 아이템 섹션 렌더링 (세련된 디자인으로 고도화)
  const renderActionItems = () => {
    if (actionItems.length === 0) return null
    return (
      <div className="mb-8">
        <div className="bg-white border border-[#E8E8E8] rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="px-6 py-4 border-b border-[#F0F0F0] flex justify-between items-center bg-white/50 backdrop-blur-sm">
            <h2 className="text-[15px] font-black text-[#191919] flex items-center gap-2">
              <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Action Required <span className="text-[#9CA3AF] font-medium text-[13px] ml-1">({actionItems.length})</span>
            </h2>
          </div>
          <div className="divide-y divide-[#F0F0F0]">
            {actionItems.map(ticket => {
              const cfg = STATUS_CFG[ticket.statusType]
              return (
                <div key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="group flex items-center justify-between p-5 hover:bg-[#FAFAFA] transition-all cursor-pointer border-l-[4px] border-l-red-500 bg-white relative">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] font-bold font-mono text-[#9CA3AF]">{formatTicketId(ticket)}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${cfg.color} shadow-sm`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-[15px] font-bold text-[#191919]">{ticket.name}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] font-bold text-[#9CA3AF] uppercase block mb-0.5 tracking-wider">법무 담당자</span>
                      <span className="text-[13px] font-bold text-[#374151]">{ticket.legalManager || '미배정'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-[#9CA3AF] uppercase block mb-0.5 tracking-wider">처리 상태</span>
                      <span className="text-[13px] font-bold font-mono text-[#EF4444]">{ticket.statusType === 'rejected' ? '기안 철회 필요' : '소재 수정 필요'}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-[#E8E8E8] group-hover:bg-[#191919] group-hover:border-[#191919] transition-colors shadow-sm ml-2">
                      <ArrowRight size={14} className="text-[#9CA3AF] group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 h-full bg-[#FAFAFA] font-pretendard relative">
      {/* Sliding Ticket Detail Panel */}
      <TicketDetailPanel ticket={selectedTicket} banner={selectedBanner} onClose={() => setSelectedTicket(null)} onNavigate={onNavigate} />
      
      {/* Top Header */}
      <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-[#F0F0F0]">
        <div>
          <h1 className="text-[22px] font-black text-[#191919]">통합 워크플로우 (My Board)</h1>
          <p className="text-[14px] text-[#6B7280] mt-1 font-medium">내가 생성한 마케팅 소재 심의 티켓 및 결재 현황을 확인합니다.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-[#E8E8E8] text-[#191919] px-4 py-2.5 rounded-xl text-[14px] font-bold hover:bg-[#F9F9F9] shadow-sm">
            <Filter size={16} /> Filter
          </button>
          <div className="bg-white border border-[#E8E8E8] rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-sm focus-within:border-[#191919] transition-colors">
            <Search size={16} className="text-[#9CA3AF]" />
            <input type="text" placeholder="Search tickets..." className="bg-transparent border-none outline-none text-[14px] text-[#191919] w-48 font-medium placeholder:text-[#C4C4C4]" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Action Items Area (Separated) */}
          {renderActionItems()}

          {/* General List Table */}
          <div className="bg-white border border-[#E8E8E8] rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-6 px-6 py-4 border-b border-[#F0F0F0] bg-[#FAFAFA]">
              {['all', 'pending', 'completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[14px] font-bold pb-4 -mb-[17px] border-b-[3px] transition-all px-1 outline-none ${
                    activeTab === tab ? 'text-[#191919] border-[#191919]' : 'text-[#9CA3AF] border-transparent hover:text-[#374151]'
                  }`}
                >
                  {tab === 'all' ? 'All Tickets' : tab === 'pending' ? `In Progress (${progressCount})` : `Completed (${completedCount})`}
                </button>
              ))}
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-[#F0F0F0] text-[12px] font-bold text-[#9CA3AF] uppercase tracking-wide">
                  <th className="px-6 py-4">Ticket ID</th>
                  <th className="px-6 py-4">AI Risk</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">법무 담당자</th>
                  <th className="px-6 py-4">Last Updated</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {displayItems.map((ticket, i) => {
                  const cfg = STATUS_CFG[ticket.statusType] || STATUS_CFG.pending;
                  
                  return (
                    <tr key={ticket.id} onClick={() => setSelectedTicket(ticket)} className="hover:bg-[#FAFAFA] transition-colors cursor-pointer">
                      <td className="px-6 py-4">
                        <span className="text-[15px] font-bold font-mono text-[#191919]">{formatTicketId(ticket)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <RiskBadge level={ticket.aiRisk} size="sm" />
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[15px] font-bold text-[#191919] truncate max-w-md">{ticket.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[14px] font-bold text-[#6B7280]">{ticket.legalManager || '미배정'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[14px] text-[#374151] font-bold font-mono">{ticket.submittedAt}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-bold ${cfg.color}`}>
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
                {displayItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-16">
                      <AlertCircle size={28} className="mx-auto text-[#D1D5DB] mb-3" />
                      <p className="text-[15px] font-bold text-[#9CA3AF]">조건에 일치하는 내역이 없습니다.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
