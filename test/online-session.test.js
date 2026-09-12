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
