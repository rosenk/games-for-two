import assert from "node:assert/strict";
import test from "node:test";

import { Matchmaker, matchmakerSocketUrl } from "../src/online/matchmaker.js";
import { createRoomId } from "../src/online/match-url.js";

const browserSecret = "a".repeat(43);

class FakeWebSocket {
  constructor(url) {
    this.url = url;
    this.handlers = {};
    this.closed = false;
    this.sent = [];
    FakeWebSocket.instances.push(this);
  }

  addEventListener(event, handler) {
    this.handlers[event] = handler;
  }

  send(value) {
    this.sent.push(value);
  }

  close() {
    this.closed = true;
    this.handlers.close?.();
  }

  emit(event, data) {
    this.handlers[event]?.({ data });
  }
}

FakeWebSocket.instances = [];

test("builds a secure matchmaking WebSocket URL", async () => {
  const roomId = await createRoomId(browserSecret, "a".repeat(32));
  assert.equal(
    matchmakerSocketUrl("https://match.example/", roomId),
    `wss://match.example/match?room=${roomId}`,
  );
  assert.equal(matchmakerSocketUrl("https://match.example/", roomId, "hex"),
    `wss://match.example/match?room=${roomId}&game=hex`);
  assert.equal(matchmakerSocketUrl("https://match.example/", roomId, "hex", 11),
    `wss://match.example/match?room=${roomId}&game=hex&size=11`);
  assert.equal(matchmakerSocketUrl("https://match.example/", roomId, "dots-and-boxes", 6),
    `wss://match.example/match?room=${roomId}&game=dots-and-boxes&size=6`);
  assert.throws(() => matchmakerSocketUrl("https://match.example/", roomId, "dots-and-boxes", 7), /Invalid board size/);
});

test("starts the assigned existing game role after a valid match", async () => {
  const waiting = [];
  const matches = [];
  const errors = [];
  const roomId = await createRoomId(browserSecret, "b".repeat(32));
  const timers = [];
  const matchmaker = new Matchmaker({
    endpoint: "https://match.example",
    WebSocketClass: FakeWebSocket,
    setTimer: (callback) => timers.push(callback) - 1,
    clearTimer: () => {},
    onWaiting: () => waiting.push(true),
    onMatched: (match) => matches.push(match),
    onError: (error) => errors.push(error),
  });

  matchmaker.search(roomId);
  const socket = FakeWebSocket.instances.at(-1);
  socket.emit("open");
  socket.emit("message", JSON.stringify({ type: "waiting" }));
  socket.emit("message", JSON.stringify({ type: "matched", role: "guest", roomId }));

  assert.deepEqual(socket.sent, ["ready"]);
  assert.equal(waiting.length, 1);
  assert.deepEqual(matches, [{ role: "guest", roomId }]);
  assert.deepEqual(errors, []);
  assert.equal(socket.closed, true);
  assert.equal(matchmaker.active, false);
});

test("reports malformed matchmaking responses instead of entering a room", async () => {
  const matches = [];
  const errors = [];
  const roomId = await createRoomId(browserSecret, "c".repeat(32));
  const matchmaker = new Matchmaker({
    endpoint: "https://match.example",
    WebSocketClass: FakeWebSocket,
    setTimer: () => 1,
    clearTimer: () => {},
    onWaiting: () => {},
    onMatched: (match) => matches.push(match),
    onError: (error) => errors.push(error),
  });

  matchmaker.search(roomId);
  FakeWebSocket.instances.at(-1).emit(
    "message",
    JSON.stringify({ type: "matched", role: "host", roomId: "invalid" }),
  );

  assert.deepEqual(matches, []);
  assert.equal(errors.length, 1);
  assert.equal(matchmaker.active, false);
});
