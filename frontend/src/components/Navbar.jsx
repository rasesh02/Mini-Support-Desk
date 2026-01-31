import { NavLink } from 'react-router-dom'

function Navbar({ isDark, onToggleTheme }) {
	return (
		<header className="sticky top-0 z-10 border-b border-white/20 bg-gradient-to-r from-violet-300 via-violet-400 to-violet-500 text-white shadow-lg shadow-violet-300/30 backdrop-blur dark:border-slate-800 dark:bg-none dark:bg-slate-950 dark:text-slate-100 dark:shadow-none">
			<div className="w-full px-4 py-4 sm:px-6">
				<div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 text-white font-semibold shadow-lg shadow-white/10 ring-1 ring-white/30">
							MSD
						</div>
						<div>
							<h1 className="text-lg font-semibold">Mini Support Desk</h1>
							<p className="text-sm text-white/70">Track issues, resolve faster</p>
						</div>
					</div>
					<div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
						<button
							type="button"
							onClick={onToggleTheme}
							className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/15 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/25"
						>
							{isDark ? 'Light mode' : 'Dark mode'}
						</button>
						<nav className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
						<NavLink
							to="/"
							end
							className={({ isActive }) =>
								`rounded-full px-4 py-2 text-sm font-medium transition text-center ${
									isActive
										? 'bg-white/25 text-white shadow'
										: 'text-white/80 hover:bg-white/15'
								}`
							}
						>
							Tickets
						</NavLink>
						<NavLink
							to="/tickets/new"
							className={({ isActive }) =>
								`rounded-full px-4 py-2 text-sm font-medium transition text-center ${
									isActive
										? 'bg-white/25 text-white shadow'
										: 'text-white/80 hover:bg-white/15'
								}`
							}
						>
							Create Ticket
						</NavLink>
						</nav>
					</div>
				</div>
			</div>
		</header>
	)
}

export default Navbar
