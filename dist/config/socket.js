"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketServer = void 0;
const SocketServer = (socket) => {
    socket.on("joinRoom", (id) => {
        socket.join(id);
        console.log({ joinRoom: socket.adapter.rooms });
    });
    socket.on("outRoom", (id) => {
        socket.join(id);
        console.log({ outRoom: socket.adapter.rooms });
    });
    socket.on("disconnect", () => {
        console.log(socket.id + " disconnected");
    });
};
exports.SocketServer = SocketServer;
