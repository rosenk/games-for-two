import assert from "node:assert/strict";
import test from "node:test";

import { MatchmakingQueue } from "../matchmaker/worker.ts";
import { createRoomId } from "../src/online/match-url.js";

const browserSecret = "a".repeat(43);

class FakeSocket {
  constructor() {
    this.readyState = 1;
    this.messages = [];
    this.attachment = null;
  }

  send(value) {
    this.messages.push(JSON.parse(value));
  }

  close() {
    this.readyState = 3;
  }

  serializeAttachment(value) {
    this.attachment = value;
  }

  deserializeAttachment() {
    return this.attachment;
  }
}

function fakeContext() {
  const sockets = [];
  return {
    acceptWebSocket(socket) {
      sockets.push(socket);
    },
    getWebSockets() {
      return sockets;
    },
  };
}

test("pairs twenty simultaneous entrants into ten distinct FIFO matches", async () => {
  const queue = new MatchmakingQueue(fakeContext());
  const sockets = [];
  const roomIds = [];

  for (let index = 0; index < 20; index += 1) {
    const socket = new FakeSocket();
    const nonce = index.toString(16).padStart(32, "0");
    const roomId = await createRoomId(browserSecret, nonce);
    sockets.push(socket);
    roomIds.push(roomId);
    queue.connect(socket, roomId);
    queue.webSocketMessage(socket, "ready");
  }

  for (let index = 0; index < sockets.length; index += 2) {
    assert.deepEqual(sockets[index].messages, [
      { type: "waiting" },
      { type: "matched", role: "host", roomId: roomIds[index] },
    ]);
    assert.deepEqual(sockets[index + 1].messages, [
      { type: "matched", role: "guest", roomId: roomIds[index] },
    ]);
    assert.equal(sockets[index].attachment.status, "matched");
    assert.equal(sockets[index + 1].attachment.status, "matched");
  }
});

test("does not match a new player with an expired queue entry", async () => {
  const queue = new MatchmakingQueue(fakeContext());
  const expired = new FakeSocket();
  const current = new FakeSocket();
  const expiredRoom = await createRoomId(browserSecret, "a".repeat(32));
  const currentRoom = await createRoomId(browserSecret, "b".repeat(32));

  queue.connect(expired, expiredRoom);
  queue.enqueue(expired, expiredRoom, 0);
  queue.connect(current, currentRoom);
  queue.enqueue(current, currentRoom, 60_000);

  assert.equal(expired.readyState, 3);
  assert.deepEqual(current.messages, [{ type: "waiting" }]);
  assert.equal(current.readyState, 1);
});

for (const game of ["hex", "dots-and-boxes"]) test(`keeps ${game} and tic-tac-toe in separate matchmaking queues`, async () => {
  const queue = new MatchmakingQueue(fakeContext());
  const rooms = await Promise.all(["1", "2", "3"].map((digit) => createRoomId(browserSecret, digit.repeat(32))));
  const tic = new FakeSocket();
  const hex = new FakeSocket();
  const secondHex = new FakeSocket();
  queue.connect(tic, rooms[0]);
  queue.enqueue(tic, rooms[0], 100);
  queue.connect(hex, rooms[1], game);
  queue.enqueue(hex, rooms[1], 101, game);
  assert.deepEqual(hex.messages, [{ type: "waiting" }]);
  queue.connect(secondHex, rooms[2], game);
  queue.enqueue(secondHex, rooms[2], 102, game);
  assert.deepEqual(tic.messages, [{ type: "waiting" }]);
  assert.deepEqual(hex.messages.at(-1), { type: "matched", role: "host", roomId: rooms[1] });
  assert.deepEqual(secondHex.messages, [{ type: "matched", role: "guest", roomId: rooms[1] }]);
});

test("pairs Hex players only with the same board size", async () => {
  const queue = new MatchmakingQueue(fakeContext());
  const rooms = await Promise.all(["4", "5", "6"].map((digit) => createRoomId(browserSecret, digit.repeat(32))));
  const seven = new FakeSocket();
  const nine = new FakeSocket();
  const anotherSeven = new FakeSocket();
  queue.connect(seven, rooms[0], "hex", 7);
  queue.enqueue(seven, rooms[0], 100, "hex", 7);
  queue.connect(nine, rooms[1], "hex", 9);
  queue.enqueue(nine, rooms[1], 101, "hex", 9);
  assert.deepEqual(nine.messages, [{ type: "waiting" }]);
  queue.connect(anotherSeven, rooms[2], "hex", 7);
  queue.enqueue(anotherSeven, rooms[2], 102, "hex", 7);
  assert.deepEqual(seven.messages.at(-1), { type: "matched", role: "host", roomId: rooms[0] });
  assert.deepEqual(anotherSeven.messages, [{ type: "matched", role: "guest", roomId: rooms[0] }]);
  assert.deepEqual(nine.messages, [{ type: "waiting" }]);
});

test("pairs Dots and Boxes players only with the same size", async () => {
  const queue = new MatchmakingQueue(fakeContext());
  const rooms = await Promise.all(["8", "9", "a"].map((digit) => createRoomId(browserSecret, digit.repeat(32))));
  const sockets = rooms.map(() => new FakeSocket());
  for (const [index, size] of [3, 6, 6].entries()) {
    queue.connect(sockets[index], rooms[index], "dots-and-boxes", size);
    queue.enqueue(sockets[index], rooms[index], 100 + index, "dots-and-boxes", size);
  }
  assert.deepEqual(sockets[0].messages, [{ type: "waiting" }]);
  assert.deepEqual(sockets[1].messages.at(-1), { type: "matched", role: "host", roomId: rooms[1] });
  assert.deepEqual(sockets[2].messages, [{ type: "matched", role: "guest", roomId: rooms[1] }]);
});

test("Worker rejects invalid sizes before opening a WebSocket", async () => {
  const queue = new MatchmakingQueue(fakeContext());
  const roomId = await createRoomId(browserSecret, "7".repeat(32));
  for (const query of [`game=hex&size=6`, `game=hex&size=09`, `size=9`, `game=dots-and-boxes&size=7`, `game=dots-and-boxes&size=04`]) {
    const request = new Request(`https://match.example/match?room=${roomId}&${query}`, {
      headers: { Upgrade: "websocket" },
    });
    assert.equal(queue.fetch(request).status, 400);
  }
});
