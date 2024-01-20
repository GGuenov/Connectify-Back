// const dotenv = require("dotenv");
// dotenv.config({ path: "./config.env" });
// const MONGODB_URI = process.env.MONGODB;
// console.log(MONGODB_URI);
const server = require("./src/app");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3003;
const initializeSocket = require("./src/controllers/Utils/Socket");
const { Server } = require("socket.io");
const { createServer } = require("node:http");

// Conecta a MongoDB primero
mongoose
  .connect(
    `mongodb+srv://GGuenov:Forcoding12@clustercero.awmiffq.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error connection", error);
  });

const httpServer = createServer(server);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
});
// importaciones para que funcione socket.io en otro archivo
const socketChat = require("./src/controllers/Utils/Socket.io/ChatSocket");
socketChat(io);
console.log(PORT);
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
