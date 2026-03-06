require("dotenv").config()
const express = require("express")
const { Server } = require("socket.io")
const http = require("http")
const cors = require("cors")
const mongoose = require("mongoose")
const Message = require("./models/Message")

const app = express()
app.use(cors())

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("MongoDB connection error:", err))

app.get("/", (req, res) => {
	res.send("Server Running")
})

const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
	}
})

io.on("connection", (socket) => {
	socket.on('join', async (room) => {
		socket.join(room);

		// Fetch last 50 messages from history
		try {
			const history = await Message.find({ groupChatName: room })
				.sort({ createdAt: 1 })
				.limit(50);
			socket.emit("message_history", { room, history });
		} catch (err) {
			console.error("Error fetching history:", err);
		}
	})

	socket.on("send_message", async (data) => {
		// Save to MongoDB
		try {
			const newMessage = new Message({
				...data,
				time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
			});
			const savedMessage = await newMessage.save();

			// Broadcast to everyone in the room (including sender to confirm)
			io.to(data.groupChatName).emit("receive_message", savedMessage);
		} catch (err) {
			console.error("Error saving message:", err);
		}
	})

	socket.on("start_typing", (data) => {
		socket.to(data.room).emit("is_typing", data)
	})

	socket.on("stop_typing", (data) => {
		socket.to(data.room).emit("not_typing", data)
	})
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
	console.log(`Running on port ${PORT}`)
})
