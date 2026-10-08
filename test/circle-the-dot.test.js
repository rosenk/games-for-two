import test from "node:test";
import assert from "node:assert/strict";
import { playDotTurn, dotComputerMove, createDotGame, dotNeighbors, escapeDistances } from "../src/game/circle-the-dot.ts";
import { createGameState, makeMove, serializeGame, restoreGame, startRound, resetScore } from "../src/game/game-state.ts";
import { createMatchUrl, createRoomId, parseMatchRoute } from "../src/online/match-url.js";
import { matchmakerSocketUrl } from "../src/online/matchmaker.js";

const empty = (dot = 60) => ({ blocked: Array(121).fill(false), dot, moves: 0, result: "playing", blocker: "X" });

test("staggered rows have six neighbors without wrapping across edges", () => {
  assert.deepEqual(dotNeighbors(60), [59, 61, 49, 50, 71, 72]);
  assert.deepEqual(dotNeighbors(49), [48, 50, 38, 37, 60, 59]);
  assert.deepEqual(dotNeighbors(0), [1, 11]);
  for (let i = 0; i < 121; i++) {
    for (const neighbor of dotNeighbors(i)) assert.ok(dotNeighbors(neighbor).includes(i));
  }
});

test("new boards have 18 obstacles and an open route from the center", () => {
  for (let i = 0; i < 100; i++) {
    const game = createDotGame();
    assert.equal(game.dot, 60);
    assert.equal(game.moves, 0);
    assert.equal(game.blocked.filter(Boolean).length, 18);
    assert.ok([60, 59, 61, 49, 50, 71, 72].every((index) => !game.blocked[index]));
    assert.ok(Number.isFinite(escapeDistances(game.blocked)[60]));
  }
});

test("closing the last route wins even when the dot can still move inside the enclosure", () => {
  const game = empty();
  // Two open circles inside an otherwise blocked field, connected to the edge by a corridor.
  game.blocked.fill(true);
  for (const index of [60, 61, 62, 63, 64, 65]) game.blocked[index] = false;
  const next = playDotTurn(game, 62, true);
  assert.equal(next.result, "trapped");
  assert.equal(next.dot, 60);
  assert.equal(next.moves, 1);
  assert.equal(game.blocked[62], false);
  assert.equal(playDotTurn(next, 61, false), next);
});

test("dot follows the available detour rather than a blocked direct route", () => {
  const game = empty();
  game.blocked.fill(true);
  for (const index of [60, 49, 38, 27, 16, 5, 61, 62, 63, 64, 65]) game.blocked[index] = false;
  const blocked = playDotTurn(game, 49, true);
  assert.equal(blocked.dot, 60);
  assert.equal(dotComputerMove(blocked, false), 61);
  const next = playDotTurn(blocked, 61, false);
  assert.equal(next.dot, 61);
  assert.equal(next.result, "playing");
  assert.equal(next.moves, 1);
});

test("reaching the boundary loses, and invalid clicks do not consume a turn", () => {
  const game = empty(64);
  game.blocked.fill(true);
  for (const index of [63, 64, 65, 0]) game.blocked[index] = false;
  for (const index of [64, 1, -1, 121, 1.5, NaN]) assert.equal(playDotTurn(game, index, true), game);
  const blocked = playDotTurn(game, 0, true);
  const next = playDotTurn(blocked, 65, false);
  assert.equal(next.dot, 65);
  assert.equal(next.result, "escaped");
  assert.equal(playDotTurn(next, 63, false), next);
});

test("human turns alternate, reject teleports and preserve role assignments", () => {
  for (const blocker of ["X", "O"]) {
    const runner = blocker === "X" ? "O" : "X";
    const game = { ...createGameState("circle-the-dot"), dotGame: { ...empty(), blocker }, currentPlayer: blocker };
    assert.equal(makeMove(game, 0, runner), game);
    const blocked = makeMove(game, 0, blocker);
    assert.equal(blocked.currentPlayer, runner);
    assert.equal(blocked.dotGame.dot, 60);
    assert.equal(makeMove(blocked, 2, runner), blocked);
    assert.equal(makeMove(blocked, 61, blocker), blocked);
    const moved = makeMove(blocked, 61, runner);
    assert.equal(moved.dotGame.dot, 61);
    assert.equal(moved.currentPlayer, blocker);
    assert.equal(moved.dotGame.moves, 1);
    assert.equal(moved.dotGame.blocked[61], false);
    assert.equal(startRound(moved).currentPlayer, blocker);
    assert.equal(startRound(moved).dotGame.blocker, blocker);
  }
});

test("both endings credit the correct player once, including reversed roles", () => {
  for (const blocker of ["X", "O"]) {
    const runner = blocker === "X" ? "O" : "X";
    const game = createGameState("circle-the-dot");
    const trapped = { ...empty(), blocker };
    for (const i of [59, 49, 50, 71, 72, ...Array.from({ length: 13 }, (_, i) => i)]) trapped.blocked[i] = true;
    const won = makeMove({ ...game, dotGame: trapped, currentPlayer: blocker }, 61, blocker);
    assert.equal(won.scores[blocker], 1);
    assert.equal(won.scores[runner], 0);
    assert.equal(won.gameOver, true);
    assert.equal(makeMove(won, 62, runner), won);
    assert.deepEqual(restoreGame(serializeGame(won)), won);
    const escaping = { ...empty(64), blocker };
    for (let i = 0; i < 19; i++) escaping.blocked[i] = true;
    escaping.moves = 1;
    const escaped = makeMove({ ...game, dotGame: escaping, currentPlayer: runner }, 65, runner);
    assert.equal(escaped.scores[runner], 1);
    assert.equal(escaped.scores[blocker], 0);
    assert.equal(escaped.gameOver, true);
    assert.deepEqual(restoreGame(serializeGame(escaped)), escaped);
    assert.deepEqual(resetScore(escaped).scores, { X: 0, O: 0, draw: 0 });
  }
});

test("computer blocker cuts the only escape corridor", () => {
  const game = empty(64);
  game.blocked.fill(true);
  for (const index of [63, 64, 65, 0]) game.blocked[index] = false;
  assert.equal(dotComputerMove(game, true), 65);
  assert.equal(playDotTurn(game, 65, true).result, "trapped");
});

test("network snapshots deep-copy dot state and reject corrupt data", () => {
  const game = createGameState("circle-the-dot");
  const index = game.dotGame.blocked.findIndex((occupied, i) => !occupied && i !== 60);
  const moved = makeMove(game, index, "X");
  const wire = serializeGame(moved);
  assert.deepEqual(restoreGame(wire), moved);
  const restored = restoreGame(wire);
  restored.dotGame.blocked[index] = false;
  assert.equal(wire.dotGame.blocked[index], true);
  for (const patch of [{ dot: -1 }, { dot: index }, { dot: 121 }, { moves: 0 },
    { blocker: "bad" }, { result: "escaped" }, { blocked: [] }]) {
    assert.equal(restoreGame({ ...wire, dotGame: { ...wire.dotGame, ...patch } }), null);
  }
  assert.equal(restoreGame({ ...wire, gameOver: true }), null);
  assert.equal(restoreGame({ ...wire, dotGame: undefined }), null);
});

test("invitations and matching support circle-the-dot without changing old defaults", async () => {
  const room = await createRoomId("a".repeat(43), "b".repeat(32));
  const url = new URL(createMatchUrl("https://example.com/", room, "circle-the-dot"));
  assert.deepEqual(parseMatchRoute(url.search), { roomId: room, game: "circle-the-dot", boardSize: 3, valid: true });
  assert.equal(matchmakerSocketUrl("https://match.example", room, "circle-the-dot"), `wss://match.example/match?room=${room}&game=circle-the-dot`);
});
