import assert from "node:assert/strict";
import test from "node:test";

import {
  clearMatchPath,
  createMatchUrls,
  createPlayerUrl,
  isValidMatchToken,
  matchPath,
  parseMatchRoute,
  roomIdForHostToken,
} from "../src/online/match-url.js";

test("creates a short invitation and private portable URLs for both players", () => {
  const urls = createMatchUrls("https://game.example/play?old=value#section", {
    roomId: "ttt-room_42",
    hostToken: "h-owner_73",
  });

  assert.equal(
    urls.hostUrl,
    "https://game.example/play?room=ttt-room_42&host=h-owner_73",
  );
  assert.equal(
    urls.inviteUrl,
    "https://game.example/play?room=ttt-room_42",
  );
  assert.equal(
    createPlayerUrl("https://game.example/play?room=old", {
      roomId: "ttt-room_42",
      playerToken: "p-guest_73",
    }),
    "https://game.example/play?room=ttt-room_42&player=p-guest_73",
  );
});

test("parses host, new guest, and returning guest routes", () => {
  assert.deepEqual(parseMatchRoute("?room=ttt-a&host=h-b"), {
    role: "host",
    roomId: "ttt-a",
    hostToken: "h-b",
    guestToken: null,
    valid: true,
  });
  assert.deepEqual(parseMatchRoute("?room=ttt-a"), {
    role: "guest",
    roomId: "ttt-a",
    hostToken: null,
    guestToken: null,
    valid: true,
  });
  assert.equal(parseMatchRoute("?room=ttt-a&player=p-b").guestToken, "p-b");
});

test("rejects malformed routes and tokens", () => {
  assert.equal(parseMatchRoute("?campaign=summer"), null);
  assert.equal(parseMatchRoute("?room=ttt-a&player=p-b&role=guest").valid, false);
  assert.equal(parseMatchRoute("?room=ttt-a&player=not%20safe").valid, false);
  assert.equal(parseMatchRoute("?room=ttt-a&player=p-b&host=h-c").valid, false);
  assert.equal(isValidMatchToken(""), false);
  assert.throws(
    () => createMatchUrls("https://game.example/", { roomId: "bad room", hostToken: "h-ok" }),
    /Invalid match tokens/,
  );
});

test("derives a stable, non-secret room ID from the host token", async () => {
  assert.equal(await roomIdForHostToken("h-test"), "ttt-5lw-elJtQGbHCoRj9EugBn");
  assert.notEqual(await roomIdForHostToken("h-other"), await roomIdForHostToken("h-test"));
});

test("clears only match routing parameters when leaving", () => {
  const address = "https://game.example/play?campaign=summer&room=ttt-a&host=h-b#rules";
  assert.equal(clearMatchPath(address), "/play?campaign=summer#rules");
  assert.equal(matchPath("https://game.example/play?room=ttt-a#board"), "/play?room=ttt-a#board");
});
