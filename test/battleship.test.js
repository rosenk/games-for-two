import assert from "node:assert/strict";
import test from "node:test";
import { createGameState, makeMove, restoreGame, serializeGame, startRound, resetScore } from "../src/game/game-state.ts";
import { battleView } from "../src/game/battleship/rules.ts";
import { chooseComputerMove } from "../src/game/computer.ts";
import { createMatchUrl, parseMatchRoute } from "../src/online/match-url.js";

function prepared() {
  let game = createGameState("battleship");
  // X: horizontal ships. O: vertical ships with distinct coordinates.
  for (const move of [0, 20, 40, 60, 80, 202, 100, 102, 104, 106, 108, 202]) {
    const next = makeMove(game, move, game.currentPlayer);
    assert.notEqual(next, game);
    game = next;
  }
  return game;
}

test("placement rejects wraparound, contact, overlap, wrong players and premature readiness; undo and random fleets work", () => {
  const initial = createGameState("battleship");
  for (const move of [6, 160, 202, 201, -1, 203, 1.5]) assert.equal(makeMove(initial, move, "X"), initial);
  assert.equal(makeMove(initial, 0, "O"), initial);
  const first = makeMove(initial, 0, "X");
  assert.deepEqual(first.battle.fleets.X, [[0, 1, 2, 3, 4]]);
  for (const move of [0, 5, 15, 104]) assert.equal(makeMove(first, move, "X"), first);
  assert.deepEqual(makeMove(first, 201, "X").battle.fleets.X, []);
  for (let i = 0; i < 30; i++) {
    const random = makeMove(first, 200, "X");
    assert.deepEqual(random.battle.fleets.X.map((ship) => ship.length), [5, 4, 3, 3, 2]);
    assert.deepEqual(restoreGame(serializeGame(random)), random);
  }
  assert.deepEqual(initial.battle.fleets.X, []);
  const ready = makeMove(makeMove(first, 200, "X"), 202, "X");
  assert.equal(ready.currentPlayer, "O");
  assert.equal(makeMove(ready, 0, "X"), ready);
});

test("shots alternate even on hits, sink the entire ship, reject repeats and credit a victory only once", () => {
  let game = prepared();
  const targets = [0, 10, 20, 30, 40, 2, 12, 22, 32, 4, 14, 24, 6, 16, 26, 8, 18];
  for (let n = 0; n < targets.length; n++) {
    const before = game;
    assert.equal(makeMove(game, 200, "X"), game);
    game = makeMove(game, targets[n], "X");
    assert.equal(before.battle.shots.X[targets[n]], null);
    assert.equal(game.gameOver, n === 16);
    assert.deepEqual(restoreGame(serializeGame(game)), game);
    if (n === 0) assert.equal(game.battle.shots.X[0], "hit");
    if (n === 4) assert.deepEqual([0, 10, 20, 30, 40].map((i) => game.battle.shots.X[i]), Array(5).fill("sunk"));
    if (n < 16) {
      assert.equal(game.currentPlayer, "O");
      assert.equal(makeMove(game, targets[n], "X"), game);
      game = makeMove(game, 90 + n % 10 + Math.floor(n / 10) * -20, "O");
      assert.equal(game.currentPlayer, "X");
      assert.equal(makeMove(game, targets[n], "X"), game);
    }
  }
  assert.deepEqual(game.scores, { X: 1, O: 0, draw: 0 });
  assert.equal(makeMove(game, 99, "X"), game);
  const next = startRound(game);
  assert.equal(next.battle.starter, "O");
  assert.equal(next.currentPlayer, "O");
  assert.deepEqual(next.battle.fleets, { X: [], O: [] });
  assert.equal(next.scores.X, 1);
  assert.deepEqual(restoreGame(serializeGame(next)), next);
  assert.equal(resetScore(game).battle.starter, "X");
});

test("recipient snapshots hide opposing fleets for either role, retain public shots, and cannot replace full recovery records", () => {
  let game = prepared();
  game = makeMove(game, 2, "X");
  for (const viewer of ["X", "O"]) {
    const opponent = viewer === "X" ? "O" : "X";
    const view = battleView(game, viewer);
    const wire = serializeGame(view);
    assert.equal(wire.battle.fleets[opponent], null);
    assert.deepEqual(wire.battle.fleets[viewer], game.battle.fleets[viewer]);
    assert.deepEqual(wire.battle.shots, game.battle.shots);
    assert.deepEqual(restoreGame(wire, viewer), view);
    assert.equal(restoreGame(wire), null);
    assert.equal(restoreGame(wire, opponent), null);
    assert.equal(makeMove(view, 90, view.currentPlayer), view);
    wire.battle.fleets[viewer][0][0] = 99;
    assert.notEqual(game.battle.fleets[viewer][0][0], 99);
  }
  assert.deepEqual(restoreGame(serializeGame(game)), game);
});

test("restoration rejects malformed ships, false hit results, false endings and inconsistent turns", () => {
  const state = serializeGame(prepared());
  for (const mutate of [
    (s) => s.battle.fleets.O[0][1] = 11,
    (s) => s.battle.fleets.X[1] = [10, 11, 12, 13],
    (s) => s.battle.fleets.X[0] = [6, 7, 8, 9, 10],
    (s) => s.battle.shots.X[99] = "hit",
    (s) => s.battle.shots.X[0] = "miss",
    (s) => s.battle.shots.X = [],
    (s) => s.currentPlayer = "O",
    (s) => s.gameOver = true,
    (s) => s.battle.ready.O = false,
  ]) {
    const corrupt = structuredClone(state);
    mutate(corrupt);
    assert.equal(restoreGame(corrupt), null);
  }
});

test("bot completes aligned hits, uses only visible information, and can finish a full legal game", () => {
  let game = prepared();
  for (const [move, player] of [[2, "X"], [99, "O"], [12, "X"], [98, "O"]]) game = makeMove(game, move, player);
  const view = battleView(game, "X");
  const before = structuredClone(view);
  for (let n = 0; n < 20; n++) assert.equal(chooseComputerMove(view), 22);
  assert.deepEqual(view, before);
  game = createGameState("battleship");
  let turns = 0;
  while (!game.gameOver && turns++ < 205) {
    const move = chooseComputerMove(battleView(game, game.currentPlayer));
    const next = makeMove(game, move, game.currentPlayer);
    assert.notEqual(next, game);
    assert.deepEqual(restoreGame(serializeGame(next)), next);
    game = next;
  }
  assert.equal(game.gameOver, true);
  assert.equal(game.scores.X + game.scores.O, 1);
});

test("Battleship invitations preserve the game identity", () => {
  const room = `ttt-${"1".repeat(32)}${"2".repeat(32)}`;
  const url = createMatchUrl("https://example.com/", room, "battleship");
  assert.deepEqual(parseMatchRoute(new URL(url).search), { roomId: room, game: "battleship", boardSize: 3, valid: true });
});
