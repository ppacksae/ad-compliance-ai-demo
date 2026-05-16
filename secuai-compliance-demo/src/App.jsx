import { useState, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import ChatReviewView from './components/ChatReviewView'
import MaterialSubmitView from './components/MaterialSubmitView'
import MyProgressView from './components/MyProgressView'
import ComplianceDashboard from './components/ComplianceDashboard'
import CompletionHistoryView from './components/CompletionHistoryView'
import ProcessingStatsView from './components/ProcessingStatsView'

export default function App() {
  const [activeMenu, setActiveMenu] = useState('chat')
  const [menuKey, setMenuKey] = useState(0)
  const [pendingCount, setPendingCount] = useState(4)
  const [extraDashItems, setExtraDashItems] = useState([])
  const [editPayload, setEditPayload] = useState(null)

  const handleSendToDashboard = useCallback((banner) => {
    if (!banner) return
    setExtraDashItems(p => {
      if (p.find(i => i.id === banner.id)) return p
      return [...p, banner]
    })
    setPendingCount(p => p + 1)
  }, [])

  const handlePendingCountChange = useCallback((count) => {
    setPendingCount(count)
  }, [])

  const handleMenuSelect = useCallback((menu, payload = null) => {
    setMenuKey(k => k + 1)
    setEditPayload(payload)
    setActiveMenu(menu)
  }, [])

  return (
    <div className="flex h-screen bg-white font-pretendard overflow-hidden">
      <Sidebar
        activeMenu={activeMenu}
        onMenuSelect={handleMenuSelect}
        pendingCount={pendingCount}
      />
      <main className="flex flex-1 min-w-0 min-h-0 overflow-hidden">
        {activeMenu === 'chat'     && <ChatReviewView key={menuKey} />}
        {activeMenu === 'submit'   && <MaterialSubmitView key={menuKey} onSendToDashboard={handleSendToDashboard} initialBanner={editPayload} />}
        {activeMenu === 'progress' && <MyProgressView key={menuKey} onNavigate={handleMenuSelect} />}
        {activeMenu === 'pending'  && (
          <ComplianceDashboard
            key={menuKey}
            extraItems={extraDashItems}
            onPendingCountChange={handlePendingCountChange}
          />
        )}
        {activeMenu === 'history'  && <CompletionHistoryView key={menuKey} />}
        {activeMenu === 'stats'    && <ProcessingStatsView key={menuKey} />}
      </main>
    </div>
  )
}
