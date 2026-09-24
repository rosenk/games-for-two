import assert from "node:assert/strict";
import test from "node:test";

import {
  clearMatchPath,
  createMatchUrl,
  createRoomId,
  getOrCreateTabSecret,
  isRoomHost,
  isValidMatchToken,
  isValidRoomId,
  matchPath,
  parseMatchRoute,
  playerTokenForRoom,
} from "../src/online/match-url.js";

const tabOne = "a".repeat(43);
const tabTwo = "b".repeat(43);
const nonce = "c".repeat(32);

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test("keeps a stable identity in each tab without sharing it across tabs", () => {
  const firstTabStorage = memoryStorage();
  const secondTabStorage = memoryStorage();

  const created = getOrCreateTabSecret(firstTabStorage);
  assert.match(created, /^[A-Za-z0-9_-]{43}$/);
  assert.equal(getOrCreateTabSecret(firstTabStorage), created);
  assert.notEqual(getOrCreateTabSecret(secondTabStorage), created);
});

test("recognizes only rooms signed by the current tab", async () => {
  const roomId = await createRoomId(tabOne, nonce);

  assert.equal(roomId, "ttt-cccccccccccccccccccccccccccccccc5e326eae1acbdd13b4e93bfad5ba6cb4");
  assert.equal(isValidRoomId(roomId), true);
  assert.equal(await isRoomHost(roomId, tabOne), true);
  assert.equal(await isRoomHost(roomId, tabTwo), false);
});

test("derives stable, room-specific player tokens", async () => {
  const firstRoom = await createRoomId(tabOne, nonce);
  const secondRoom = await createRoomId(tabOne, "d".repeat(32));

  assert.equal(
    await playerTokenForRoom(tabOne, firstRoom),
    await playerTokenForRoom(tabOne, firstRoom),
  );
  assert.notEqual(
    await playerTokenForRoom(tabOne, firstRoom),
    await playerTokenForRoom(tabOne, secondRoom),
  );
  assert.notEqual(
    await playerTokenForRoom(tabOne, firstRoom),
    await playerTokenForRoom(tabTwo, firstRoom),
  );
});

test("creates and parses one identity-free match URL", async () => {
  const roomId = await createRoomId(tabOne, nonce);
  const address = createMatchUrl("https://game.example/play?old=value#section", roomId);

  assert.equal(address, `https://game.example/play?room=${roomId}`);
  assert.deepEqual(parseMatchRoute(`?room=${roomId}`), { roomId, game: "tic-tac-toe", boardSize: 3, valid: true });
});

test("Hex invitation preserves the game while old links remain tic-tac-toe", async () => {
  const roomId = await createRoomId(tabOne, nonce);
  const address = createMatchUrl("https://game.example/play", roomId, "hex");
  assert.equal(address, `https://game.example/play?room=${roomId}&game=hex`);
  assert.deepEqual(parseMatchRoute(new URL(address).search), { roomId, game: "hex", boardSize: 5, valid: true });
  assert.equal(parseMatchRoute(`?room=${roomId}&game=unknown`).valid, false);
  assert.equal(clearMatchPath(address), "/play");
});

test("Hex invitation includes a non-default size and rejects invalid or mismatched sizes", async () => {
  const roomId = await createRoomId(tabOne, nonce);
  const address = createMatchUrl("https://game.example/play", roomId, "hex", 9);
  assert.equal(address, `https://game.example/play?room=${roomId}&game=hex&size=9`);
  assert.deepEqual(parseMatchRoute(new URL(address).search), { roomId, game: "hex", boardSize: 9, valid: true });
  assert.equal(parseMatchRoute(`?room=${roomId}&game=hex&size=6`).valid, false);
  assert.equal(parseMatchRoute(`?room=${roomId}&game=hex&size=09`).valid, false);
  assert.equal(parseMatchRoute(`?room=${roomId}&size=9`).valid, false);
  assert.equal(clearMatchPath(address), "/play");
});

test("rejects legacy identity URLs and malformed values", async () => {
  const roomId = await createRoomId(tabOne, nonce);

  assert.equal(parseMatchRoute("?campaign=summer"), null);
  assert.equal(parseMatchRoute(`?room=${roomId}&host=h-b`).valid, false);
  assert.equal(parseMatchRoute(`?room=${roomId}&player=p-b`).valid, false);
  assert.equal(parseMatchRoute("?room=ttt-a").valid, false);
  assert.equal(isValidMatchToken(""), false);
  assert.throws(() => createMatchUrl("https://game.example/", "bad room"), /Invalid room ID/);
});

test("clears only match routing parameters when leaving", async () => {
  const roomId = await createRoomId(tabOne, nonce);
  const address = `https://game.example/play?campaign=summer&room=${roomId}&host=h-b#rules`;

  assert.equal(clearMatchPath(address), "/play?campaign=summer#rules");
  assert.equal(matchPath(`https://game.example/play?room=${roomId}#board`), `/play?room=${roomId}#board`);
});
