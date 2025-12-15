import http from "http";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";

import { createApp } from "./app";

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = createApp();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  // Sera étendu plus tard pour le chat (rooms, typing, etc.)
  console.log("New client connected", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});


