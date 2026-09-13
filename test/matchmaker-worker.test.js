import assert from "node:assert/strict";
import test from "node:test";

import { MatchmakingQueue } from "../matchmaker/worker.js";
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
