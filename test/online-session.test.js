import assert from "node:assert/strict";
import test from "node:test";

import {
  createOnlineState,
  OnlineSession,
  playerForRole,
} from "../src/online/online-session.js";

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

test("host binds the first valid player token and rejects a different one", () => {
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
  const first = connection("p-first");
  const other = connection("p-other");

  session.mode = "host";
  session.localPlayer = "X";
  session.handleHostConnection(first);
  session.handleHostConnection(other);

  assert.equal(session.guestToken, "p-first");
  assert.equal(session.connection, first);
  assert.equal(typeof other.handlers.open, "function");
});
