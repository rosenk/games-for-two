import assert from "node:assert/strict";
import test from "node:test";

import {
  createOnlineState,
  OnlineSession,
  playerForRole,
} from "../src/online/online-session.js";
import { hashPlayerToken } from "../src/online/match-url.js";

test("assigns X to either network role while keeping opponents distinct", () => {
  assert.equal(playerForRole("room-even", "host"), "X");
  assert.equal(playerForRole("room-even", "guest"), "O");
  assert.equal(playerForRole("room-odd", "host"), "O");
  assert.equal(playerForRole("room-odd", "guest"), "X");
});

test("reports when the remote player starts and stops their microphone", () => {
  const changes = [];
  const session = new OnlineSession({
    getRemoteAudio: () => null,
    onChange: (state) => changes.push(state),
  });

  assert.equal(createOnlineState().remoteAudioEnabled, false);

  session.handleConnectionData({ type: "audio-ready" });
  assert.equal(changes.at(-1).remoteAudioEnabled, true);

  session.handleConnectionData({ type: "audio-off" });
  assert.equal(changes.at(-1).remoteAudioEnabled, false);
});

test("host binds the first valid player token hash and rejects a different one", async () => {
  let acceptedHash = "";
  const session = new OnlineSession({
    getRemoteAudio: () => null,
    onChange: () => {},
    onOpponentAccepted: (playerTokenHash) => {
      acceptedHash = playerTokenHash;
    },
  });
  const connection = (playerToken) => ({
    metadata: { playerToken },
    open: false,
    handlers: {},
    on(event, handler) {
      this.handlers[event] = handler;
    },
    close() {},
  });
  const first = connection("p-first");
  const other = connection("p-other");

  session.mode = "host";
  session.localPlayer = "X";
  await session.handleHostConnection(first);
  await session.handleHostConnection(other);

  assert.equal(session.acceptedPlayerTokenHash, acceptedHash);
  assert.match(acceptedHash, /^[A-Za-z0-9_-]{43}$/);
  assert.equal(session.connection, first);
  assert.equal(typeof other.handlers.open, "function");
});

test("a restored host accepts only the previously bound player", async () => {
  const session = new OnlineSession({
    getRemoteAudio: () => null,
    onChange: () => {},
  });
  const connection = (playerToken) => ({
    metadata: { playerToken },
    open: false,
    handlers: {},
    on(event, handler) {
      this.handlers[event] = handler;
    },
    close() {},
  });
  const returning = connection("p-returning");
  const stranger = connection("p-stranger");

  session.mode = "host";
  session.localPlayer = "X";
  session.acceptedPlayerTokenHash = await hashPlayerToken("p-returning");
  await session.handleHostConnection(returning);
  await session.handleHostConnection(stranger);

  assert.equal(session.connection, returning);
  assert.equal(typeof stranger.handlers.open, "function");
});

test("graceful leave notifies the connected opponent", () => {
  const sent = [];
  const session = new OnlineSession({
    getRemoteAudio: () => null,
    onChange: () => {},
  });
  session.connection = {
    open: true,
    send: (message) => sent.push(message),
    close() {},
  };

  session.leave();

  assert.deepEqual(sent, [{ type: "leave" }]);
  assert.equal(session.mode, "local");
});
