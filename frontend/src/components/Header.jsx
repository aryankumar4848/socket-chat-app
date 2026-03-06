function Header({ username, onLogout, groupChat }) {
	return (
		<div className="h-20 glass border-b border-white/10 px-8 flex items-center justify-between z-10">
			<div className="flex items-center gap-4">
				<div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 brand-font shadow-inner">
					#
				</div>
				<div>
					<h1 className="text-lg font-bold text-white brand-font tracking-tight">{groupChat}</h1>
					<div className="flex items-center gap-2">
						<span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
						<p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest leading-none">Live Connection</p>
					</div>
				</div>
			</div>

			<div className="flex items-center gap-6">
				<div className="hidden md:flex flex-col items-end">
					<p className="text-xs text-slate-400 font-medium uppercase tracking-widest mb-0.5">Logged in as</p>
					<p className="font-bold text-sm text-white">{username}</p>
				</div>

				<div className="w-px h-8 bg-white/10 mx-2"></div>

				<button
					className="p-3 bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 rounded-xl transition-all duration-200 text-slate-400 hover:text-rose-400 group"
					onClick={onLogout}
					title="Disconnect"
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
						<polyline points="16 17 21 12 16 7" />
						<line x1="21" y1="12" x2="9" y2="12" />
					</svg>
				</button>
			</div>
		</div>
	)
}

export default Header
