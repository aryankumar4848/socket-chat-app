# SubSpace — Real-Time Messaging Workspace

SubSpace is a full-stack real-time chat application built with the MERN stack and Socket.io. The project focuses on low-latency communication, efficient database queries, and responsive user interfaces. It demonstrates real-time messaging architecture, frontend performance optimizations, and scalable backend design.

---

## Features

- **Real-time messaging** using Socket.io for bidirectional communication between clients and the server.
- **Optimistic UI updates** so messages appear instantly on the client before server confirmation.
- **Typing indicators** implemented with debounced events to reduce unnecessary network traffic.
- **Multi-room chat support** allowing users to join different chat rooms with persistent message history.
- **Optimized database queries** using compound indexing for faster message retrieval.
- **Responsive UI** built with React and Tailwind CSS.

---

## Tech Stack

**Frontend**
- React (Hooks)
- Vite
- Tailwind CSS

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB Atlas
- Mongoose

**Real-time communication**
- Socket.io

---

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas connection string

---

### Installation

Clone the repository:

```bash
git clone https://github.com/aryankumar4848/socket-chat-app.git
cd socket-chat-app
