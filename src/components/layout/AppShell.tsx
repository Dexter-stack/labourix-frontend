import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import NotificationToast from '@/components/ui/NotificationToast'
import SuspendedModal from '@/components/ui/SuspendedModal'
import { useEcho } from '@/hooks/useEcho'

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  useEcho()

  return (
    <div className="flex h-dvh bg-[var(--bg)]">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar onMenuOpen={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <NotificationToast />
      <SuspendedModal />
    </div>
  )
}
