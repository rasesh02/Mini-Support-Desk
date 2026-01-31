import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar.jsx'
import TicketsLayout from './pages/TicketsLayout.jsx'
import TicketDetail from './pages/TicketDetail.jsx'
import CreateTicket from './pages/CreateTicket.jsx'

function App() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('msd-theme')
    if (stored) {
      setIsDark(stored === 'dark')
      return
    }
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    setIsDark(Boolean(prefersDark))
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('msd-theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('msd-theme', 'light')
    }
  }, [isDark])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-100 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 dark:text-slate-100">
      <Navbar isDark={isDark} onToggleTheme={() => setIsDark((prev) => !prev)} />

      <main className="w-full px-4 py-6 sm:px-6">
        <Routes>
          <Route path="/" element={<TicketsLayout />}>
            <Route
              index
              element={
                <div className="flex h-full min-h-[300px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
                  Select a ticket to view details.
                </div>
              }
            />
            <Route path="tickets/:id" element={<TicketDetail />} />
          </Route>
          <Route path="/tickets/new" element={<CreateTicket />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
