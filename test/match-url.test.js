import assert from "node:assert/strict";
import test from "node:test";

import {
  clearMatchPath,
  createMatchUrl,
  createRoomId,
  getOrCreateBrowserSecret,
  isRoomHost,
  isValidMatchToken,
  isValidRoomId,
  matchPath,
  parseMatchRoute,
  playerTokenForRoom,
} from "../src/online/match-url.js";

const browserOne = "a".repeat(43);
const browserTwo = "b".repeat(43);
const nonce = "c".repeat(32);

test("keeps one stable identity in browser storage", () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };

  const created = getOrCreateBrowserSecret(storage);
  assert.match(created, /^[A-Za-z0-9_-]{43}$/);
  assert.equal(getOrCreateBrowserSecret(storage), created);
});

test("recognizes only rooms signed by the current browser", async () => {
  const roomId = await createRoomId(browserOne, nonce);

  assert.equal(roomId, "ttt-cccccccccccccccccccccccccccccccc5e326eae1acbdd13b4e93bfad5ba6cb4");
  assert.equal(isValidRoomId(roomId), true);
  assert.equal(await isRoomHost(roomId, browserOne), true);
  assert.equal(await isRoomHost(roomId, browserTwo), false);
});

test("derives stable, room-specific player tokens", async () => {
  const firstRoom = await createRoomId(browserOne, nonce);
  const secondRoom = await createRoomId(browserOne, "d".repeat(32));

  assert.equal(
    await playerTokenForRoom(browserOne, firstRoom),
    await playerTokenForRoom(browserOne, firstRoom),
  );
  assert.notEqual(
    await playerTokenForRoom(browserOne, firstRoom),
    await playerTokenForRoom(browserOne, secondRoom),
  );
  assert.notEqual(
    await playerTokenForRoom(browserOne, firstRoom),
    await playerTokenForRoom(browserTwo, firstRoom),
  );
});

test("creates and parses one identity-free match URL", async () => {
  const roomId = await createRoomId(browserOne, nonce);
  const address = createMatchUrl("https://game.example/play?old=value#section", roomId);

  assert.equal(address, `https://game.example/play?room=${roomId}`);
  assert.deepEqual(parseMatchRoute(`?room=${roomId}`), { roomId, valid: true });
});

test("rejects legacy identity URLs and malformed values", async () => {
  const roomId = await createRoomId(browserOne, nonce);

  assert.equal(parseMatchRoute("?campaign=summer"), null);
  assert.equal(parseMatchRoute(`?room=${roomId}&host=h-b`).valid, false);
  assert.equal(parseMatchRoute(`?room=${roomId}&player=p-b`).valid, false);
  assert.equal(parseMatchRoute("?room=ttt-a").valid, false);
  assert.equal(isValidMatchToken(""), false);
  assert.throws(() => createMatchUrl("https://game.example/", "bad room"), /Invalid room ID/);
});

test("clears only match routing parameters when leaving", async () => {
  const roomId = await createRoomId(browserOne, nonce);
  const address = `https://game.example/play?campaign=summer&room=${roomId}&host=h-b#rules`;

  assert.equal(clearMatchPath(address), "/play?campaign=summer#rules");
  assert.equal(matchPath(`https://game.example/play?room=${roomId}#board`), `/play?room=${roomId}#board`);
});
