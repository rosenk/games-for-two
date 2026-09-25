/// <reference types="@cloudflare/workers-types" />

import { isBoardSize, isGameKind, type GameKind } from "../src/game/game-state.ts";
import { DEFAULT_HEX_SIZE } from "../src/game/hex.ts";
import { isValidRoomId } from "../src/online/match-url.js";

const QUEUE_TAG = "queue";
const WAIT_TIMEOUT = 60_000;

type QueueDetails = {
  roomId: string;
  game?: GameKind;
  boardSize?: number;
  queuedAt?: number;
  status: "connected" | "waiting" | "matched";
};

type Env = {
  MATCHMAKER: DurableObjectNamespace;
  ALLOWED_ORIGINS?: string;
};

function message(type: string, details: Record<string, unknown> = {}): string {
  return JSON.stringify({ type, ...details });
}

function allowedOrigin(request: Request, configuredOrigins = ""): boolean {
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

function waitingDetails(socket: WebSocket): QueueDetails | null {
  try {
    return socket.deserializeAttachment() as QueueDetails | null;
  } catch {
    return null;
  }
}

export class MatchmakingQueue {
  private readonly context: DurableObjectState;

  constructor(context: DurableObjectState) {
    this.context = context;
  }

  connect(socket: WebSocket, roomId: string, game: GameKind = "tic-tac-toe", boardSize = game === "hex" ? DEFAULT_HEX_SIZE : 3): void {
    this.context.acceptWebSocket(socket, [QUEUE_TAG]);
    socket.serializeAttachment({ roomId, game, boardSize, status: "connected" } satisfies QueueDetails);
  }

  enqueue(socket: WebSocket, roomId: string, now = Date.now(), game: GameKind = "tic-tac-toe", boardSize = game === "hex" ? DEFAULT_HEX_SIZE : 3): void {
    const candidates: Array<{ socket: WebSocket; roomId: string; queuedAt: number }> = [];

    for (const waitingSocket of this.context.getWebSockets(QUEUE_TAG)) {
      if (waitingSocket === socket) continue;
      const details = waitingDetails(waitingSocket);
      if (
        details?.status !== "waiting"
        || waitingSocket.readyState !== 1
        || !isValidRoomId(details.roomId)
        || typeof details.queuedAt !== "number"
        || !Number.isFinite(details.queuedAt)
        || now - details.queuedAt >= WAIT_TIMEOUT
      ) {
        try {
          waitingSocket.close(1000, "Queue entry expired");
        } catch {}
        continue;
      }
      if ((details.game || "tic-tac-toe") !== game
        || (details.boardSize ?? (game === "hex" ? DEFAULT_HEX_SIZE : 3)) !== boardSize) continue;
      candidates.push({ socket: waitingSocket, roomId: details.roomId, queuedAt: details.queuedAt });
    }

    candidates.sort((left, right) => left.queuedAt - right.queuedAt);
    socket.serializeAttachment({ roomId, game, boardSize, queuedAt: now, status: "waiting" } satisfies QueueDetails);

    for (const candidate of candidates) {
      try {
        candidate.socket.serializeAttachment({
          roomId: candidate.roomId,
          game,
          boardSize,
          queuedAt: candidate.queuedAt,
          status: "matched",
        } satisfies QueueDetails);
        socket.serializeAttachment({ roomId, game, boardSize, queuedAt: now, status: "matched" } satisfies QueueDetails);
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

  fetch(request: Request): Response {
    if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
      return new Response("WebSocket upgrade required", { status: 426 });
    }

    const parameters = new URL(request.url).searchParams;
    const roomId = parameters.get("room");
    const game = parameters.get("game") || "tic-tac-toe";
    const sizeParameter = parameters.get("size");
    const boardSize = sizeParameter === null
      ? game === "hex" ? DEFAULT_HEX_SIZE : 3
      : Number(sizeParameter);
    if (!roomId || !isValidRoomId(roomId)) return new Response("Invalid room", { status: 400 });
    if (!isGameKind(game)) return new Response("Invalid game", { status: 400 });
    if (!isBoardSize(game, boardSize) || (game === "tic-tac-toe" && sizeParameter !== null)
      || (sizeParameter !== null && sizeParameter !== String(boardSize))) {
      return new Response("Invalid board size", { status: 400 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.connect(server, roomId, game, boardSize);
    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketMessage(socket: WebSocket, payload: string | ArrayBuffer): void {
    const details = waitingDetails(socket);
    if (payload === "ready" && details?.status === "connected") {
      this.enqueue(socket, details.roomId, Date.now(), details.game || "tic-tac-toe",
        details.boardSize ?? (details.game === "hex" ? DEFAULT_HEX_SIZE : 3));
      return;
    }

    socket.send(message("error", { message: "Невалидно съобщение към опашката." }));
    socket.close(1008, "Invalid queue message");
  }

  webSocketError(socket: WebSocket): void {
    try {
      socket.close(1011, "WebSocket error");
    } catch {}
  }
}

export default {
  fetch(request: Request, environment: Env): Response | Promise<Response> {
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
