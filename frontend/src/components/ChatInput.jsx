import { useState, useRef, useEffect } from "react"
import { socket } from "../socket"

function ChatInput({ uname, onMessageSent, groupChat }) {
	const [textInput, setTextInput] = useState("")
	const [isTyping, setIsTyping] = useState(false)
	const typingTimeoutRef = useRef(null)

	const handleSend = async () => {
		if (textInput.trim()) {
			const clientId = Date.now().toString() + Math.random().toString(36).substring(2);
			const messageData = {
				message: textInput,
				name: uname,
				groupChatName: groupChat,
				clientId: clientId
			};

			// Optimistic update
			onMessageSent({ ...messageData, isOptimistic: true });

			await socket.emit("send_message", messageData);
			setTextInput("");

			// Clear typing immediately on send
			socket.emit("stop_typing", { room: groupChat, name: uname });
			if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
			setIsTyping(false);
		}
	}

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			handleSend();
		} else if (e.key !== "Shift") {
			// Debounced Typing logic
			if (!isTyping) {
				setIsTyping(true);
				// Debounce the start_typing event by 500ms to avoid flooding
				setTimeout(() => {
					socket.emit("start_typing", { room: groupChat, name: uname });
				}, 500);
			}

			if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

			typingTimeoutRef.current = setTimeout(() => {
				setIsTyping(false);
				socket.emit("stop_typing", { room: groupChat, name: uname });
			}, 3000);
		}
	}

	return (
		<div className="p-6 bg-[#020617]/40 backdrop-blur-xl border-t border-white/10">
			<div className="max-w-4xl mx-auto flex items-end gap-3 glass p-1.5 rounded-[22px] border border-white/10 group-focus-within:border-indigo-500/50 group-focus-within:shadow-[0_0_20px_rgba(79,70,229,0.1)] transition-all">
				<div className="flex-1 flex items-center p-2">
					<textarea
						className="w-full max-h-32 bg-transparent text-slate-100 focus:outline-none resize-none px-3 py-1.5 text-sm placeholder:text-slate-500"
						placeholder={`Message #${groupChat}...`}
						onChange={(e) => setTextInput(e.target.value)}
						onKeyDown={handleKeyDown}
						value={textInput}
						rows="1"
						autoFocus
					/>
				</div>

				<button
					className={`h-11 w-11 flex items-center justify-center rounded-xl transition-all duration-300 ${textInput.trim()
						? 'subspace-button text-white shadow-lg shadow-indigo-500/20 scale-100'
						: 'bg-white/5 text-slate-600 scale-95 opacity-50 cursor-not-allowed'
						}`}
					onClick={handleSend}
					disabled={!textInput.trim()}
				>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M5 12L4.39589 6.56299C4.22297 5.0067 5.82469 3.86433 7.23983 4.53465L19.1842 10.1925C20.7093 10.9149 20.7093 13.0851 19.1842 13.8075L7.23983 19.4653C5.82469 20.1357 4.22297 18.9933 4.39589 17.437L5 12ZM5 12H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</button>
			</div>

			<p className="text-[9px] text-center text-slate-600 mt-3 font-medium uppercase tracking-[0.2em]">
				Encrypted Peer-to-Peer Transmission
			</p>
		</div>
	)
}

export default ChatInput
