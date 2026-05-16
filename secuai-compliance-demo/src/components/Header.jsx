import { Bell, User } from 'lucide-react'

export default function Header({ pendingCount }) {
  return (
    <header className="h-14 bg-white flex items-center justify-between px-6 flex-shrink-0 border-b border-[#E8E8E8] z-10">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-[#FEE500] rounded-lg flex items-center justify-center">
          <span className="text-[#191919] text-[11px] font-black tracking-tight">KP</span>
        </div>
        <span className="font-bold text-[#191919] text-sm tracking-tight">Internal Platform</span>
        <span className="text-xs text-[#BBBBBB] font-normal ml-0.5">카카오페이증권</span>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative text-[#9CA3AF] hover:text-[#191919] transition-colors p-1">
          <Bell size={17} />
          {pendingCount > 0 && (
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#FEE500] rounded-full flex items-center justify-center text-[#191919] text-[9px] font-black">
              {pendingCount}
            </span>
          )}
        </button>
        <div className="h-4 w-px bg-[#E8E8E8]" />
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-7 h-7 bg-[#F3F4F6] rounded-full flex items-center justify-center group-hover:bg-[#FEE500]/20 transition-colors">
            <User size={14} className="text-[#6B7280]" />
          </div>
          <span className="text-sm text-[#374151] font-medium">홍길동</span>
        </div>
      </div>
    </header>
  )
}
