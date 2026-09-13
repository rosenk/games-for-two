import assert from "node:assert/strict";
import test from "node:test";

import { createGameState, makeMove, serializeGame } from "../src/game/game-state.js";
import { createRoomId } from "../src/online/match-url.js";
import {
  loadHostedMatch,
  MATCH_INACTIVITY_TIMEOUT,
  pruneHostedMatches,
  removeHostedMatch,
  saveHostedMatch,
} from "../src/online/match-store.js";

const browserSecret = "a".repeat(43);

function memoryStorage() {
  const values = new Map();
  return {
    get length() {
      return values.size;
    },
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => values.delete(key),
    setItem: (key, value) => values.set(key, value),
  };
}

test("restores each hosted room with its opponent and game state", async () => {
  const storage = memoryStorage();
  const firstRoom = await createRoomId(browserSecret, "b".repeat(22));
  const secondRoom = await createRoomId(browserSecret, "c".repeat(22));
  const playedGame = serializeGame(makeMove(createGameState(), 8, "X"));

  saveHostedMatch(storage, firstRoom, {
    playerTokenHash: "d".repeat(43),
    game: playedGame,
  }, 1000);
  saveHostedMatch(storage, secondRoom, {
    playerTokenHash: null,
    game: serializeGame(createGameState()),
  }, 2000);

  assert.deepEqual(loadHostedMatch(storage, firstRoom, 3000), {
    version: 1,
    playerTokenHash: "d".repeat(43),
    game: playedGame,
    updatedAt: 1000,
  });
  assert.equal(loadHostedMatch(storage, secondRoom, 3000).playerTokenHash, null);
});

test("expires inactive rooms without touching active rooms", async () => {
  const storage = memoryStorage();
  const expiredRoom = await createRoomId(browserSecret, "d".repeat(22));
  const activeRoom = await createRoomId(browserSecret, "e".repeat(22));
  const match = { playerTokenHash: null, game: serializeGame(createGameState()) };

  saveHostedMatch(storage, expiredRoom, match, 1000);
  saveHostedMatch(storage, activeRoom, match, 1001);
  pruneHostedMatches(storage, 1000 + MATCH_INACTIVITY_TIMEOUT);

  assert.equal(loadHostedMatch(storage, expiredRoom, 1000 + MATCH_INACTIVITY_TIMEOUT), null);
  assert.notEqual(loadHostedMatch(storage, activeRoom, 1000 + MATCH_INACTIVITY_TIMEOUT), null);
});

test("removes a room after a graceful exit", async () => {
  const storage = memoryStorage();
  const roomId = await createRoomId(browserSecret, "f".repeat(22));
  saveHostedMatch(storage, roomId, {
    playerTokenHash: null,
    game: serializeGame(createGameState()),
  }, 1000);

  removeHostedMatch(storage, roomId);

  assert.equal(loadHostedMatch(storage, roomId, 1001), null);
});

test("discards a corrupted game snapshot", async () => {
  const storage = memoryStorage();
  const roomId = await createRoomId(browserSecret, "g".repeat(22));

  storage.setItem(`tic-tac-toe:match:${roomId}`, JSON.stringify({
    version: 1,
    playerTokenHash: null,
    game: { board: ["X"] },
    updatedAt: 1000,
  }));

  assert.equal(loadHostedMatch(storage, roomId, 1001), null);
  assert.equal(storage.length, 0);
});
