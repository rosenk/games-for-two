import assert from "node:assert/strict";
import test from "node:test";

import { createGameState, makeMove, serializeGame } from "../src/game/game-state.ts";
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
  const firstRoom = await createRoomId(browserSecret, "b".repeat(32));
  const secondRoom = await createRoomId(browserSecret, "c".repeat(32));
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

test("restores a hosted Hex board without converting it to tic-tac-toe", async () => {
  const storage = memoryStorage();
  const roomId = await createRoomId(browserSecret, "1".repeat(32));
  const hex = serializeGame(makeMove(createGameState("hex", 9), 80, "X"));
  saveHostedMatch(storage, roomId, { playerTokenHash: null, game: hex }, 1000);
  assert.deepEqual(loadHostedMatch(storage, roomId, 1001).game, hex);
  assert.equal(loadHostedMatch(storage, roomId, 1001).game.board.length, 81);
  assert.equal(loadHostedMatch(storage, roomId, 1001).game.boardSize, 9);
});

test("expires inactive rooms without touching active rooms", async () => {
  const storage = memoryStorage();
  const expiredRoom = await createRoomId(browserSecret, "d".repeat(32));
  const activeRoom = await createRoomId(browserSecret, "e".repeat(32));
  const match = { playerTokenHash: null, game: serializeGame(createGameState()) };

  saveHostedMatch(storage, expiredRoom, match, 1000);
  saveHostedMatch(storage, activeRoom, match, 1001);
  pruneHostedMatches(storage, 1000 + MATCH_INACTIVITY_TIMEOUT);

  assert.equal(loadHostedMatch(storage, expiredRoom, 1000 + MATCH_INACTIVITY_TIMEOUT), null);
  assert.notEqual(loadHostedMatch(storage, activeRoom, 1000 + MATCH_INACTIVITY_TIMEOUT), null);
});

test("removes a room after a graceful exit", async () => {
  const storage = memoryStorage();
  const roomId = await createRoomId(browserSecret, "f".repeat(32));
  saveHostedMatch(storage, roomId, {
    playerTokenHash: null,
    game: serializeGame(createGameState()),
  }, 1000);

  removeHostedMatch(storage, roomId);

  assert.equal(loadHostedMatch(storage, roomId, 1001), null);
});

test("discards a corrupted game snapshot", async () => {
  const storage = memoryStorage();
  const roomId = await createRoomId(browserSecret, "a".repeat(32));

  storage.setItem(`tic-tac-toe:match:${roomId}`, JSON.stringify({
    version: 1,
    playerTokenHash: null,
    game: { board: ["X"] },
    updatedAt: 1000,
  }));

  assert.equal(loadHostedMatch(storage, roomId, 1001), null);
  assert.equal(storage.length, 0);
});
