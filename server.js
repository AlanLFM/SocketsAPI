const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
app.use(cors());

const server = http.createServer(app);

// SOCKETS
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Nuevo usuario conectado");

  socket.on("join", ({ roomId, userId }) => {
    socket.join(roomId);
    console.log(`Usuario con ID ${userId} se unió a la sala con ID ${roomId}`);
  });

  socket.on("leave", (roomId) => {
    console.log(`Usuario con ID ${socket.id} abandonó la sala con ID ${roomId}`);
    socket.leave(roomId);
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
    socket.rooms.forEach((roomId) => {
      socket.leave(roomId);
    });
  });
  

  socket.on("message", ({ roomId, message }) => {
    console.log("message event received:", { roomId, message });
    console.log(`Nuevo mensaje en la sala ${roomId}: ${JSON.stringify(message)}`);
    io.to(roomId).emit("message", message);
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Corriendo en el puerto: ${PORT}`);
});
