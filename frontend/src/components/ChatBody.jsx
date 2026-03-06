import ScrollToBottom from "react-scroll-to-bottom"

function ChatBody({ messages }) {
	return (
		<ScrollToBottom className="flex-1 w-full p-6 space-y-6">
			<div className="flex flex-col gap-6 pb-4">
				{messages.map((i, index) => {
					const isSystem = i.isSystem;
					const isMe = i.name === "Me";

					if (isSystem) {
						return (
							<div key={index} className="flex justify-center items-center py-4 px-2">
								<div className="glass px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/5">
									<p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em]">
										{i.message}
									</p>
								</div>
							</div>
						)
					}

					return (
						<div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] ${isMe ? 'ml-auto' : 'mr-auto'} group`}>
							<div className="flex items-center gap-2 mb-1.5 px-1">
								{!isMe && (
									<div className="w-5 h-5 rounded-md bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-[8px] font-bold text-teal-400">
										{i.name[0].toUpperCase()}
									</div>
								)}
								<span className={`text-[10px] font-bold uppercase tracking-wider ${isMe ? 'text-indigo-400' : 'text-teal-400'}`}>
									{isMe ? 'You' : i.name}
								</span>
								<span className="text-[9px] text-slate-500 font-medium">
									{i.time || "Just now"}
								</span>
							</div>

							<div className={`px-5 py-3.5 rounded-2xl shadow-sm relative transition-all duration-200 ${isMe
								? 'bg-indigo-600/90 text-white rounded-tr-none'
								: 'glass text-slate-100 rounded-tl-none border border-white/5'
								} ${i.isOptimistic ? 'opacity-70 animate-pulse' : 'opacity-100'}`}>
								<p className="text-sm leading-relaxed">{i.message}</p>

								{/* Optimistic/Confirmed Indicator */}
								{isMe && (
									<div className="absolute bottom-1 right-2 flex items-center gap-1">
										{i.isOptimistic ? (
											<div className="w-2 h-2 rounded-full border border-white/40 border-t-transparent animate-spin"></div>
										) : (
											<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/60">
												<path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										)}
									</div>
								)}

								{/* Subtle hover effect */}
								<div className={`absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-${isMe ? 'tr' : 'tl'}-none`}></div>
							</div>
						</div>
					)
				})}
			</div>
		</ScrollToBottom>
	)
}

export default ChatBody
