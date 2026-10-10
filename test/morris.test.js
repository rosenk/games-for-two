import test from "node:test";
import assert from "node:assert/strict";
import { createGameState, makeMove, restoreGame, serializeGame, startRound, resetScore } from "../src/game/game-state.ts";
import { morrisActions, morrisMovement } from "../src/game/morris.ts";
import { chooseComputerMove } from "../src/game/computer.ts";
import { createMatchUrl, createRoomId, parseMatchRoute } from "../src/online/match-url.js";
import { matchmakerSocketUrl } from "../src/online/matchmaker.js";

function position(x, o, reserve = { X: 0, O: 0 }) {
  const game = createGameState("morris");
  for (const i of x) game.board[i] = "X";
  for (const i of o) game.board[i] = "O";
  game.morris.reserve = reserve;
  return game;
}
const play = (game, action) => makeMove(game, action, game.currentPlayer);

test("placement alternates; mills require a capture and protect enemy mills", () => {
  let game = createGameState("morris");
  assert.equal(game.board.length, 24);
  assert.equal(makeMove(game, 0, "O"), game);
  for (const action of [-1, 600, 0.5, NaN, morrisMovement(0, 1)]) assert.equal(play(game, action), game);
  for (const index of [0, 8, 1, 9, 16, 10, 16, 2]) game = play(game, index);
  assert.equal(game.currentPlayer, "X");
  assert.equal(game.morris.capture, true);
  assert.equal(play(game, 0), game);
  assert.equal(play(game, 3), game);
  // Give O an exposed piece: only it may be removed.
  const exposed = { ...game, board: [...game.board] };
  exposed.board[12] = "O";
  assert.deepEqual(morrisActions(exposed), [12]);
  assert.equal(play(exposed, 8), exposed); // O's 8-9-10 mill is protected.
  const removed = play(exposed, 12);
  assert.equal(removed.currentPlayer, "O");
  assert.equal(removed.board[12], null);
  assert.equal(removed.morris.capture, false);
  // If every opponent piece is in a mill, any may be captured.
  assert.deepEqual(morrisActions(game), [8, 9, 10]);
  assert.equal(play(game, 9).board[9], null);
  assert.equal(game.board[9], "O");
  assert.equal(game.gameOver, false); // reserves prevent premature loss.
});

test("movement follows edges, flight starts at three pieces, double mills give one capture", () => {
  const game = position([0, 2, 9, 17], [4, 6, 12, 14]);
  assert.equal(play(game, 1), game); // no placements after reserve exhausted
  assert.equal(play(game, morrisMovement(0, 3)), game);
  assert.equal(play(game, morrisMovement(0, 8)), game); // corners do not connect squares
  assert.equal(play(game, morrisMovement(0, 4)), game); // occupied destination
  assert.equal(play(game, morrisMovement(4, 3)), game); // enemy source
  const double = play(game, morrisMovement(0, 1));
  // This move only makes radial 1-9-17; 0 was vacated.
  assert.equal(double.board[0], null);
  assert.equal(double.morris.capture, true);
  const fly = position([0, 2, 16], [8, 10, 12, 14]);
  const flown = play(fly, morrisMovement(16, 1));
  assert.equal(flown.board[16], null);
  assert.equal(flown.board[1], "X");
  assert.equal(flown.morris.capture, true);
  const twoMills = position([0, 2, 9, 17, 7], [8, 10, 12], { X: 1, O: 0 });
  const closed = play(twoMills, 1);
  assert.equal(closed.morris.capture, true);
  const won = play(closed, 12);
  assert.equal(won.morris.capture, false);
  assert.equal(won.gameOver, true);
  assert.equal(won.morris.result, "X");
  assert.equal(won.scores.X, 1);
  assert.equal(play(won, 8), won);
  assert.deepEqual(restoreGame(serializeGame(won)), won);
});

test("immobilizing four enemy pieces wins, even without a capture", () => {
  const game = position([1, 3, 5, 15], [0, 2, 4, 6]);
  const won = play(game, morrisMovement(15, 7));
  assert.equal(won.gameOver, true);
  assert.equal(won.morris.result, "X");
  assert.equal(won.scores.X, 1);
  assert.deepEqual(restoreGame(serializeGame(won)), won);
  const next = startRound(won);
  assert.equal(next.currentPlayer, "O");
  assert.deepEqual(next.morris.reserve, { X: 9, O: 9 });
  assert.ok(next.board.every((c) => c === null));
  assert.equal(next.scores.X, 1);
  assert.deepEqual(resetScore(won).scores, { X: 0, O: 0, draw: 0 });
});

test("threefold repetition and 100 quiet turns draw, captures reset the counters", () => {
  let game = position([0, 3, 12, 18], [2, 6, 8, 20]);
  const cycle = [morrisMovement(0, 1), morrisMovement(6, 5), morrisMovement(1, 0), morrisMovement(5, 6)];
  // Reach movement via a legal move, then repeat the same board and player.
  game = play(game, cycle[0]);
  for (const action of [...cycle.slice(1), ...cycle, cycle[0]]) game = play(game, action);
  assert.equal(game.gameOver, true);
  assert.equal(game.morris.result, "draw");
  assert.equal(game.scores.draw, 1);
  assert.deepEqual(restoreGame(serializeGame(game)), game);
  const quiet = position([0, 3, 12, 18], [2, 6, 8, 20]);
  quiet.morris.quiet = 99;
  const draw = play(quiet, cycle[0]);
  assert.equal(draw.morris.result, "draw");
  const capture = position([0, 2, 9, 17], [4, 6, 12, 14]);
  capture.morris.quiet = 99;
  const mill = play(capture, morrisMovement(0, 1));
  assert.equal(mill.gameOver, false); // must finish capture before testing draw
  const removed = play(mill, 4);
  assert.equal(removed.morris.quiet, 0);
  assert.equal(removed.morris.history.length, 1);
});

test("snapshots preserve pending captures and reject malformed Morris state", () => {
  let game = createGameState("morris");
  for (const index of [0, 8, 1, 10, 2]) game = play(game, index);
  const wire = serializeGame(game);
  assert.deepEqual(restoreGame(wire), game);
  const restored = restoreGame(wire);
  restored.morris.reserve.X = 0;
  restored.morris.history.push("bad");
  restored.board[0] = null;
  assert.equal(wire.morris.reserve.X, 6);
  assert.equal(wire.morris.history.length, 0);
  assert.equal(wire.board[0], "X");
  for (const patch of [{ reserve: { X: 10, O: 7 } }, { reserve: { X: 7, O: 7 } },
    { capture: "yes" }, { quiet: -1 }, { history: ["bad"] }, { result: "O" }]) {
    assert.equal(restoreGame({ ...wire, morris: { ...wire.morris, ...patch } }), null);
  }
  assert.equal(restoreGame({ ...wire, morris: undefined }), null);
  assert.equal(restoreGame({ ...wire, board: [] }), null);
  assert.equal(restoreGame({ ...wire, gameOver: true }), null);
});

test("strong bot takes a winning mill and blocks a forced loss", () => {
  const win = position([0, 1, 9], [8, 10, 12], { X: 1, O: 0 });
  const before = structuredClone(win);
  const action = chooseComputerMove(win);
  const mill = play(win, action);
  assert.equal(mill.morris.capture, true);
  const capture = chooseComputerMove(mill);
  assert.equal(play(mill, capture).morris.result, "X");
  assert.deepEqual(win, before);
  const defend = position([0, 8], [2, 3, 10], { X: 1, O: 0 });
  // O can fly 10→4 and capture: with no reserve X would drop from 3 to 2.
  assert.equal(chooseComputerMove(defend), 4);
  const remove = position([4, 5, 6], [0, 1, 12, 19]);
  remove.morris.capture = true;
  // Removing 12 or 19 leaves O free to fly into 2 and win by capturing X's third piece.
  assert.ok([0, 1].includes(chooseComputerMove(remove)));
});

test("Morris invitation and matchmaking routes use the shared game contract", async () => {
  const room = await createRoomId("a".repeat(43), "b".repeat(32));
  const url = new URL(createMatchUrl("https://example.com/", room, "morris"));
  assert.deepEqual(parseMatchRoute(url.search), { roomId: room, game: "morris", boardSize: 3, valid: true });
  assert.equal(matchmakerSocketUrl("https://match.example", room, "morris"), `wss://match.example/match?room=${room}&game=morris`);
});
