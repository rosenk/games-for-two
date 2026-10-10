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

test("automatically enables microphones for both roles, preserving manual off on reconnect", async () => {
  const originalWindow = globalThis.window;
  const mediaDescriptor = Object.getOwnPropertyDescriptor(navigator, "mediaDevices");
  let requests = 0;
  let stopped = 0;
  const stream = { getTracks: () => [{ stop: () => stopped++ }] };
  globalThis.window = {
    setTimeout: () => 1,
    clearTimeout() {},
    setInterval: () => 1,
    clearInterval() {},
  };
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia: async () => { requests++; return stream; } },
  });
  try {
    for (const mode of ["host", "guest"]) {
      const sent = [];
      const session = new OnlineSession({
        getGameState: () => ({}),
        getRemoteAudio: () => null,
        onChange: () => {},
      });
      session.mode = mode;
      const connection = () => ({ open: true, on() {}, send: (data) => sent.push(data) });
      session.attachConnection(connection());
      assert.equal(session.snapshot().audioBusy, true);
      await Promise.resolve();
      assert.equal(session.snapshot().audioEnabled, true);
      assert.ok(sent.some((data) => data.type === "audio-ready"));

      session.attachConnection(connection());
      assert.equal(session.snapshot().audioEnabled, true);
      await session.toggleAudio();
      assert.equal(session.snapshot().audioEnabled, false);
      assert.equal(sent.at(-1).type, "audio-off");
      session.attachConnection(connection());
      await Promise.resolve();
      assert.equal(session.snapshot().audioEnabled, false);
      session.destroy();
    }
    assert.equal(requests, 2);
    assert.equal(stopped, 2);
  } finally {
    globalThis.window = originalWindow;
    if (mediaDescriptor) Object.defineProperty(navigator, "mediaDevices", mediaDescriptor);
    else delete navigator.mediaDevices;
  }
});

test("microphone denial permits retry and a late permission result cannot enter a new session", async () => {
  const mediaDescriptor = Object.getOwnPropertyDescriptor(navigator, "mediaDevices");
  let resolve;
  let stopped = false;
  const session = new OnlineSession({ getRemoteAudio: () => null, onChange: () => {} });
  session.connected = true;
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia: async () => { throw new Error("denied"); } },
  });
  try {
    await session.toggleAudio();
    assert.equal(session.snapshot().audioEnabled, false);
    assert.equal(session.snapshot().audioBusy, false);
    assert.match(session.snapshot().audioError, /Разреши достъп/);
    navigator.mediaDevices.getUserMedia = () => new Promise((done) => { resolve = done; });
    const pending = session.toggleAudio();
    await session.toggleAudio();
    session.leave();
    session.connected = true;
    resolve({ getTracks: () => [{ stop: () => { stopped = true; } }] });
    await pending;
    assert.equal(stopped, true);
    assert.equal(session.snapshot().audioEnabled, false);
    assert.equal(session.snapshot().audioError, "");
  } finally {
    if (mediaDescriptor) Object.defineProperty(navigator, "mediaDevices", mediaDescriptor);
    else delete navigator.mediaDevices;
  }
});

test("host binds the first valid player token hash and rejects a different one", async () => {
  let acceptedHash = "";
  const phases = [];
  const session = new OnlineSession({
    getRemoteAudio: () => null,
    onChange: (state) => phases.push(state.phase),
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
  assert.equal(phases.includes("joining"), true);
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

test("remote graceful leave releases the hosted room", () => {
  let released = false;
  let closed = false;
  const session = new OnlineSession({
    getRemoteAudio: () => null,
    onChange: () => {},
    onRemoteLeave: () => {
      released = true;
    },
  });
  session.mode = "host";
  session.acceptedPlayerTokenHash = "a".repeat(43);
  session.connection = {
    close: () => {
      closed = true;
    },
  };

  session.handleConnectionData({ type: "leave" });

  assert.equal(released, true);
  assert.equal(closed, true);
  assert.equal(session.acceptedPlayerTokenHash, "");
});

test("remote graceful leave also notifies the guest", () => {
  let notified = false;
  const session = new OnlineSession({
    getRemoteAudio: () => null,
    onChange: () => {},
    onRemoteLeave: () => {
      notified = true;
    },
  });
  session.mode = "guest";

  session.handleConnectionData({ type: "leave" });

  assert.equal(notified, true);
  assert.equal(session.reconnectEnabled, false);
});

test("inactive matches notify the opponent and enter the expired state", () => {
  const sent = [];
  const phases = [];
  const session = new OnlineSession({
    getRemoteAudio: () => null,
    onChange: (state) => phases.push(state.phase),
  });
  session.mode = "host";
  session.connection = {
    open: true,
    send: (message) => sent.push(message),
    close() {},
  };

  session.expire();

  assert.deepEqual(sent, [{ type: "expired" }]);
  assert.equal(phases.at(-1), "expired");
  assert.equal(session.connected, false);
});

test("shows a brief arrival phase before the stable connected state", () => {
  const originalWindow = globalThis.window;
  let finishArrival;
  globalThis.window = {
    clearInterval() {},
    clearTimeout() {},
    setTimeout(callback) {
      finishArrival = callback;
      return 1;
    },
  };

  try {
    const phases = [];
    const session = new OnlineSession({
      getGameState: () => ({}),
      getRemoteAudio: () => null,
      onChange: (state) => phases.push(state.phase),
    });
    const connection = {
      open: true,
      handlers: {},
      on(event, handler) {
        this.handlers[event] = handler;
      },
      send() {},
    };
    session.mode = "host";

    session.attachConnection(connection);
    assert.equal(phases.at(-1), "arrived");

    finishArrival();
    assert.equal(phases.at(-1), "connected");
  } finally {
    globalThis.window = originalWindow;
  }
});

test("retries when a guest connection never opens or fails", () => {
  const originalWindow = globalThis.window;
  const timers = [];
  globalThis.window = {
    clearInterval() {},
    clearTimeout() {},
    setTimeout(callback, delay) {
      timers.push({ callback, delay });
      return timers.length;
    },
  };

  try {
    const phases = [];
    let closed = false;
    const session = new OnlineSession({
      getRemoteAudio: () => null,
      onChange: (state) => phases.push(state.phase),
    });
    const connection = {
      open: false,
      handlers: {},
      on(event, handler) {
        this.handlers[event] = handler;
      },
      close() {
        closed = true;
      },
    };
    session.mode = "guest";
    session.attachConnection(connection);

    const connectionTimeout = timers.find(({ delay }) => delay === 10000);
    assert.ok(connectionTimeout);
    connectionTimeout.callback();

    assert.equal(closed, true);
    assert.equal(session.connection, null);
    assert.equal(phases.at(-1), "reconnecting");
    assert.equal(timers.some(({ delay }) => delay === 1500), true);
  } finally {
    globalThis.window = originalWindow;
  }
});
