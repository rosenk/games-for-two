import { isValidRoomId } from "./match-url.js";

const SEARCH_TIMEOUT = 60_000;
const PRODUCTION_ENDPOINT = "https://tic-tac-toe-matchmaker.rosen4obg.workers.dev";
const defaultEndpoint = import.meta.env?.VITE_MATCHMAKER_URL || PRODUCTION_ENDPOINT;

export function matchmakerSocketUrl(endpoint, roomId) {
  if (!isValidRoomId(roomId)) throw new TypeError("Invalid room ID");
  const url = new URL(endpoint);
  if (url.protocol === "https:") url.protocol = "wss:";
  else if (url.protocol === "http:") url.protocol = "ws:";
  else if (url.protocol !== "wss:" && url.protocol !== "ws:") {
    throw new TypeError("Invalid matchmaker URL");
  }
  if (url.pathname === "/") url.pathname = "/match";
  url.searchParams.set("room", roomId);
  return url.toString();
}

export class Matchmaker {
  constructor({
    endpoint = defaultEndpoint,
    onWaiting,
    onMatched,
    onError,
    WebSocketClass = globalThis.WebSocket,
    setTimer = (callback, delay) => globalThis.setTimeout(callback, delay),
    clearTimer = (timer) => globalThis.clearTimeout(timer),
  }) {
    this.endpoint = endpoint;
    this.onWaiting = onWaiting;
    this.onMatched = onMatched;
    this.onError = onError;
    this.WebSocketClass = WebSocketClass;
    this.setTimer = setTimer;
    this.clearTimer = clearTimer;
    this.socket = null;
    this.timer = null;
  }

  get active() {
    return Boolean(this.socket);
  }

  get configured() {
    return Boolean(this.endpoint && this.WebSocketClass);
  }

  search(roomId) {
    this.cancel();

    let socketUrl;
    try {
      if (!this.endpoint) throw new Error("Matchmaker is not configured");
      socketUrl = matchmakerSocketUrl(this.endpoint, roomId);
      if (!this.WebSocketClass) throw new Error("WebSocket is unavailable");
    } catch {
      this.onError?.("Търсенето на противник още не е конфигурирано.");
      return;
    }

    const socket = new this.WebSocketClass(socketUrl);
    this.socket = socket;
    this.onWaiting?.();
    this.timer = this.setTimer(() => {
      this.fail(socket, "Не намерихме свободен противник. Опитай отново.");
    }, SEARCH_TIMEOUT);

    socket.addEventListener("open", () => {
      if (this.socket === socket) socket.send("ready");
    });
    socket.addEventListener("message", (event) => {
      if (this.socket !== socket || typeof event.data !== "string") return;

      let result;
      try {
        result = JSON.parse(event.data);
      } catch {
        this.fail(socket, "Matchmaking услугата върна невалиден отговор.");
        return;
      }

      if (result.type === "waiting") return;
      if (
        result.type !== "matched"
        || !["host", "guest"].includes(result.role)
        || !isValidRoomId(result.roomId)
      ) {
        this.fail(socket, result.message || "Matchmaking услугата върна невалиден отговор.");
        return;
      }

      this.socket = null;
      this.clearSearchTimer();
      socket.close(1000, "Matched");
      this.onMatched?.({ role: result.role, roomId: result.roomId });
    });

    socket.addEventListener("error", () => {
      this.fail(socket, "Не успяхме да се свържем с matchmaking услугата.");
    });
    socket.addEventListener("close", () => {
      this.fail(socket, "Връзката с matchmaking услугата прекъсна.");
    });
  }

  fail(socket, error) {
    if (this.socket !== socket) return;
    this.socket = null;
    this.clearSearchTimer();
    try {
      socket.close(1000, "Search finished");
    } catch {}
    this.onError?.(error);
  }

  clearSearchTimer() {
    if (this.timer === null) return;
    this.clearTimer(this.timer);
    this.timer = null;
  }

  cancel() {
    const socket = this.socket;
    this.socket = null;
    this.clearSearchTimer();
    if (!socket) return;
    try {
      socket.close(1000, "Search canceled");
    } catch {}
  }
}
