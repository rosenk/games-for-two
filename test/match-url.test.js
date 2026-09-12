import assert from "node:assert/strict";
import test from "node:test";

import {
  clearMatchPath,
  createMatchUrls,
  isValidMatchToken,
  matchPath,
  parseMatchRoute,
} from "../src/online/match-url.js";

test("creates distinct, portable URLs for both sides of a match", () => {
  const urls = createMatchUrls("https://game.example/play?old=value#section", {
    roomId: "ttt-room_42",
    guestToken: "p-guest_73",
  });

  assert.equal(
    urls.hostUrl,
    "https://game.example/play?room=ttt-room_42&player=p-guest_73&role=host",
  );
  assert.equal(
    urls.inviteUrl,
    "https://game.example/play?room=ttt-room_42&player=p-guest_73&role=guest",
  );
});

test("parses host, guest, and backward-compatible guest routes", () => {
  assert.deepEqual(parseMatchRoute("?room=ttt-a&player=p-b&role=host"), {
    role: "host",
    roomId: "ttt-a",
    guestToken: "p-b",
    valid: true,
  });
  assert.equal(parseMatchRoute("?room=ttt-a&player=p-b&role=guest").role, "guest");
  assert.equal(parseMatchRoute("?room=ttt-a&player=p-b").role, "guest");
});

test("rejects malformed routes and tokens", () => {
  assert.equal(parseMatchRoute("?campaign=summer"), null);
  assert.equal(parseMatchRoute("?room=ttt-a&player=p-b&role=admin").valid, false);
  assert.equal(parseMatchRoute("?room=ttt-a&player=not%20safe").valid, false);
  assert.equal(isValidMatchToken(""), false);
  assert.throws(
    () => createMatchUrls("https://game.example/", { roomId: "bad room", guestToken: "p-ok" }),
    /Invalid match tokens/,
  );
});

test("clears only match routing parameters when leaving", () => {
  const address = "https://game.example/play?campaign=summer&room=ttt-a&player=p-b&role=host#rules";
  assert.equal(clearMatchPath(address), "/play?campaign=summer#rules");
  assert.equal(matchPath("https://game.example/play?room=ttt-a#board"), "/play?room=ttt-a#board");
});
