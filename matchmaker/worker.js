import { isValidRoomId } from "../src/online/match-url.js";

const QUEUE_TAG = "queue";
const WAIT_TIMEOUT = 60_000;

function message(type, details = {}) {
  return JSON.stringify({ type, ...details });
}

function allowedOrigin(request, configuredOrigins = "") {
  const origin = request.headers.get("Origin");
  if (!origin) return false;

  try {
    const { hostname } = new URL(origin);
    if (hostname === "localhost" || hostname === "127.0.0.1") return true;
  } catch {
    return false;
  }

  return configuredOrigins
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .includes(origin);
}

function waitingDetails(socket) {
  try {
    return socket.deserializeAttachment();
  } catch {
    return null;
  }
}

export class MatchmakingQueue {
  constructor(context) {
    this.context = context;
  }

  connect(socket, roomId) {
    this.context.acceptWebSocket(socket, [QUEUE_TAG]);
    socket.serializeAttachment({ roomId, status: "connected" });
  }

  enqueue(socket, roomId, now = Date.now()) {
    const candidates = [];

    for (const waitingSocket of this.context.getWebSockets(QUEUE_TAG)) {
      if (waitingSocket === socket) continue;
      const details = waitingDetails(waitingSocket);
      if (
        details?.status !== "waiting"
        || waitingSocket.readyState !== 1
        || !isValidRoomId(details?.roomId)
        || !Number.isFinite(details?.queuedAt)
        || now - details.queuedAt >= WAIT_TIMEOUT
      ) {
        try {
          waitingSocket.close(1000, "Queue entry expired");
        } catch {}
        continue;
      }
      candidates.push({ socket: waitingSocket, ...details });
    }

    candidates.sort((left, right) => left.queuedAt - right.queuedAt);
    socket.serializeAttachment({ roomId, queuedAt: now, status: "waiting" });

    for (const candidate of candidates) {
      try {
        candidate.socket.serializeAttachment({
          roomId: candidate.roomId,
          queuedAt: candidate.queuedAt,
          status: "matched",
        });
        socket.serializeAttachment({ roomId, queuedAt: now, status: "matched" });
        candidate.socket.send(message("matched", { role: "host", roomId: candidate.roomId }));
        socket.send(message("matched", { role: "guest", roomId: candidate.roomId }));
        return;
      } catch {
        try {
          candidate.socket.close(1011, "Match delivery failed");
        } catch {}
      }
    }

    socket.send(message("waiting"));
  }

  fetch(request) {
    if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
      return new Response("WebSocket upgrade required", { status: 426 });
    }

    const roomId = new URL(request.url).searchParams.get("room");
    if (!isValidRoomId(roomId)) return new Response("Invalid room", { status: 400 });

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.connect(server, roomId);
    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketMessage(socket, payload) {
    const details = waitingDetails(socket);
    if (payload === "ready" && details?.status === "connected") {
      this.enqueue(socket, details.roomId);
      return;
    }

    socket.send(message("error", { message: "Невалидно съобщение към опашката." }));
    socket.close(1008, "Invalid queue message");
  }

  webSocketError(socket) {
    try {
      socket.close(1011, "WebSocket error");
    } catch {}
  }
}

export default {
  fetch(request, environment) {
    const url = new URL(request.url);
    if (url.pathname === "/health") return new Response("ok");
    if (url.pathname !== "/match") return new Response("Not found", { status: 404 });
    if (!allowedOrigin(request, environment.ALLOWED_ORIGINS)) {
      return new Response("Origin not allowed", { status: 403 });
    }

    const id = environment.MATCHMAKER.idFromName("global");
    return environment.MATCHMAKER.get(id).fetch(request);
  },
};
