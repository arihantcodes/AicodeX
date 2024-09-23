import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server as SocketServer } from "socket.io";
import * as pty from "node-pty";
import fs from "fs";
import os from "os";
import userRouter from "./routes/user.route";
import projectRouter from "./routes/project.route";
import path from "path"
dotenv.config();

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/", projectRouter);

app.on("error", (error) => {
  console.log("Error on the server", error);
});
// io.attach(server);
const shell = os.platform() === "win32" ? "powershell.exe" : "bash";
// Initialize the pty process
const ptyProcess = pty.spawn(shell, [], {
  name: "xterm-color",
  cols: 80,
  rows: 30,
  cwd: process.env.INIT_CWD +"./aicodex" ,
  env: process.env,
});

app.use(cors(corsOptions));
app.use(express.json());
ptyProcess.onData((data) => {
  io.emit("terminal:data", data);
});
io.on("connection", (socket) => {
  console.log(`Socket connected`, socket.id);

  // Listen for terminal commands from the frontend
  socket.on("terminal:write", (data) => {
    console.log(`Received command: ${data}`);
    ptyProcess.write(data); // Write the command to the pty terminal
  });

  // Send back the terminal output to the client
});
app.get("/files", async(req, res) => {
  const fileTree = await generateFileTree('./aicodex')
  return res.json({tree: fileTree})

})

const port = process.env.PORT || 3007;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



async function generateFileTree(directory:any) {
  const tree = {}

  async function buildTree(currentDir:any, currentTree:any) {
      const files = fs.readdirSync(currentDir)

      for (const file of files) {
          const filePath = path.join(currentDir, file)
          const stat = fs.statSync(filePath)

          if (stat.isDirectory()) {
              currentTree[file] = {}
              await buildTree(filePath, currentTree[file])
          } else {
              currentTree[file] = null
          }
      }
  }

  await buildTree(directory, tree);
  return tree
}