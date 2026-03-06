const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
  pingTimeout: 60000,
  pingInterval: 25000,
});

app.use(express.static(path.join(__dirname, "public")));

// In-memory store: socketId → member data
const members = new Map();

io.on("connection", (socket) => {
  // ── 访客进入：发送当前成员列表 ──────────────────────
  socket.emit("room:snapshot", Object.fromEntries(members));

  // ── 加入自习室 ──────────────────────────────────────
  socket.on("member:join", ({ name, task, shareScreen }) => {
    const member = {
      id: socket.id,
      name,
      task: task || "",
      startTime: Date.now(),
      shareScreen: shareScreen || false,
    };
    members.set(socket.id, member);
    io.emit("member:joined", member);
  });

  // ── 更新任务 ────────────────────────────────────────
  socket.on("member:update", ({ task }) => {
    const m = members.get(socket.id);
    if (m) {
      m.task = task;
      io.emit("member:updated", { id: socket.id, task });
    }
  });

  // ── 屏幕共享状态变化 ────────────────────────────────
  socket.on("member:screen", ({ sharing }) => {
    const m = members.get(socket.id);
    if (m) {
      m.shareScreen = sharing;
      io.emit("member:screen-changed", { id: socket.id, sharing });
    }
  });

  // ── WebRTC 信令转发 ─────────────────────────────────
  socket.on("signal:offer", ({ to, offer }) => {
    io.to(to).emit("signal:offer", { from: socket.id, offer });
  });

  socket.on("signal:answer", ({ to, answer }) => {
    io.to(to).emit("signal:answer", { from: socket.id, answer });
  });

  socket.on("signal:ice", ({ to, candidate }) => {
    io.to(to).emit("signal:ice", { from: socket.id, candidate });
  });

  // ── 断开连接 ────────────────────────────────────────
  socket.on("disconnect", () => {
    if (members.has(socket.id)) {
      members.delete(socket.id);
      io.emit("member:left", { id: socket.id });
    }
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`✅ 自习室服务器运行在 http://localhost:${PORT}`);
});
