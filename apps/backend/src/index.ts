import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@repo/db";
import userrouter from "./routes/user.route";
import projectRouter from "./routes/project.route";
import http from "http";
import shell from "shelljs"; // Import shelljs
import os from "os";
import { Server as SocketServer } from "socket.io";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const corsOptions = {
  origin: "http://localhost:3000", // Allow specific domain
  methods: "GET,POST,PUT,DELETE", // Allow specific HTTP methods
  allowedHeaders: "Content-Type,Authorization", // Allow specific headers
  credentials: true, // Allow sending cookies
};

const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.attach(server);

// Frontend routes
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/v1/user", userrouter);
app.use("/api/v1/", projectRouter);

app.on("error", (error) => {
  console.log("Error on the server", error);
});

// Handling terminal commands using shelljs
io.on("connection", (socket) => {
  console.log(`Socket connected`, socket.id);

  // Listen for terminal commands from the frontend
  socket.on("terminal:command", (command) => {
    console.log(`Received command: ${command}`);
    
    // Execute the command using shelljs
    if (shell.which(command.split(" ")[0])) {
      shell.exec(command, { silent: true }, (code: any, stdout: any, stderr: any) => {
        if (stderr) {
          socket.emit("terminal:output", `Error: ${stderr}`);
        } else {
          socket.emit("terminal:output", stdout);
        }
      });
    } else {
      socket.emit("terminal:output", `Command not found: ${command}`);
    }
  });
});

const port = process.env.PORT || 3005;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
