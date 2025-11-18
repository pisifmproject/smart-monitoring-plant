import { io } from "socket.io-client";

export const socket = io("http://localhost:2000", {
  path: "/socket.io",
  transports: ["websocket"],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 500,
});

socket.on("connect", () => console.log("[WS] connected:", socket.id));
socket.on("disconnect", (r) => console.log("[WS] disconnected:", r));
socket.on("connect_error", (err) => console.error("[WS] connect_error:", err.message));
