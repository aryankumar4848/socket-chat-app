import { useEffect, useState, useCallback } from "react"
import { socket } from "./socket"

import Login from "./components/Login"
import ChatInput from "./components/ChatInput"
import ChatBody from "./components/ChatBody"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"

function App() {
	const [username, setUsername] = useState(() => localStorage.getItem("subspace_user") || "")
	const [messages, setMessages] = useState({})
	const [joinedRooms, setJoinedRooms] = useState(() => {
		try {
			return JSON.parse(localStorage.getItem("subspace_rooms")) || []
		} catch { return [] }
	})
	const [currentRoom, setCurrentRoom] = useState("")
	const [isAddingRoom, setIsAddingRoom] = useState(false)

	// Persist state changes
	useEffect(() => {
		localStorage.setItem("subspace_user", username);
	}, [username]);

	useEffect(() => {
		localStorage.setItem("subspace_rooms", JSON.stringify(joinedRooms));
	}, [joinedRooms]);

	// Auto-rejoin rooms on mount if username exists
	useEffect(() => {
		if (username && joinedRooms.length > 0) {
			joinedRooms.forEach(room => {
				socket.emit('join', room);
			});
		}
	}, [username]); // Only run when username is set or on mount

	const addRoom = useCallback((roomName) => {
		if (!roomName) return;
		if (!joinedRooms.includes(roomName)) {
			setJoinedRooms(prev => [...prev, roomName]);
			socket.emit('join', roomName);
			// Add welcome message
			setMessages(prev => {
				const newMessages = {
					...prev,
					[roomName]: [{
						name: "SubSpace Concierge",
						message: `Welcome to ${roomName}! How can I assist you today?`,
						time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
						isSystem: true
					}]
				};
				return newMessages;
			});
		}
		setCurrentRoom(roomName);
		setIsAddingRoom(false);
	}, [joinedRooms]);

	useEffect(() => {
		const handleMessage = (message) => {
			const room = message.groupChatName;
			setMessages(prev => {
				const roomMessages = prev[room] || [];

				// If message has clientId, check if we have an optimistic version
				if (message.clientId) {
					const existingIndex = roomMessages.findIndex(m => m.clientId === message.clientId && m.isOptimistic);
					if (existingIndex !== -1) {
						// Replace optimistic message with server version
						const updatedMessages = [...roomMessages];
						updatedMessages[existingIndex] = { ...message, name: "Me", isOptimistic: false };
						return { ...prev, [room]: updatedMessages };
					}
				}

				// Otherwise, just append (it's from someone else or no clientId)
				return {
					...prev,
					[room]: [...roomMessages, {
						...message,
						time: message.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
					}]
				};
			});
		};

		const handleHistory = ({ room, history }) => {
			setMessages(prev => ({
				...prev,
				[room]: history.map(msg => ({
					...msg,
					name: msg.name === username ? "Me" : msg.name
				}))
			}));
		};

		socket.on("receive_message", handleMessage);
		socket.on("message_history", handleHistory);

		return () => {
			socket.off("receive_message", handleMessage);
			socket.off("message_history", handleHistory);
		};
	}, [username]);

	const handleLogout = () => {
		setUsername("");
		setJoinedRooms([]);
		setCurrentRoom("");
		setMessages({});
		localStorage.removeItem("subspace_user");
		localStorage.removeItem("subspace_rooms");
		localStorage.removeItem("subspace_messages");
	};

	if (!username) {
		return <Login setUsername={setUsername} setGroupChat={addRoom} />
	}

	return (
		<div className="flex h-screen w-full overflow-hidden bg-[#020617]">
			<Sidebar
				joinedRooms={joinedRooms}
				currentRoom={currentRoom}
				onRoomSelect={setCurrentRoom}
				onJoinNew={() => setIsAddingRoom(true)}
				username={username}
			/>

			<main className="flex-1 flex flex-col min-w-0 bg-white/5 backdrop-blur-md relative">
				{currentRoom ? (
					<>
						<Header
							username={username}
							onLogout={handleLogout}
							groupChat={currentRoom}
						/>
						<ChatBody
							messages={messages[currentRoom] || []}
						/>
						<ChatInput
							uname={username}
							onMessageSent={(newMsg) => {
								const room = currentRoom;
								setMessages(prev => {
									const roomMessages = prev[room] || [];
									return {
										...prev,
										[room]: [...roomMessages, {
											...newMsg,
											name: "Me",
											time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
										}]
									};
								});
							}}
							groupChat={currentRoom}
						/>
					</>
				) : (
					<div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-60">
						<div className="w-24 h-24 rounded-full bg-indigo-600/20 flex items-center justify-center mb-6">
							<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5">
								<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
							</svg>
						</div>
						<h2 className="text-2xl font-bold brand-font mb-2">Select a Conversation</h2>
						<p className="max-w-xs text-sm">Pick a room from the sidebar or create a new one to start chatting with your SubSpace community.</p>
					</div>
				)}

				{isAddingRoom && (
					<Login
						isOverlay={true}
						setUsername={() => { }} // Name already set
						setGroupChat={addRoom}
						onClose={() => setIsAddingRoom(false)}
						existingUsername={username}
					/>
				)}
			</main>
		</div>
	)
}

export default App
