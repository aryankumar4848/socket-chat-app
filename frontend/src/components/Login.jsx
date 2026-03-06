import { useState } from "react"
import { socket } from "../socket"

function Login({ setUsername, setGroupChat, isOverlay, onClose, existingUsername }) {
	const [textInput, setTextInput] = useState(existingUsername || "")
	const [groupInput, setGroupInput] = useState("")

	const handleSubmit = () => {
		if (!existingUsername && !textInput) return;
		if (!groupInput) return;

		if (!existingUsername) {
			setUsername(textInput);
		}
		setGroupChat(groupInput);
	}

	const containerClasses = isOverlay
		? "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
		: "flex items-center justify-center h-screen w-screen bg-[#020617] p-4";

	return (
		<div className={containerClasses}>
			<div className="glass-card w-full max-w-md rounded-3xl p-8 space-y-8 relative overflow-hidden">
				{/* Decorative background blur */}
				<div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl"></div>
				<div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-600/20 rounded-full blur-3xl"></div>

				{isOverlay && (
					<button
						onClick={onClose}
						className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M18 6L6 18M6 6l12 12" />
						</svg>
					</button>
				)}

				<div className="text-center relative">
					<div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-teal-400 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
						<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
							<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
						</svg>
					</div>
					<h1 className="text-3xl font-bold brand-font text-white">{isOverlay ? 'Join Room' : 'SubSpace Chat'}</h1>
					<p className="text-slate-400 text-sm mt-2">{isOverlay ? 'Enter a room name to join the conversation' : 'Enter your details to start collaborating'}</p>
				</div>

				<div className="space-y-4 relative">
					{!existingUsername && (
						<div className="space-y-2">
							<label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">Your Identity</label>
							<input
								placeholder="Display Name"
								value={textInput}
								onChange={(e) => setTextInput(e.target.value)}
								className="w-full h-14 glass-input rounded-2xl px-6 text-white focus:outline-none placeholder:text-slate-500"
								autoFocus
							/>
						</div>
					)}

					<div className="space-y-2">
						<label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">Chat Room</label>
						<input
							placeholder="e.g. Finance Hub"
							value={groupInput}
							onChange={(e) => setGroupInput(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
							className="w-full h-14 glass-input rounded-2xl px-6 text-white focus:outline-none placeholder:text-slate-500"
							autoFocus={!!existingUsername}
						/>
					</div>

					<button
						className="w-full h-14 subspace-button rounded-2xl text-white font-bold text-lg mt-4 shadow-xl shadow-indigo-500/10"
						onClick={handleSubmit}
					>
						{isOverlay ? 'Join Chat' : 'Get Started'}
					</button>

					{!isOverlay && (
						<p className="text-[10px] text-center text-slate-500 mt-6 px-4">
							By joining, you agree to SubSpace's terms of service and professional conduct guidelines.
						</p>
					)}
				</div>
			</div>
		</div>
	)
}

export default Login
