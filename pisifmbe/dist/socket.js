"use strict";
// //===============================//
// //// socket.ts
// import { Server } from "socket.io";
// import type { Server as HttpServer } from "http";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomFor = void 0;
exports.initSocket = initSocket;
exports.io = io;
// let _io: Server | undefined;
// export const roomFor = (nameOrId: string | number) => `lvmdp:${nameOrId}`;
// export function initSocket(server: HttpServer) {
//   _io = new Server(server, {
//     cors: { origin: ["http://localhost:5173"], credentials: true },
//     path: "/socket.io",
//   });
//   _io.on("connection", (s) => {
//     console.log("socket connected:", s.id);
//     // client meminta bergabung ke mesin tertentu
//     s.on("lvmdp:join", ({ id }: { id: string | number }) => {
//       const room = roomFor(id);
//       s.join(room);
//       s.emit("lvmdp:joined", { room });
//       console.log(`[WS] ${s.id} joined ${room}`);
//     });
//     s.on("lvmdp:leave", ({ id }: { id: string | number }) => {
//       const room = roomFor(id);
//       s.leave(room);
//       s.emit("lvmdp:left", { room });
//       console.log(`[WS] ${s.id} left ${room}`);
//     });
//   });
//   return _io;
// }
// export function io() {
//   if (!_io) throw new Error("Socket.IO not initialized");
//   return _io;
// }
//===============================//
//// socket.ts
const socket_io_1 = require("socket.io");
let _io;
const roomFor = (nameOrId) => `lvmdp:${nameOrId}`;
exports.roomFor = roomFor;
function initSocket(server) {
    _io = new socket_io_1.Server(server, {
        cors: { origin: ["http://localhost:5173"], credentials: true },
        path: "/socket.io",
    });
    _io.on("connection", (s) => {
        console.log("socket connected:", s.id);
        // client meminta bergabung ke mesin tertentu
        s.on("lvmdp:join", ({ id }) => {
            const room = (0, exports.roomFor)(id);
            s.join(room);
            s.emit("lvmdp:joined", { room });
            console.log(`[WS] ${s.id} joined ${room}`);
        });
        s.on("lvmdp:leave", ({ id }) => {
            const room = (0, exports.roomFor)(id);
            s.leave(room);
            s.emit("lvmdp:left", { room });
            console.log(`[WS] ${s.id} left ${room}`);
        });
    });
    return _io;
}
function io() {
    if (!_io)
        throw new Error("Socket.IO not initialized");
    return _io;
}
